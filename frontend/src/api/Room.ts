import axios from "axios";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const GetAllRoomImageByHostelId = async (
  hostelId: string | undefined
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/rooms/${hostelId}/roomImages`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const GetRoomListByHostelId = async (hostelId: string | undefined) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/rooms/member/${hostelId}/list`
    );
    return response;
  } catch (error: any) {
    console.log(error);
  }
};

export const GetRoomDetailById = async (roomId: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/api/rooms/${roomId}`);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};

export const MakeRoomAppointment = async (data: CreateRoomAppointmentDto) => {
  try {
    const response = await axios.post(`${baseUrl}/api/rooms/appointment`, data);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const MakeRoomHiringRequest = async (
  data: HireRoomRequest,
  token: string
) => {
  try {
    const response = await axios.post(`${baseUrl}/api/rooms/hire`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
