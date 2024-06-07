import axios from 'axios';

export const fetchActivities = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/UdayJaju24/dashboard/main/db.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};
