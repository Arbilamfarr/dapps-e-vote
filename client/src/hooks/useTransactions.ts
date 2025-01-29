import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { ExternalProvider } from '@metamask/providers';
import { NETWORK_URL } from '../constante/constate';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export const useTransactions = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Récupérer les transactions à partir de Ganache
  const fetchTransactionsFromGanache = async (walletAddress: string) => {
    try {
      setLoading(true);
      setError('');

      const provider = new ethers.JsonRpcProvider(NETWORK_URL);
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
              // Récupérer la date de la transaction à partir du bloc
              const transactionDate = new Date(block.timestamp * 1000); // Timestamp en secondes, conversion en millisecondes
              fetchedTransactions.push({ ...transaction, date: transactionDate });
            }
          }
        }
      }

      setTransactions(fetchedTransactions);
      console.log(fetchedTransactions);
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
