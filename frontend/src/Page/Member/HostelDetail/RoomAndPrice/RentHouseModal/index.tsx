import { useContext, useState } from "react";
import { MakeRoomHiringRequest } from "../../../../../api/Room";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../../../../context/userContext";

interface RentHouseModalProps {
  room: ListRooms | null;
  closeModal: () => void;
  reloadRoomList: () => void;
}

const RentHouseModal: React.FC<RentHouseModalProps> = ({
  room,
  closeModal,
  reloadRoomList,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useContext(UserContext);

  const handleSubmit = async () => {
    const storageUserId = localStorage.getItem("userId");

    if (room && storageUserId && token) {
      let data: HireRoomRequest = {
        RoomId: room?.roomID.toString(),
        ViewerId: storageUserId,
        RoomName: room?.roomName,
      };
      setLoading(true);
      const response = await MakeRoomHiringRequest(data, token);
      const responseData = response?.data;
      setLoading(false);
      if (responseData.statusCode == 200) {
        toast.success(responseData.message, {
          duration: 2000,
        });
        reloadRoomList();
      }
    }
    closeModal();
  };
  return (
    <>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          You are going to hire {room?.roomName}
        </h2>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Rent
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RentHouseModal;
