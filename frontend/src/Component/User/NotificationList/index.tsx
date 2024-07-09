import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../../../Utils/truncateText";

interface NotificationListProps {
  closeNotiList: () => void;
  notificationList: notification[] | undefined;
}

interface TabProps {
  id: string;
  label: string;
}

const tabs: TabProps[] = [
  {
    id: "readNotification",
    label: "read",
  },
  {
    id: "unReadNotification",
    label: "unread",
  },
];

const NotificationList: React.FC<NotificationListProps> = ({
  closeNotiList,
  notificationList,
}) => {
  const navigate = useNavigate();
  const handleNotiClicked = (noti: notification) => {
    closeNotiList();
    navigate(noti.forward_to_path);
  };
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const filteredNotifications = notificationList?.filter((noti) =>
    activeTab === "unReadNotification" ? !noti.is_read : noti.is_read
  );

  const handleButtonReadAll = () => {
    navigate("/notification");
  };
  return (
    <>
      <div className="absolute z-50 w-4/5 grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 md:grid-cols-3 dark:bg-gray-700">
        <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white w-full">
          <h2 className="text-lg font-bold text-start">Notification</h2>
          <ul
            className="flex flex-wrap w-full items-center justify-start -mb-px text-sm font-medium text-center bg-white px-4"
            role="tablist"
          >
            {tabs.map((tab) => (
              <li key={tab.id} className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 ${
                    activeTab === tab.id
                      ? "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                      : "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  }`}
                  id={`${tab.id}-tab`}
                  data-tabs-target={`#${tab.id}`}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between my-2 items-center">
            <div className="text-base font-bold text-start">
              New notification
            </div>
            <button
              className="text-[#1d4ed8] hover:bg-gray-100 px-2 py-2"
              onClick={handleButtonReadAll}
            >
              read all
            </button>
          </div>
          {filteredNotifications?.map((noti) => {
            return (
              <button
                className="flex items-center justify-start w-full hover:bg-slate-500/10 rounded-lg"
                onClick={() => handleNotiClicked(noti)}
              >
                <div className="mx-2">
                  {noti.notification_type === 1 ? (
                    <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                  ) : (
                    <CreditCardIcon className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center w-full">
                  <div className="flex flex-col items-start w-full">
                    <h2 className="text-lg font-bold dark:text-white">
                      {noti.title}
                    </h2>
                    <p className="text-base text-start text-gray-500">
                      {truncateText(noti.notification_text, 50)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayjs(noti.create_date).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  {noti.is_read ? null : (
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
    </>
  );
};

export default NotificationList;
