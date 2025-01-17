// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        bool isOpen;
        uint256 startTime;
        uint256 endTime;
    }

    address public admin;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(address => bool) public hasVoted;
    uint256 public candidatesCount;
    Election public currentElection;

    event VoterRegistered(address voter);
    event VoteCast(address voter, uint256 candidateId);
    event CandidateAdded(uint256 candidateId, string name);
    event ElectionStarted(uint256 startTime, uint256 endTime);
    event ElectionEnded(uint256 endTime);
    event AdminChanged(address newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyDuringElection() {
        require(currentElection.isOpen, "Election is not open");
        require(
            block.timestamp >= currentElection.startTime &&
            block.timestamp <= currentElection.endTime,
            "Election is not active"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
        emit AdminChanged(newAdmin);
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter], "Voter already registered");
        voters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function startElection(uint256 _durationInMinutes) public onlyAdmin {
        require(!currentElection.isOpen, "Election already in progress");
        require(candidatesCount >= 2, "Cannot start an election with less than 2 candidates");
        currentElection.isOpen = true;
        currentElection.startTime = block.timestamp;
        currentElection.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        emit ElectionStarted(currentElection.startTime, currentElection.endTime);
    }

    function endElection() public onlyAdmin {
        require(currentElection.isOpen, "No election in progress");
        currentElection.isOpen = false;
        emit ElectionEnded(block.timestamp);
    }

    function vote(uint256 _candidateId) public onlyDuringElection {
        require(voters[msg.sender], "Not registered to vote");
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        uint256 voteCount
    ) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getElectionStatus() public view returns (
        bool isOpen,
        uint256 startTime,
        uint256 endTime
    ) {
        return (currentElection.isOpen, currentElection.startTime, currentElection.endTime);
    }


    function getAllCandidates() public view returns (
    uint256[] memory ids,
    string[] memory names,
    uint256[] memory voteCounts
) {
    uint256[] memory _ids = new uint256[](candidatesCount);
    string[] memory _names = new string[](candidatesCount);
    uint256[] memory _voteCounts = new uint256[](candidatesCount);

    for (uint256 i = 1; i <= candidatesCount; i++) {
        Candidate memory candidate = candidates[i];
        _ids[i - 1] = candidate.id;
        _names[i - 1] = candidate.name;
        _voteCounts[i - 1] = candidate.voteCount;
    }

    return (_ids, _names, _voteCounts);
}

}