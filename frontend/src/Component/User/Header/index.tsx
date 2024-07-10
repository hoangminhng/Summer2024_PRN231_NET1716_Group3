import { useContext, useEffect, useRef, useState } from "react";
import { BellIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../../context/userContext";
import { AvatarDropdown } from "../AvatarDropDown";
import { AvatarDropdownOwner } from "../../Owner/AvatarDropDownOwner";
import LoginModal from "../../LoginModal";
import NotificationList from "../NotificationList";

const HeaderTest: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<
    notification[] | undefined
  >([]);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const { userRole, isAuth } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleNoti = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleModal();
    }
  };

  const closeNotiList = () => {
    setIsNotiOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        // Click occurred outside of the notification list, so close it
        closeNotiList();
      }
    };
    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isNotiOpen]);

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

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://res.cloudinary.com/dfdwupiah/image/upload/v1718272841/PRN231_GroupProject/glq77u926kxvcxggb9k9.png"
            className="h-10"
            alt="Flowbite Logo"
          />
        </a>
        <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
          {isAuth() ? (
            userRole == 3 ? (
              <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
                <li>
                  <button
                    onClick={toggleNoti}
                    className="mr-1 relative inline-flex items-center p-2 text-sm font-medium text-center text-slate-950 bg-[#e4e6eb] rounded-3xl"
                  >
                    <BellIcon className="w-6 h-6" />
                    <span className="sr-only">Notifications</span>
                    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                      20
                    </div>
                  </button>
                </li>
                <AvatarDropdown />
              </ul>
            ) : userRole == 2 ? (
              <div className="hidden md:flex md:order-2">
                <AvatarDropdownOwner />
              </div>
            ) : null
          ) : (
            <button
              onClick={toggleModal}
              type="button"
              className="flex items-center text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base px-5 py-3 text-center mb-2"
            >
              <LockOpenIcon className="w-4 h-4 mr-1" />
              Sign in
            </button>
          )}

          <button
            onClick={toggleMenu}
            data-collapse-toggle="mega-menu"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mega-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-white bg-slate-950 rounded md:bg-transparent md:text-slate-950 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
          </ul>
        </div>
        {isModalOpen && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
          >
            <LoginModal closeModal={toggleModal} />
          </div>
        )}
      </div>
      <div
        id="dropdownNotification"
        className={`${
          isNotiOpen ? "block" : "hidden"
        } z-50 w-full max-w-sm bg-white divide-y divide-gray-100 absolute flex right-3 transition-all duration-300 ease-in rounded-lg `}
        aria-labelledby="dropdownNotificationButton"
        ref={notificationRef}
      >
        <div className="rounded-lg shadow w-full">
          <NotificationList
            closeNotiList={toggleNoti}
            notificationList={notification}
          />
        </div>
      </div>
    </nav>
  );
};
export default HeaderTest;
