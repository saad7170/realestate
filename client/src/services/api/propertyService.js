import axios from './axios';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    const response = await axios.get('/properties', { params });
    return response.data;
  },

  // Get single property by ID
  getProperty: async (id) => {
    const response = await axios.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData) => {
    const response = await axios.post('/properties', propertyData);
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await axios.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await axios.delete(`/properties/${id}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (searchParams) => {
    const response = await axios.get('/properties/search', { params: searchParams });
    return response.data;
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await axios.get('/properties/featured');
    return response.data;
  },

  // Get user's properties
  getMyProperties: async () => {
    const response = await axios.get('/properties/user/my-properties');
    return response.data;
  },
};
