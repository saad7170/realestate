import axios from './axios';

export const cityService = {
  // Get all cities
  getCities: async () => {
    const response = await axios.get('/cities');
    return response.data;
  },

  // Get a single city by ID or slug
  getCity: async (identifier) => {
    const response = await axios.get(`/cities/${identifier}`);
    return response.data;
  },

  // Get areas/sectors for a specific city
  getCityAreas: async (cityName) => {
    // Convert city name to slug format (lowercase, replace spaces with hyphens)
    const slug = cityName.toLowerCase().replace(/\s+/g, '-');
    const response = await axios.get(`/cities/${slug}/areas`);
    return response.data;
  }
};
