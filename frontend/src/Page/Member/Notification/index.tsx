import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../../../Utils/truncateText";
import dayjs from "dayjs";

const NotificationMember: React.FC = () => {
  const notification: notification[] = [
    {
      notification_id: 1,
      account_notice_id: 1,
      receive_account_id: 5,
      notification_text: "Your contract has been approved",
      create_date: new Date(),
      notification_type: 1,
      title: "Contract approval",
      forward_to_path: "/contracts",
      is_read: true,
    },
    {
      notification_id: 2,
      account_notice_id: 1,
      receive_account_id: 5,
      notification_text:
        "You have a new contract of room Apartment no.02 in Vinhomes Golden River at Vinhomes Golden River Ba Son, Phố Tôn Đức Thắng, Phường Bến Nghé, Quận 1, Hồ Chí Minh. Please move to the contract page for further detail",
      create_date: new Date(),
      notification_type: 2,
      title: "Monthly payment",
      forward_to_path: "/payment",
      is_read: false,
    },
  ];
  const navigate = useNavigate();
  const handleNotiClicked = (noti: notification) => {
    navigate(noti.forward_to_path);
  };
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-3/4 bg-[#f3f4f6] rounded-2xl p-2">
        <div className="text-2xl font-bold text-center">Notification</div>
        <div className="h-screen">
          {notification?.map((noti) => {
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
                      {noti.notification_text}
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
    </div>
  );
};
export default NotificationMember;
