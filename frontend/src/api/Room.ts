import axios from "axios";
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
    const response = await axios.get(`${baseUrl}/api/rooms/${hostelId}/list`);
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
