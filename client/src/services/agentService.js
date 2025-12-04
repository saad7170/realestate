import api from './api/axios';

const agentService = {
  // Get all agents
  getAllAgents: async (params = {}) => {
    try {
      const response = await api.get('/agents', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get agent profile
  getAgentProfile: async (agentId) => {
    try {
      const response = await api.get(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get agent properties
  getAgentProperties: async (agentId, params = {}) => {
    try {
      const response = await api.get(`/agents/${agentId}/properties`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get agent statistics
  getAgentStats: async (agentId) => {
    try {
      const response = await api.get(`/agents/${agentId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update agent profile
  updateAgentProfile: async (data) => {
    try {
      const response = await api.put('/agents/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default agentService;
