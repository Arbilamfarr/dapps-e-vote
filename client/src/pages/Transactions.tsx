import { History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { ethers } from 'ethers';

export const Transactions = () => {
  const { connectToMetaMask, address, transactions, loading, error } = useTransactions();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <div className="flex items-center text-gray-500">
            <History className="h-5 w-5 mr-2" />
            <span>Last 30 days</span>
          </div>
        </div>

        {!address && (
          <button
            onClick={connectToMetaMask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Connect MetaMask
          </button>
        )}

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon('CONFIRMED')}
                  <span className="font-medium text-gray-900">Transaction</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('CONFIRMED')}`}>
                    Confirmed
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Block #{tx.blockNumber}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Transaction Hash</p>
                  <p className="font-mono text-sm">{tx.hash}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From Address</p>
                  <p className="font-mono text-sm">{tx.from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Address</p>
                  <p className="font-mono text-sm">{tx.to || 'Contract Creation'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gas Price</p>
                  <p className="font-mono text-sm">
                    {parseInt(tx.gasPrice || '0', 10).toLocaleString()} wei
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-mono text-sm">
                    {parseFloat(ethers.formatEther(tx.value || '0')).toFixed(4)} ETH
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-mono text-sm">
                  {tx.date.toISOString().split('.')[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
