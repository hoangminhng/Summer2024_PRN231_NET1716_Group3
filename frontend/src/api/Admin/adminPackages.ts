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
      const fetchData = await axios.post(
        `${baseUrl}/api/admin/packages/detail/update`,
        param,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = fetchData;
      return response;
    } catch (error : any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Unknown error occurred");
      } else {
        throw new Error(error.message || "Unknown error occurred");
      }
    }
  };

  export const createPackage = async ({
    memberShipName,
    capacityHostel,
    month,
    memberShipFee,
}:NewPackage, token: string) => {
    try {
        const param ={
          memberShipName,
          capacityHostel,
          month,
          memberShipFee,
        }
      const fetchData = await axios.post(
        `${baseUrl}/api/admin-create-membership`,
        param,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = fetchData;
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Unknown error occurred");
      } else {
        throw new Error(error.message || "Unknown error occurred");
      }
    }
  };

  export const changeStatusBlockPackage = async (token: string, memberShipID : number | undefined) => {
    try {
      const param = {
        memberShipID
      };
      const fetchData = await axios.put(
        `${baseUrl}/api/admin-deactivate-membership`,
        param,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = fetchData;
      return response;
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  
  export const changeStatusActivePackage = async (token: string, memberShipID : number | undefined) => {
    try {
      const param = {
        memberShipID
      };
      const fetchData = await axios.put(
        `${baseUrl}/api/admin-activate-membership`,
        param,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = fetchData;
      return response;
    } catch (error) {
      console.log("Error: " + error);
    }
  };