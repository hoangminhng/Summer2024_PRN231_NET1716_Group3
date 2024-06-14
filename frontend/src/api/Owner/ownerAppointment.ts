import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerAppointmentDetail = async (hostelId: number, token: string) => {
  try {
    const fetchData = await axios.get<Appointment[]>(
      `${baseUrl}/api/owner/rooms/appointment/${hostelId}`,
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

export const getOwnerAppointment = async (ownerId: number, token: string) => {
    try {
      const fetchData = await axios.get<AppointmentView[]>(
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

  export const CancelAppointment = async (token: string, appointmentID : number) => {
    try {
      const param = {
        appointmentID
      };
      const fetchData = await axios.put(
        `${baseUrl}/api/owner/rooms/appointment/cancel/${appointmentID}`,
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