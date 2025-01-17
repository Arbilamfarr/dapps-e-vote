import { useState } from 'react';
import { X } from 'lucide-react';
import { web3Service } from '../services/web3Service';
import { apiService } from '../services/apiService';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: () => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onCandidateAdded }) => {
  const [formData, setFormData] = useState({ name: '', program: '', blockchainId: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Register candidate on blockchain
      await web3Service.registerCandidate(formData.name);

      // Save candidate to database
      await apiService.createCandidate(formData);

      onCandidateAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register candidate.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Candidate</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Program</label>
            <input
              type="text"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Blockchain ID</label>
            <input
              type="number"
              value={formData.blockchainId}
              onChange={(e) => setFormData({ ...formData, blockchainId: parseInt(e.target.value, 10) })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isLoading ? 'Loading...' : 'Add Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
};
