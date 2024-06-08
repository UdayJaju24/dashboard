import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000';

// Function to fetch activities from the API
export const fetchActivities = async () => {
  try {
    // Send a GET request to the /activities endpoint
    const response = await axios.get(`${API_URL}/activities`);
    // Return the data from the response
    return response.data;
  } catch (error) {
    // Log any errors to the console
    console.error('Error fetching activities:', error);
    // Rethrow the error to be handled by the caller
    throw error;
  }
};
