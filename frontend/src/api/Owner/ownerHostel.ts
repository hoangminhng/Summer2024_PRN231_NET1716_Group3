import axios from "axios";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerHostels = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get<OwnerHostel[]>(
      `${baseUrl}/api/owner/${ownerId}/hostels`,
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

export const getOwnerHostelDetail = async (hostelId: number) => {
  try {
    const fetchData = await axios.get<OwnerHostel>(
      `${baseUrl}/api/hostels/${hostelId}`,
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

export const updateHostelStatus = async (
  token: string | undefined,
  hostelId: number | undefined,
  status: number | undefined
) => {
  try {
    const fetchData = await axios.put(
      `${baseUrl}/api/hostels/${hostelId}/status/${status}`,
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

export const createHostel = async (
  token: string | undefined,
  hostelPayload: CreateHostelRequest
): Promise<CreateHostelResponse | BaseApiResponse> => {
  try {
    const fetchData = await axios.post<CreateHostelResponse | BaseApiResponse>(
      `${baseUrl}/api/hostels`,
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
  } catch (error: any) {
    console.log("Error:", error);
    toast.error(error.response.data.message, { duration: 2000 });
    throw error;
  }
};

export const uploadImage = async (
  token: string | undefined,
  hostelId: number,
  files: any
): Promise<BaseApiResponse> => {
  const formData = new FormData();
  files.forEach((file: { originFileObj: string | Blob }) => {
    formData.append("imageFiles", file.originFileObj);
  });

  try {
    const fetchData = await axios.post<BaseApiResponse>(
      `${baseUrl}/api/hostels/${hostelId}/images`,
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

export const getHostelType = async () => {
  try {
    const fetchData = await axios.get<HostelType[]>(
      `${baseUrl}/api/hostels/types`,
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

export const getHostelOwnerContract = async (
  ownerId: number,
  token: string
) => {
  try {
    const fetchData = await axios.get<HostelOwnerContract[]>(
      `${baseUrl}/api/owner/${ownerId}/hostels`,
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

export const updateHostel = async (
  token: string | undefined,
  hostelId: number | undefined,
  hostelPayload: UpdateHostelRequest
): Promise<BaseApiResponse> => {
  try {
    const fetchData = await axios.put<BaseApiResponse>(
      `${baseUrl}/api/hostels/${hostelId}`,
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
  } catch (error: any) {
    console.log("Error:", error);
    toast.error(error.response.data.message, { duration: 2000 });
    throw error;
  }
};
