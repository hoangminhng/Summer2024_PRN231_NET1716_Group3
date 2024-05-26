import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getPackages = async (token: string) => {
  try {
    const fetchData = await axios.get<Package[]>(
      `${baseUrl}/api/admin/packages`,
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
export const getPackageDetail = async (id: number, token: string) => {
    try {
      const fetchData = await axios.get<Package>(
        `${baseUrl}/api/admin/packages/detail/${id}`,
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

export const updatePackage = async ({
    memberShipID,
    memberShipName,
    capacityHostel,
    month,
    memberShipFee,
    status
}:Package, token: string) => {
    try {
        const param ={
          memberShipID,
          memberShipName,
          capacityHostel,
          month,
          memberShipFee,
          status
        }
      const fetchData = await axios.post<Message>(
        `${baseUrl}/api/admin/packages/detail/update`,
        param,
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

  export const createPackage = async ({
    memberShipID,
    memberShipName,
    capacityHostel,
    month,
    memberShipFee,
    status
}:Package, token: string) => {
    try {
        const param ={
          memberShipID,
          memberShipName,
          capacityHostel,
          month,
          memberShipFee,
          status
        }
      const fetchData = await axios.post<Message>(
        `${baseUrl}/api/admin/packages/new`,
        param,
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