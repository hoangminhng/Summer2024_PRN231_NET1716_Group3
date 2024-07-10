import { useContext, useEffect, useState } from "react";
import { GetRoomListByHostelId } from "../../../../api/Room";
import { NumberFormat } from "../../../../Utils/numberFormat";
import { useNavigate } from "react-router-dom";
import VisitHouseModal from "./VisitHouseModal";
import LoginModal from "../../../../Component/LoginModal";
import { UserContext } from "../../../../context/userContext";
import { getMemberViewAppointment } from "../../../../api/Member/memberRoomAppointment";
import RentHouseModal from "./RentHouseModal";

interface RoomAndPriceProps {
  hostelId: number;
}

const RoomAndPrice: React.FC<RoomAndPriceProps> = ({ hostelId }) => {
  const [roomList, setRoomList] = useState<ListRooms[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ListRooms | null>(null);

  const storageUserId = localStorage.getItem("userId");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleRentModal = () => {
    setIsRentModalOpen(!isRentModalOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModal(!isLoginModal);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleModal();
    }
  };

  const handleRentModalOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleRentModal();
    }
  };

  const handleLoginModalOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleLoginModal();
    }
  };

  const handleVisitHouseClick = (room: ListRooms) => {
    if (storageUserId) {
      setSelectedRoom(room);
      toggleModal();
    } else {
      toggleLoginModal();
    }
  };

  const handleRentHouseClick = (room: ListRooms) => {
    if (storageUserId) {
      setSelectedRoom(room);
      toggleRentModal();
    } else {
      toggleLoginModal();
    }
  };

  const handleViewAppointmentClick = () => {
    navigate("/appointments");
  };

  const [memberViewAppointment, setMemberViewAppointment] = useState<
    MemberViewAppointment[]
  >([]);
  const { token, userId } = useContext(UserContext);
  const fetchMemberAppointmnet = async () => {
    if (token != undefined && userId != undefined) {
      let data: MemberViewAppointment[] | undefined;
      data = await getMemberViewAppointment(userId, token);
      setMemberViewAppointment(data || []);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await GetRoomListByHostelId(hostelId.toString());
      setRoomList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchMemberAppointmnet();
  }, [hostelId, userId]);

  const navigate = useNavigate();
  const handleButtonClick = (roomID: string) => {
    navigate(`/room/detail/${roomID}`);
  };

  const hasMultipleAppointments = (roomId: number) => {
    const appointments = memberViewAppointment?.filter(
      (appointment) => appointment.roomId === roomId && appointment.status === 0
    );
    return appointments && appointments.length >= 1;
  };

  const isDirectHire = (roomId: number) => {
    return memberViewAppointment?.some(
      (appointment) => appointment.roomId === roomId && appointment.status === 3
    );
  };

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="my-3">
          <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Available rooms
          </h1>
        </div>

        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 flex items-center">
              <th scope="col" className="px-6 py-3 w-1/4"></th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Room name
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Room Fee
              </th>
              <th scope="col" className="px-6 py-3 w-1/3"></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {roomList?.map((room) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 flex items-center"
                key={room.roomID}
              >
                <td className="px-6 py-4 w-1/4">
                  <img src={room.roomThumbnail} />
                </td>
                <td className="px-6 py-4 w-1/6">{room.roomName}</td>
                <td className="px-6 py-4 w-1/6">{room.capacity}</td>
                <td className="px-6 py-4 w-1/6">
                  {NumberFormat(room.roomFee)} /month
                </td>
                <td className="px-6 py-4 w-1/3 flex items-center justify-center">
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handleButtonClick(room.roomID.toString())}
                  >
                    View detail
                  </button>
                  {hasMultipleAppointments(room.roomID) ? (
                    <button
                      onClick={() => handleViewAppointmentClick()}
                      type="button"
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    >
                      View appointment
                    </button>
                  ) : isDirectHire(room.roomID) ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => handleVisitHouseClick(room)}
                      type="button"
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    >
                      Visit house
                    </button>
                  )}
                  {isDirectHire(room.roomID) ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => handleRentHouseClick(room)}
                      type="button"
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    >
                      Rent house
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50"
          >
            <VisitHouseModal
              room={selectedRoom}
              closeModal={toggleModal}
              reloadRoomList={fetchRooms}
            />
          </div>
        )}
        {isRentModalOpen && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleRentModalOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50"
          >
            <RentHouseModal
              room={selectedRoom}
              closeModal={toggleRentModal}
              reloadRoomList={fetchRooms}
            />
          </div>
        )}
        {isLoginModal && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleLoginModalOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50"
          >
            <LoginModal closeModal={toggleLoginModal} />
          </div>
        )}
      </div>
    </>
  );
};

export default RoomAndPrice;
