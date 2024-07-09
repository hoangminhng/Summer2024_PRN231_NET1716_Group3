import axios from "axios";
import { Odata } from "../../interface/Odata";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getMemberNotifications = async (
  token: string,
  accountID: number | undefined
) => {
  try {
    const response = await axios.get<Odata<notification>>(
      `${baseUrl}/odata/Notifications?filter=receiveAccountId eq ${accountID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error: " + error);
  }
};

export const markNotificationAsRead = async (token: string, id: number) => {
  try {
    console.log(id);
    const response = await axios.put(`${baseUrl}/odata/Notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log("Error: " + error);
  }
};
