import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Vote, History, Settings, LogOut } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useEffect } from 'react';

export const Layout = () => {
  const { account, connectWallet, disconnectWallet, isConnecting, isAdmin } = useMetaMask();
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    // Si l'utilisateur n'est pas un admin et essaie d'accéder à une page d'administration, redirigez-le
    if (isAdmin === false && window.location.pathname.includes('admin')) {
      navigate('/');
    }
  }, [isAdmin, navigate,account]);

  useEffect(() => {
    // Si l'utilisateur n'est pas un admin et essaie d'accéder à une page d'administration, redirigez-le
    connectWallet();
    console.log("connect wallet")
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              
              <Link to="/" className="flex items-center">
                <Vote className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">E-Vote</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!isAdmin && (
                <Link to="/vote" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Vote
                </Link>
              )}
                <Link to="/transactions" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  <History className="h-4 w-4 mr-1" />
                  Transactions
                </Link>

                {/* Affichage du lien Admin uniquement pour les administrateurs */}
                {isAdmin && (
                  <Link to="/admin" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {account ? (
                <>
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
