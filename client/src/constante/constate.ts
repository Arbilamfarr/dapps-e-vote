import VotingSystem from "../contracts/VotingSystem.json";

// Network local Ganache
//  const NETWORKID = '5777';
//  export const NETWORK_URL='http://127.0.0.1:7545'


// Network Sepolia
const NETWORKID = "11155111";
export const  NETWORK_URL="https://eth-sepolia.g.alchemy.com/v2/7hqzwWyiVckZHXyOsZEdf6A0YebGkZw7"

export const CONTRACTADDRESS = VotingSystem.networks[NETWORKID]?.address;