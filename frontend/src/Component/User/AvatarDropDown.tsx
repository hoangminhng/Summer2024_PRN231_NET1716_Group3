import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  Avatar,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

import {
  ChevronDownIcon,
  CreditCardIcon,
  PowerIcon,
  UserCircleIcon,
  HomeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const profileMenuItems = [
  {
    label: "My Profile",
    path: "profile",
    icon: UserCircleIcon,
  },
  {
    label: "Contract",
    path: "contracts",
    icon: UserCircleIcon,
  },
  {
    label: "Payment",
    path: "payment",
    icon: CreditCardIcon,
  },
  {
    label: "Appointments",
    path: "appointments",
    icon: CalendarDaysIcon,
  },
  {
    label: "Rented Room",
    path: "rentedRooms",
    icon: HomeIcon,
  },
  {
    label: "Complains History",
    path: "complains",
    icon: BookOpenIcon,
  },
  {
    label: "Sign Out",
    path: "signout",
    icon: PowerIcon,
  },
];

export function AvatarDropdown() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    if (path === "signout") {
      logout();
      navigate("/");
    } else {
      navigate(path);
    }
    closeMenu();
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 py-0.5 pr-2 pl-0.5 custom-dropdown-button"
          placeholder=""
          onPointerEnterCapture={() => { }}
          onPointerLeaveCapture={() => { }}
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            placeholder=""
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
              }`}
          />
        </Button>
      </MenuHandler>
      <MenuList
        className="py-2 pr-5 pl-0 custom-dropdown-menu"
        placeholder=""
        onPointerEnterCapture={() => { }}
        onPointerLeaveCapture={() => { }}
      >
        {profileMenuItems.map(({ label, icon, path }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <button
              key={label}
              onClick={() => handleClick(path)}
              className={`flex items-center gap-2 rounded py-3 text-sm text-gray-700 dark:text-gray-400 w-full mx-3 ${isLastItem
                ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                : "hover:bg-slate-500/10 focus:bg-slate-500/10 active:bg-slate-500/10"
                }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <p className="font-normal" color={isLastItem ? "red" : "inherit"}>
                {label}
              </p>
            </button>
          );
        })}
      </MenuList>
    </Menu>
  );
}
