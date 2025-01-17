import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const apiService = {
  async createCandidate(data: { name: string; program: string; blockchainId: number }) {
    try {
      const response = await axios.post(`${API_URL}/candidates`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error creating candidate');
    }
  },

  async getCandidates() {
    try {
      const response = await axios.get(`${API_URL}/candidates`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error fetching candidates');
    }
  },


  // User Management
  async registerUser(data: {
    address: string;
    name: string;
    email: string;
  }) {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
  },

  async getUser(address: string) {
    const response = await axios.get(`${API_URL}/users/${address}`);
    return response.data;
  },

  async getNombreUser() {
    const response = await axios.get(`${API_URL}/users/count/voters`);
    return response.data;
  },

  // Return all users
  async getUsers() {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Transaction Management
  async logTransaction(data: {
    hash: string;
    from: string;
    type: 'VOTE' | 'REGISTER_VOTER' | 'ADD_CANDIDATE' | 'START_ELECTION' | 'END_ELECTION';
    details: any;
  }) {
    const response = await axios.post(`${API_URL}/transactions`, data);
    return response.data;
  },

  async getTransactions(address: string) {
    const response = await axios.get(`${API_URL}/transactions?address=${address}`);
    return response.data;
  }
};