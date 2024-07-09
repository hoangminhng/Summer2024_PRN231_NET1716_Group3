import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { Odata } from "../../../interface/Odata";
import {
  getMemberNotifications,
  markNotificationAsRead,
} from "../../../api/Member/memberNotification";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/solid";

const NotificationOwner: React.FC = () => {
  const { token, userId } = useContext(UserContext);
  const [notificationData, setNotificationData] =
    useState<Odata<notification>>();
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 7;

  const fetchNotificationList = async () => {
    try {
      if (token != undefined) {
        let data: Odata<notification> | undefined;
        data = await getMemberNotifications(token, userId);
        console.log({ ...data?.value });
        setNotificationData(data || undefined);
      }
    } catch (error) {
      console.error("Error fetching contract list:", error);
    }
  };

  useEffect(() => {
    fetchNotificationList();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastHostel = currentPage * notificationsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - notificationsPerPage;
  const currentNotifications = notificationData?.value?.slice(
    indexOfFirstHostel,
    indexOfLastHostel
  );
  const totalPages = notificationData?.value
    ? Math.ceil(notificationData?.value?.length / notificationsPerPage)
    : 1;
  const navigate = useNavigate();
  const handleNotiClicked = (noti: notification) => {
    if (noti.IsRead == false && token != undefined) {
      markNotificationAsRead(token, noti.NotificationId);
    }
    navigate(noti.ForwardToPath);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center ">
        <div className="w-3/4 bg-[#f3f4f6] rounded-2xl p-2">
          <div className="text-2xl font-bold text-center">Notification</div>
          <div className="h-screen">
            {currentNotifications?.map((noti) => {
              return (
                <button
                  className="flex items-center justify-start w-full hover:bg-slate-500/10 rounded-lg"
                  onClick={() => handleNotiClicked(noti)}
                >
                  <div className="mx-2">
                    {noti.NotificationType === 1 ? (
                      <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                    ) : (
                      <CreditCardIcon className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center w-full">
                    <div className="flex flex-col items-start w-full">
                      <h2 className="text-lg font-bold dark:text-white">
                        {noti.Title}
                      </h2>
                      <p className="text-base text-start text-gray-500">
                        {noti.NotificationText}
                      </p>
                      <p className="text-xs text-gray-400">
                        {dayjs(noti.CreateDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    {noti.IsRead ? null : (
                      <div className="h-full text-5xl text-[#2563eb] flex flex-col items-center">
                        &#x2022;
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 text-sm text-gray-700 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 text-sm rounded-md ${
                  currentPage === index + 1
                    ? "bg-slate-950 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 text-sm text-gray-700 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationOwner;
