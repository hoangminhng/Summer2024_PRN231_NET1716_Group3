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

export const getOwnerRoomDetail = async (roomId: number) => {
  try {
    const fetchData = await axios.get<OwnerRoomDetail>(
      `${baseUrl}/api/rooms/${roomId}`,
      {
        headers: {
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

export const createRoom = async (
  token: string | undefined,
  hostelPayload: CreateRoomRequest
): Promise<CreateRoomResponse> => {
  try {
    const fetchData = await axios.post<CreateRoomResponse>(
      `${baseUrl}/api/rooms`,
      hostelPayload,
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
    console.log("Error:", error);
    throw error;
  }
};

export const uploadImage = async (
  token: string | undefined,
  roomId: number,
  files: any
): Promise<BaseApiResponse> => {
  const formData = new FormData();
  files.forEach((file: { originFileObj: string | Blob }) => {
    formData.append("imageFiles", file.originFileObj);
  });

  try {
    const fetchData = await axios.post<BaseApiResponse>(
      `${baseUrl}/api/rooms/${roomId}/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const response = fetchData.data;
    return response;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};
