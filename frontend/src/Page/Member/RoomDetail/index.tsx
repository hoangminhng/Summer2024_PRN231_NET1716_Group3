import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetRoomDetailById } from "../../../api/Room";
import { NumberFormat } from "../../../Utils/numberFormat";
import { UserIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

const MemberRoomDetails: React.FC = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | undefined>();
  const [roomImages, setRoomImages] = useState<string[] | undefined>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await GetRoomDetailById(roomID);
        if (response?.data) {
          setRoomDetail(response?.data);
          setRoomImages(response?.data.roomImageUrls);
        } else {
          console.error("Response data is undefined or empty");
        }
      } catch (error) {
        console.error("Error fetching room detail:", error);
      }
    };
    fetchRooms();
  }, [roomID]);

  const navigate = useNavigate();
  const handleBackToList = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <div className="hidden md:flex md:order-2 space-x-3 rtl:space-x-reverse">
          <button
            onClick={handleBackToList}
            type="button"
            className="flex items-center text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base px-5 py-3 text-center mb-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <img
              className="h-auto w-full rounded-lg shadow-md"
              src={roomDetail?.roomThumbnail}
              alt={roomDetail?.roomName || "Room thumbnail"}
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {roomDetail?.roomName}
            </h1>
            <div
              className="text-lg text-gray-600 text-left"
              dangerouslySetInnerHTML={{
                __html: roomDetail?.description || "......",
              }}
            />
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Capacity
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center flex justify-center">
                    {roomDetail?.capacity} <UserIcon className="h-5 w-5" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Room Fee
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {NumberFormat(roomDetail?.roomFee || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Status
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {roomDetail?.status ? "Available" : "Unavailable"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Dimensions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {roomDetail?.lenght} x {roomDetail?.width} meters
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomDetail?.roomServices.map((service) => (
                  <div
                    key={service.serviceID}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {service.serviceName}
                    </h3>
                    <p className="text-gray-700">
                      Price: {NumberFormat(service.servicePrice)}
                    </p>
                    <p
                      className={`text-sm ${
                        service.status ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {service.status ? "Unavailable" : "Available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Room Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {roomImages?.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <img
                  className="h-auto w-full"
                  src={image}
                  alt={`Room image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberRoomDetails;
