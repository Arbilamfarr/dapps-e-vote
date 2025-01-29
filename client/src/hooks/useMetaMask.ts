import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { ExternalProvider } from '@metamask/providers';
import VotingSystemABI from '../contracts/VotingSystem.json'; // Importez l'ABI du contrat
import  {CONTRACTADDRESS}  from '../constante/constate.ts';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
} 

// Define the return type for useMetaMask hook
interface UseMetaMaskReturn {
  account: string;
  error: string;
  isConnecting: boolean;
  adminAddress: string;
  isAdmin: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useMetaMask = (): UseMetaMaskReturn => {
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [adminAddress, setAdminAddress] = useState<string>(''); // Ajout pour l'adresse admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Ajout pour vérifier si l'utilisateur est admin

  
  const contractAddress = CONTRACTADDRESS;

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setError('');

      // Récupérer l'adresse de l'administrateur après la connexion
      const contract = new ethers.Contract(
        contractAddress, // Remplacez par l'adresse du contrat déployé
        VotingSystemABI.abi,
        provider
      );
      const admin = await contract.admin();
      setAdminAddress(admin.toLowerCase());
      
      // Vérifier si l'utilisateur connecté est l'administrateur
      if (accounts[0].toLowerCase() === admin.toLowerCase()) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsAdmin(false);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
        setIsAdmin(accounts[0]?.toLowerCase() === adminAddress?.toLowerCase());
      });

      // Auto-connect if previously connected
      if (localStorage.getItem('walletConnected')) {
        connectWallet();
      }
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [adminAddress]);

  return { account, error, isConnecting, adminAddress, isAdmin, connectWallet, disconnectWallet };
};
