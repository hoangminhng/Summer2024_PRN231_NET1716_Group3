import axios from "axios";
import toast from "react-hot-toast";
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

export const getOwnerRoomDetail = async (roomId: number, token: string) => {
  try {
    const fetchData = await axios.get<OwnerRoomDetail>(
      `${baseUrl}/api/rooms/${roomId}`,
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

export const getRoomOwnerContract = async (hostelId: number, token: string) => {
  try {
    const fetchData = await axios.get<RoomOwnerContract[]>(
      `${baseUrl}/api/rooms/${hostelId}/list-for-contract`,
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

export const getHiringRooms = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get(
      `${baseUrl}/api/rooms/hiring/${ownerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fetchData.data;
  } catch (error) {
    console.log("Error: " + error);
    throw error;
  }
};

export const updateRoomStatus = async (
  token: string | undefined,
  roomId: number | undefined,
  status: number | undefined
) => {
  try {
    const fetchData = await axios.put(
      `${baseUrl}/api/rooms/${roomId}/status/${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    toast.error(error.response.data.message, { duration: 2000 });
    throw error;
  }
};

export const updateRoom = async (
  token: string | undefined,
  roomId: number | undefined,
  roomPayload: UpdateRoomRequest
): Promise<BaseApiResponse> => {
  try {
    const fetchData = await axios.put<BaseApiResponse>(
      `${baseUrl}/api/rooms/${roomId}`,
      roomPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    toast.error(error.response.data.message, { duration: 2000 });
    throw error;
  }
};

export const updateServicePrices = async (roomId, servicesToUpdate, token) => {
  const url = `${baseUrl}/api/rooms/UpdateServicePrice`;

  try {
    const response = await axios.post(
      url,
      {
        roomId: roomId,
        services: servicesToUpdate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating room service prices:", error);
    throw error;
  }
};
