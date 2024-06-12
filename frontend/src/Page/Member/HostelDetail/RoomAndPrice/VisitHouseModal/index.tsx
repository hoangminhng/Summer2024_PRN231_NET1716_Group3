import { useState } from "react";
import { MakeRoomAppointment } from "../../../../../api/Room";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface VisitHouseModalProps {
  room: ListRooms | null;
  closeModal: () => void;
  reloadRoomList: () => void;
}

const VisitHouseModal: React.FC<VisitHouseModalProps> = ({
  room,
  closeModal,
  reloadRoomList,
}) => {
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storageUserId = localStorage.getItem("userId");

    if (meetingDate === "") {
      toast.error("Please input all fields.", {
        duration: 2000,
      });
      return;
    }
    if (room && storageUserId) {
      let data: CreateRoomAppointmentDto = {
        RoomId: room?.roomID.toString(),
        ViewerId: storageUserId,
        AppointmentTime: meetingDate,
        RoomName: room?.roomName,
      };
      setLoading(true);
      const response = await MakeRoomAppointment(data);
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
          Schedule a Visit for {room?.roomName}
        </h2>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label
                htmlFor="meetingDate"
                className="block text-sm font-medium text-gray-700"
              >
                Select a Date
              </label>
              <input
                type="datetime-local"
                id="meetingDate"
                name="meetingDate"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
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
                Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VisitHouseModal;
