import { useEffect, useState } from "react";
import { GetRoomListByHostelId } from "../../../../api/Room";

interface RoomAndPriceProps {
  hostelId: number;
  onTabLoaded: () => void;
}

const RoomAndPrice: React.FC<RoomAndPriceProps> = ({
  hostelId,
  onTabLoaded,
}) => {
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
  }, [hostelId, onTabLoaded]);
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
                <td className="px-6 py-4 w-1/4">{room.roomName}</td>
                <td className="px-6 py-4 w-1/4">{room.capacity}</td>
                <td className="px-6 py-4 w-1/4">{room.roomFee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomAndPrice;
