import { useEffect, useState } from "react";
import { GetRoomListByHostelId } from "../../../../api/Room";
import { NumberFormat } from "../../../../Utils/numberFormat";

interface RoomAndPriceProps {
  hostelId: number;
}

const RoomAndPrice: React.FC<RoomAndPriceProps> = ({ hostelId }) => {
  const [roomList, setRoomList] = useState<ListRooms[] | undefined>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await GetRoomListByHostelId(hostelId.toString());
        setRoomList(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, [hostelId]);
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="my-3">
          <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Available rooms
          </h1>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Room name
              </th>
              <th scope="col" className="px-6 py-3">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3">
                Room Fee
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {roomList?.map((room) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={room.roomID}
              >
                <td className="px-6 py-4 w-1/4">
                  <img src={room.roomThumbnail} />
                </td>
                <td className="px-6 py-4 w-1/5">{room.roomName}</td>
                <td className="px-6 py-4 w-1/5">{room.capacity}</td>
                <td className="px-6 py-4 w-1/5">
                  {NumberFormat(room.roomFee)} /month
                </td>
                <td className="px-6 py-4 w-1/5">
                  <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    View detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomAndPrice;
