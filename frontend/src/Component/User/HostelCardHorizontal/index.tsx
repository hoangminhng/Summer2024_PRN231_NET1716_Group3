import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { NumberFormat } from "../../../Utils/numberFormat";
import { truncateText } from "../../../Utils/truncateText";

interface CardHorizontalProps {
  hostel: Hostel;
}

const CardHorizontal: React.FC<CardHorizontalProps> = ({ hostel }) => {
  const navigate = useNavigate();

  const handleCardClick = (hostelID: string) => {
    navigate(`/hostel/detail/${hostelID}`);
  };
  return (
    <>
      <div
        key={hostel.hostelID}
        className="flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-4"
        onClick={() => handleCardClick(hostel.hostelID.toString())}
      >
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-row justify-start w-full">
            <img
              className="object-cover w-1/3 h-auto rounded-lg"
              src={hostel.images[0]}
              alt=""
            />
            <div className="flex flex-col justify-start items-start p-4 w-2/3">
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {hostel.hostelName}
              </h3>
              <div className="flex w-full">
                <h3 className="mb-2 text-lg font-bold tracking-tight text-red-900 dark:text-white">
                  {NumberFormat(hostel.lowestPrice)}/month
                </h3>
                <span className="mx-2">-</span>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-red-900 dark:text-white">
                  {hostel.lowestArea} m<sup>2</sup>
                </h3>
              </div>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {hostel.hostelAddress}
              </p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-start">
                {truncateText(hostel.hostelDescription, 150)}
              </p>
              <div className="flex w-full">
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-400">
                  Available Rooms: {hostel.numOfAvailableRoom}
                </p>
                <span className="mx-2">/</span>
                <p className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-400">
                  Total Rooms: {hostel.numOfTotalRoom}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center ms-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <div className="flex flex-col items-start">
              <p className="font-bold">{hostel.ownerName}</p>
              {dayjs(hostel.createDate).format("DD/MM/YYYY")}
            </div>
          </div>

          <button className="flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>

            {hostel.phone}
          </button>
        </div>
      </div>
    </>
  );
};

export default CardHorizontal;
