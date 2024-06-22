import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getMemberViewAppointment = async (
  accountId: number,
  token: string
) => {
  try {
    const fetchData = await axios.get<MemberViewAppointment[]>(
      `${baseUrl}/api/rooms/appointment/member/${accountId}`,
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
