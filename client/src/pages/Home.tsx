import { useNavigate } from 'react-router-dom';
import { Vote, ShieldCheck, History } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">E-Vote</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Secure Decentralized Voting
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A transparent and secure voting platform powered by blockchain technology.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Vote className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Cast Your Vote</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Participate in secure elections using blockchain technology.
              </p>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure & Transparent</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                All votes are securely recorded on the blockchain.
              </p>
            </div>

            <div className="relative">
              <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <History className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Track Transactions</p>
              <p className="mt-2 ml-16 text-base text-gray-500">
                Monitor all voting transactions in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center space-x-6">
          {/* <button
            onClick={() => navigate('/vote')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Voting
          </button> */}
          <button
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};