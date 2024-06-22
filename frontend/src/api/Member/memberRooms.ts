import axios from 'axios';
import { MemberRoomRented } from '../../interface/Rooms/MemberRoomRented';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getMemberRentedRoom = async (token: string) => {
  try {
    const fetchData = await axios.get<MemberRoomRented[]>(
      `${baseUrl}/api/rooms/rented`,
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
