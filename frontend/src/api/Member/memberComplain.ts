import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const createMemberComplain = async (
  token: string,
  accountID: number,
  roomID: number,
  complainText: string
) => {
  try {
    const fetchData = await axios.post(
      `${baseUrl}/odata/Complains`,
      {
        accountID: accountID,
        roomID: roomID,
        complainText: complainText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
