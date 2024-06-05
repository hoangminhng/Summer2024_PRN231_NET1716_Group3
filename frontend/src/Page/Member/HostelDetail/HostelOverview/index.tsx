import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { GetAllRoomImageByHostelId } from "../../../../api/Room";

interface HostelOverviewProps {
  hostelName: string;
  hostelId: number;
  hostelAddress: string;
  hostelDescription: string;
}
const HostelOverview: React.FC<HostelOverviewProps> = ({
  hostelName,
  hostelId,
  hostelAddress,
  hostelDescription,
}) => {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        let response = await GetAllRoomImageByHostelId(hostelId.toString());
        if (response?.data) {
          setImageList(response.data);
        } else {
          console.error("Response data is undefined or empty");
        }
      } catch (error) {
        console.error("Error fetching hostel images:", error);
      }
    };

    fetchHostels();
  }, [hostelId]); // Include hostelId in dependency array

  const images = imageList.map((url) => ({
    original: url,
    thumbnail: url,
  }));
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="my-3">
          <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            {hostelName}
          </h1>
          <div className="flex items-center">
            <MapPinIcon className="w-6 h-6 text-blue-500 dark:text-gray-400" />
            <p className="text-lg font-medium leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
              {hostelAddress}
            </p>
          </div>
        </div>

        <div className="w-full">
          <ReactImageGallery
            items={images}
            showFullscreenButton={false}
            showPlayButton={false}
            thumbnailPosition="bottom"
            infinite={true}
          />
        </div>

        <div>{hostelDescription}</div>
      </div>
    </>
  );
};

export default HostelOverview;
