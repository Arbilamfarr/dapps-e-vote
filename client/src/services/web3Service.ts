import { ethers } from 'ethers';
import VotingSystem from '../contracts/VotingSystem.json';

class Web3Service {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private readyPromise: Promise<void>;

  constructor() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    console.log('Initializing Web3Service...');
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.readyPromise = this.init();
  }

  private async init() {
    try {
      console.log('Getting signer from provider...');
      this.signer = await this.provider.getSigner();
      console.log('Signer obtained:', this.signer);

      const networkId = '5777'; // Replace with your network ID
      const contractAddress = VotingSystem.networks[networkId]?.address;

      if (!contractAddress) {
        throw new Error(`Contract address not found for network ID: ${networkId}`);
      }

      console.log(`Initializing contract with address: ${contractAddress}`);
      this.contract = new ethers.Contract(contractAddress, VotingSystem.abi, this.signer);
      console.log('Contract initialized:', this.contract);
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  private async ensureReady() {
    console.log('Ensuring service is ready...');
    await this.readyPromise;
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
  }

  async startElection(durationInMinutes: number) {
    try {
      console.log('Starting election with duration (minutes):', durationInMinutes);
      await this.ensureReady();
      const tx = await this.contract!.startElection(durationInMinutes);
      console.log('Transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error starting election:', error);
      throw error;
    }
  }

  async endElection() {
    try {
      console.log('Ending election...');
      await this.ensureReady();
      const tx = await this.contract!.endElection();
      console.log('Transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error ending election:', error);
      throw error;
    }
  }

  async vote(candidateId: number) {
    console.log('Voting for candidate ID:', candidateId);
    try {
      console.log('Voting for candidate ID:', candidateId);
      await this.ensureReady();
      const tx = await this.contract!.vote(candidateId);
      console.log('Transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }

  async registerVoter(voterAddress: string) {
    try {
      // Vérifiez que le contrat est initialisé
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
  
      // Envoyer la transaction pour enregistrer le votant
      console.log(`Registering voter at address: ${voterAddress}`);
      const tx = await this.contract.registerVoter(voterAddress);
  
      // Attendre que la transaction soit minée
      const receipt = await tx.wait();
      console.log('Transaction successful:', receipt);
  
      return receipt;
    } catch (error: any) {
      // Gestion des erreurs
      console.error('Error while registering voter:', error);
  
      // Analyser les raisons spécifiques des erreurs (ex. ethers.js ou revert)
      if (error.code === 'CALL_EXCEPTION') {
        throw new Error(
          `Contract call failed. Please check the contract's logic or gas limit.`
        );
      }
  
      if (error.code === 'UNSUPPORTED_OPERATION') {
        throw new Error(
          `Unsupported operation. Ensure the contract's ABI and method are correct.`
        );
      }
  
      // Renvoyer l'erreur originale si aucune correspondance spécifique
      throw new Error(error.message || 'An unknown error occurred');
    }
  }

  async getElectionStatus() {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.getElectionStatus();
  }

  async getCandidatesCount() {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.candidatesCount();
  }

  async getCandidate(id: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.getCandidate(id);
  }

  async isVoterRegistered(address: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.voters(address);
  }

  async hasVoted(address: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.hasVoted(address);
  }

  async getAdmin() {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.admin();
  }
  async registerCandidate(name: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.addCandidate(name);
    await tx.wait();
  }
  
  async getAllCandidates()  {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const result = await this.contract.getAllCandidates();
      const candidates = result[0].map((id:any, index:any) => ({
        id: parseInt(id),
        name: result[1][index],
        voteCount: parseInt(result[2][index]),
      }));
      return candidates;
    } catch (error) {
      console.error("Erreur lors de la récupération des candidats :", error);
      throw error;
    }
  };
  
  
}

export const web3Service = new Web3Service();