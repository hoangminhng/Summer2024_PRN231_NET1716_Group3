import axios from 'axios';
import { Complain } from '../../interface/Complains/Complain';
import { Odata } from '../../interface/Odata';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const createMemberComplain = async (
  token: string,
  accountID: number,
  roomID: number,
  complainText: string
) => {
  try {
    const response = await axios.post(
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
    return response;
  } catch (error) {
    console.log('Error: ' + error);
  }
};

export const getMemberComplains = async (
  token: string,
  accountID: number | undefined
) => {
  try {
    const response = await axios.get<Odata<Complain>>(
      `${baseUrl}/odata/Complains?filter=AccountID eq ${accountID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error: ' + error);
  }
};
