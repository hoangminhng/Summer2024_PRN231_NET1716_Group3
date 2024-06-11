import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerContract = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get<ViewContract[]>(
      `${baseUrl}/api/owner/${ownerId}/contracts`,
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

export const getUserAppointmentOwnerContract = async (roomID: number, token: string) => {
  try {
    const fetchData = await axios.get<UserAppointmentContract>(
      `${baseUrl}/api/owner/${roomID}/contract/appointment`,
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