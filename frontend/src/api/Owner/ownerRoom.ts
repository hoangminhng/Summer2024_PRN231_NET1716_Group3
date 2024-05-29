import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getRoomListOfHostel = async (hostelId: number, token: string) => {
  try {
    const fetchData = await axios.get<OwnerRoom[]>(
      `${baseUrl}/api/rooms/${hostelId}/list`,
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
