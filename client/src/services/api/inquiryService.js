import axios from './axios';

const inquiryService = {
  // Create new inquiry
  createInquiry: async (data) => {
    try {
      const response = await axios.post('/inquiries', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sent inquiries
  getSentInquiries: async () => {
    try {
      const response = await axios.get('/inquiries/sent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get received inquiries
  getReceivedInquiries: async () => {
    try {
      const response = await axios.get('/inquiries/received');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update inquiry status
  updateInquiryStatus: async (id, status) => {
    try {
      const response = await axios.put(`/inquiries/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete inquiry
  deleteInquiry: async (id) => {
    try {
      const response = await axios.delete(`/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default inquiryService;
