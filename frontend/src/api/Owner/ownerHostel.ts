import axios from "axios";
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
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const createHostel = async (
  token: string | undefined,
  hostelPayload: CreateHostelRequest
): Promise<CreateHostelResponse> => {
  try {
    const fetchData = await axios.post<CreateHostelResponse>(
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
  } catch (error) {
    console.log("Error:", error);
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

export const getHostelOwnerContract = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get<HostelOwnerContract[]>(
      `${baseUrl}/api/owner/${ownerId}/contract/hostels`,
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
