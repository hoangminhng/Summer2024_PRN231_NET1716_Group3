import axios from 'axios';
import { Complain } from '../../interface/Complains/Complain';
import { Odata } from '../../interface/Odata';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerComplains = async (
  token: string,
  accountID: number | undefined
) => {
  try {
    const response = await axios.get<Odata<Complain>>(
      `${baseUrl}/odata/Complains?filter=OwnerID eq ${accountID}`,
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

export const reponseComplain = async (
  token: string,
  complainId: number | undefined,
  complainResponse: string | undefined
) => {
  try {
    const response = await axios.put(
      `${baseUrl}/odata/Complains/${complainId}`,
      {
        complainId: complainId,
        complainResponse: complainResponse,
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
