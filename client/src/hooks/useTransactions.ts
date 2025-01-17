import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { ExternalProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
const NETWORK_GANACHE_URL='http://127.0.0.1:7545'
const  NETWORK_SEBOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/7hqzwWyiVckZHXyOsZEdf6A0YebGkZw7"

export const useTransactions = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Récupérer les transactions à partir de Ganache
  const fetchTransactionsFromGanache = async (walletAddress: string) => {
    // const cachedTransactions = localStorage.getItem(walletAddress);
  
    // if (cachedTransactions) {
    //   // Utiliser les transactions en cache
    //   setTransactions(JSON.parse(cachedTransactions));
    //   return;
    // }
  
    try {
      setLoading(true);
      setError('');
  
      const provider = new ethers.JsonRpcProvider(NETWORK_GANACHE_URL);
      // const provider = new ethers.JsonRpcProvider(NETWORK_SEBOLIA_URL);
      const latestBlockNumber = await provider.getBlockNumber();
      const blocksToFetch = 10;
      const fetchedTransactions: any[] = [];
  
      for (let i = latestBlockNumber; i > latestBlockNumber - blocksToFetch && i >= 0; i--) {
        const block = await provider.getBlock(i);
  
        if (block && block.transactions) {
          for (const txHash of block.transactions) {
            const transaction = await provider.getTransaction(txHash);
  
            if (
              transaction?.from.toLowerCase() === walletAddress.toLowerCase() ||
              transaction?.to?.toLowerCase() === walletAddress.toLowerCase()
            ) {
              fetchedTransactions.push(transaction);
            }
          }
        }
      }
  
      // // Mettre en cache les transactions
      // localStorage.setItem(walletAddress, JSON.stringify(fetchedTransactions));
      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error('Failed to fetch transactions from Ganache:', err);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Connexion au portefeuille MetaMask
  const connectToMetaMask = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);

      // Sauvegarder la connexion pour la récupération automatique
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      console.error('Failed to connect to MetaMask:', err);
      setError('Failed to connect to MetaMask.');
    }
  };

  // Détecter les changements d'adresse
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAddress(accounts[0] || null);
        setTransactions([]);
      });

      // Reconnexion automatique si nécessaire
      if (localStorage.getItem('walletConnected')) {
        connectToMetaMask();
      }
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Récupérer les transactions lorsque l'adresse change
  useEffect(() => {
    if (address) {
      fetchTransactionsFromGanache(address);
    }
  }, [address]);

  return { address, transactions, loading, error, connectToMetaMask };
};
