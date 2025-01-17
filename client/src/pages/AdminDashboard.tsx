import  { useState, useEffect } from 'react';
import { Users, UserPlus, Play, Square, Award } from 'lucide-react';
import { web3Service } from '../services/web3Service';
import { AddVoterModal } from '../components/AddVoterModal';
import { VotersList } from './VotersList';
import { AddCandidateModal } from '../components/AddCandidateModal';
import { CandidatesList } from './CandidatesList';
import { apiService } from '../services/apiService';

export const AdminDashboard = () => {
  const [electionStatus, setElectionStatus] = useState('closed');
  const [candidates, setCandidates] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVotersList, setShowVotersList] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [showCandidatesList, setShowCandidatesList] = useState(false);
  const [countVoters, setCountVoters] = useState(0);

  useEffect(() => {
    loadElectionData();
  }, []);

  const loadElectionData = async () => {
    try {
      const status = await web3Service.getElectionStatus();
      setElectionStatus(status.isOpen ? 'active' : 'closed');
      
      const candidatesCount = await web3Service.getCandidatesCount();
      const loadedCandidates = [];
      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await web3Service.getCandidate(i);
        loadedCandidates.push({
          id: candidate.id,
          name: candidate.name,
          votes: candidate.voteCount.toString()
        });
      }
      setCandidates(loadedCandidates);
      const count=await apiService.getNombreUser();
      console.log(count);
      setCountVoters(count);
    } catch (error) {
      console.error('Error loading election data:', error);
    }
  };

  const handleStartElection = async () => {
    try {
      await web3Service.startElection(1800); 
      setElectionStatus('active');
    } catch (error) {
      console.error('Error starting election:', error);
    }
  };

  const handleStopElection = async () => {
    try {
      await web3Service.endElection();
      setElectionStatus('closed');
    } catch (error) {
      console.error('Error stopping election:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Control Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-medium text-gray-900">Total Voters</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{countVoters}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-green-600" />
              <span className="text-lg font-medium text-gray-900">Candidates</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-green-600">{candidates.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${electionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-lg font-medium text-gray-900">Status</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-600 capitalize">{electionStatus}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Voter Management</h3>
          <div className="space-y-4">
            <button
              disabled={electionStatus === 'active'}
              onClick={() => setIsModalOpen(true)}
              className={`${electionStatus === 'active'? 'disabled:bg-gray-400 cursor-not-allowed':""} w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add New Voter
            </button>
            <button
              onClick={() => setShowVotersList(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="h-5 w-5 mr-2" />
              View All Voters
            </button>
          </div>
        </div>

         {/* section for managing candidates */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Candidate Management</h3>
          <div className="space-y-4">
            <button
            disabled={electionStatus === 'active'}
              onClick={() => setIsCandidateModalOpen(true)}
              className={`${electionStatus === 'active'? 'disabled:bg-gray-400 cursor-not-allowed':""} w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add New Candidate
            </button>
            <button
              onClick={() => setShowCandidatesList(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="h-5 w-5 mr-2" />
              View All Candidates
            </button>
          </div>
        </div>


        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Election Controls</h3>
          <div className="space-y-4">
            <button
              onClick={handleStartElection}
              disabled={electionStatus === 'active'}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Election
            </button>
            <button
              onClick={handleStopElection}
              disabled={electionStatus === 'closed'}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop Election
            </button>
          </div>
        </div>

        {/* Live Results Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Results</h3>
        <div className="space-y-4">
          {candidates.map((candidate:any) => (
            <div key={candidate.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{candidate.name}</span>
                <span className="text-indigo-600 font-bold">{candidate.votes} votes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(parseInt(candidate.votes) / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>

      
      

      

      {/* Modals */}
      <AddVoterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVoterAdded={loadElectionData}
      />
      
      {showVotersList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <VotersList onClose={() => setShowVotersList(false)} />
          </div>
        </div>
      )}

     <AddCandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        onCandidateAdded={loadElectionData}
      />
   

   {showCandidatesList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CandidatesList onClose={() => setShowCandidatesList(false)} />
          </div>
        </div>
      )}

    </div>
  );
};