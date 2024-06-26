import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import React from "react";

interface NotificationListProps {
  closeNotiList: () => void;
  notificationList: notification[] | undefined;
}

const NotificationList: React.FC<NotificationListProps> = ({
  closeNotiList,
  notificationList,
}) => {
  return (
    <>
      <div className="absolute z-50 w-4/5 grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-3 dark:bg-gray-700">
        <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white w-full">
          {notificationList?.map((noti) => {
            return (
              <button
                className="flex items-center w-full hover:bg-slate-500/10"
                onClick={closeNotiList}
              >
                <div className="mx-2">
                  <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex flex-col items-start w-full">
                  <h2 className="text-lg font-bold dark:text-white">
                    {noti.title}
                  </h2>
                  <p className="text-base text-gray-500">{noti.body}</p>
                  <p className="text-xs text-gray-400">
                    {dayjs(noti.dateCreated).format("DD/MM/YYYY")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NotificationList;
