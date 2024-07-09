import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { Odata } from "../../../interface/Odata";
import {
  getMemberNotifications,
  markNotificationAsRead,
} from "../../../api/Member/memberNotification";

const NotificationMember: React.FC = () => {
  const { token, userId } = useContext(UserContext);
  const [notificationData, setNotificationData] =
    useState<Odata<notification>>();

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
  const navigate = useNavigate();
  const handleNotiClicked = (noti: notification) => {
    if (noti.IsRead == false && token != undefined) {
      markNotificationAsRead(token, noti.NotificationId);
    }
    navigate(noti.ForwardToPath);
  };
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-3/4 bg-[#f3f4f6] rounded-2xl p-2">
        <div className="text-2xl font-bold text-center">Notification</div>
        <div className="h-screen">
          {notificationData?.value?.map((noti) => {
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
      </div>
    </div>
  );
};
export default NotificationMember;
