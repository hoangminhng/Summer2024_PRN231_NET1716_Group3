import { useEffect, useState } from "react";
import { GetAllRoomImageByHostelId } from "../api/Room";

export const useHostelImages = (hostelId: string | undefined) => {
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await GetAllRoomImageByHostelId(hostelId);
        setImageList(response?.data || []);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [hostelId]);

  return { imageList, loading, error };
};
