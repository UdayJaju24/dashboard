import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchActivities = async () => {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};
