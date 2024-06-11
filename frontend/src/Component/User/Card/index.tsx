import { MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { GetHostelCard } from "../../../api/Hostels";
import { useNavigate } from "react-router-dom";

const HouseCard: React.FC = () => {
  const [hostelList, setHostelList] = useState<Hostel[] | undefined>([]);
  const navigate = useNavigate();

  const fetchHostels = async () => {
    let respone = await GetHostelCard();
    setHostelList(respone?.data);
  };

  useEffect(() => {
    try {
      fetchHostels();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleCardClick = (hostelID: string) => {
    navigate(`/hostel/detail/${hostelID}`);
  };

  return (
    <>
      <style>
        {`
          .hover\\:scale-up {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .hover\\:scale-up:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      {hostelList?.map((hostel) => (
        <div
          key={hostel.hostelID}
          className="flex items-center justify-center h-full rounded mx-1 dark:bg-gray-800"
          onClick={() => handleCardClick(hostel.hostelID.toString())}
        >
          <div className="relative w-full bg-white border border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700 hover:scale-up">
            <img
              className="w-full h-64 object-cover object-center p-2 rounded-[36px]"
              src={hostel.images[0]}
            />
            <div className="p-4">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  {hostel.hostelAddress}
                </p>
              </div>
              <div className="flex items-center pt-3">
                <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mr-3">
                  {/* {NumberFormat(hostel.price)} */}
                </p>
              </div>
              <p className="mb-3 font-normal text-xl text-gray-700 dark:text-gray-400">
                {hostel.hostelDescription}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default HouseCard;
