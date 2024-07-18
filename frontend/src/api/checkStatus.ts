import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const ValidateStatusAccount = async (accountID : number) => {
    try {
        const response = await axios.get(`${baseUrl}/api/check/status/${accountID}`);
        return response.data;
    } catch (error : any) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.message || "Unknown error occurred");
        } else {
          throw new Error(error.message || "Unknown error occurred");
        }
    }
}