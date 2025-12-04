import axios from './axios';

// Get all users
export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.role) params.append('role', filters.role);
  if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
  if (filters.search) params.append('search', filters.search);
  
  const response = await axios.get(`/admin/users?${params.toString()}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await axios.get(`/admin/users/${userId}`);
  return response.data;
};

// Create new user
export const createUser = async (userData) => {
  const response = await axios.post('/admin/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// Toggle user active status
export const toggleUserStatus = async (userId) => {
  const response = await axios.patch(`/admin/users/${userId}/status`);
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await axios.delete(`/admin/users/${userId}`);
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await axios.get('/admin/stats/dashboard');
  return response.data;
};

// Get property statistics
export const getPropertyStats = async () => {
  const response = await axios.get('/admin/stats/properties');
  return response.data;
};

// Get agent statistics
export const getAgentStats = async () => {
  const response = await axios.get('/admin/stats/agents');
  return response.data;
};

// Get owner statistics
export const getOwnerStats = async () => {
  const response = await axios.get('/admin/stats/owners');
  return response.data;
};

// Get all agents with properties
export const getAllAgents = async () => {
  const response = await axios.get('/admin/agents');
  return response.data;
};

// Get all owners with properties
export const getAllOwners = async () => {
  const response = await axios.get('/admin/owners');
  return response.data;
};

// Get properties by user ID
export const getPropertiesByUser = async (userId) => {
  const response = await axios.get(`/admin/properties/${userId}`);
  return response.data;
};

// Get all properties
export const getAllProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.purpose) params.append('purpose', filters.purpose);
  if (filters.propertyType) params.append('propertyType', filters.propertyType);
  
  const response = await axios.get(`/admin/properties?${params.toString()}`);
  return response.data;
};

// Update property status
export const updatePropertyStatus = async (propertyId, status) => {
  const response = await axios.patch(`/admin/properties/${propertyId}/status`, { status });
  return response.data;
};

// Delete property
export const deleteProperty = async (propertyId) => {
  const response = await axios.delete(`/admin/properties/${propertyId}`);
  return response.data;
};

const adminService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getDashboardStats,
  getPropertyStats,
  getAgentStats,
  getOwnerStats,
  getAllAgents,
  getAllOwners,
  getPropertiesByUser,
  getAllProperties,
  updatePropertyStatus,
  deleteProperty
};

export default adminService;
