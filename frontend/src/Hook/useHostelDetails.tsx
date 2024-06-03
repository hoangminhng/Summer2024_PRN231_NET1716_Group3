import { useEffect, useState } from "react";
import { GetHostelDetail } from "../api/Hostels";

export const useHostelDetails = (hostelID: string | undefined) => {
  const [hostel, setHostel] = useState<Hostel | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await GetHostelDetail(hostelID);
        setHostel(response?.data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [hostelID]);

  return { hostel, loading, error };
};
