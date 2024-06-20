import axios from 'axios';
import { Package } from '../interface/MemberShips/package';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getPackages = async () => {
  try {
    const fetchData = await axios.get<Package[]>(
      `${baseUrl}/api/get-memberships-active`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error) {
    console.log('Error: ' + error);
  }
};
