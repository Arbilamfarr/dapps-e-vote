import  { useState, useEffect } from "react";
import { Vote, AlertCircle } from "lucide-react";
import { web3Service } from "../services/web3Service";
import { useMetaMask } from "../hooks/useMetaMask";

type Candidate = {
  id: number;
  name: string;
  voteCount: number;
};

export const VotingArea = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState("");
  const {account}=useMetaMask();
 

  // Récupérer les candidats au chargement
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        
        const candidateCount = await web3Service.getCandidatesCount();
        const fetchedCandidates: Candidate[] = [];

        for (let i = 1; i <= candidateCount; i++) {
          const candidate = await web3Service.getCandidate(i);
          fetchedCandidates.push({
            id: parseInt(candidate[0]),
            name: candidate[1],
            voteCount: parseInt(candidate[2]),
          });
        }

        setCandidates(fetchedCandidates);
      } catch (err) {
        console.error("Erreur lors de la récupération des candidats :", err);
        setError("Impossible de charger les candidats. Vérifiez votre connexion ou contrat.");
      }
    };
    const  verifeirHasVoted = async (address: string) => {
      const voted = await web3Service.hasVoted(address);
      setHasVoted(voted);
    }

    fetchCandidates();
    verifeirHasVoted(account); // replace with the actual address
  }, [account,]);

  // Gérer le vote
  const handleVote = async () => {
    if (!selectedCandidate) {
      setError("Veuillez sélectionner un candidat avant de voter.");
      return;
    }

    setIsVoting(true);
    setError("");
    try {
      await web3Service.vote(selectedCandidate);
      setHasVoted(true);
    } catch (err) {
      console.error("Erreur lors du vote :", err);
      setError("Le vote a échoué. Veuillez réessayer.");
    } finally {
      setIsVoting(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Vote className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Merci pour votre vote !</h3>
          <p className="mt-2 text-sm text-gray-500">
            Votre vote a été enregistré sur la blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votez pour un candidat</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Choisissez votre candidat avec attention. Votre vote est final et ne peut pas être changé.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-200"
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
              <p className="text-sm text-gray-500">Votes actuels : {candidate.voteCount}</p>
              {selectedCandidate === candidate.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-4 w-4 rounded-full bg-indigo-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || isVoting}
          className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isVoting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Traitement...
            </>
          ) : (
            <>
              <Vote className="h-5 w-5 mr-2" />
              Voter
            </>
          )}
        </button>
      </div>
    </div>
  );
};
