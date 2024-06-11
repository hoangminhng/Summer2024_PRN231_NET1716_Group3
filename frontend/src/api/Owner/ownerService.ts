import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getServiceRoomOwnerContract = async (roomID: number, token: string) => {
  try {
    const fetchData = await axios.get<ServiceRoomContract[]>(
      `${baseUrl}/api/owner/${roomID}/service_room/contracts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error) {
    console.log("Error: " + error);
  }
};