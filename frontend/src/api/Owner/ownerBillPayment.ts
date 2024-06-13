import axios from "axios";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getLastMonthBillPayment = async (
  contractId: number,
  token: string
) => {
  try {
    const fetchData = await axios.get<BillPayment>(
      `${baseUrl}/api/bill-payment/last-month-bill/${contractId}`,
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

export const createMonthlyBillPayment = async (
  token: string | undefined,
  billPaymentPayload: CreateMonthlyBillPayment
): Promise<BaseApiResponse> => {
  try {
    const fetchData = await axios.post<BaseApiResponse>(
      `${baseUrl}/api/bill-payment/monthly`,
      billPaymentPayload,
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
