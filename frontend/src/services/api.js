import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const executeQuery = async (query) => {
  try {
    const response = await api.post('/query/execute', { query });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to execute query' };
  }
};

export const getTables = async () => {
  try {
    const response = await api.get('/tables');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch tables' };
  }
};

export const getTableInfo = async (tableName) => {
  try {
    const response = await api.get(`/tables/${tableName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch table info' };
  }
};

export default api;