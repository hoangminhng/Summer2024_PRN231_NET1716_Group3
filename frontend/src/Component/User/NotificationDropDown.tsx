import {
  Menu,
  MenuHandler,
  MenuList,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import React, { useState } from "react";
import {
  BellIcon,
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

const data = [
  {
    label: "Unread",
    value: "unread",
    desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
  },
  {
    label: "React",
    value: "read",
    desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
  },
];

export function NotificationDropdown() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = React.useState("unread");

  const closeMenu = () => setIsMenuOpen(false);

  const handleClick = (path: string) => {
    closeMenu();
  };
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-start">
      <MenuHandler>
        <button
          type="button"
          className="mr-1 relative inline-flex items-center p-2 text-sm font-medium text-center text-slate-950 bg-[#e4e6eb] rounded-3xl"
        >
          <BellIcon className="w-6 h-6" />
          <span className="sr-only">Notifications</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
            20
          </div>
        </button>
      </MenuHandler>
      <MenuList
        className="py-2 pr-5 pl-0 w-1/4"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={activeTab === value ? "text-gray-900" : ""}
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
        {/* <div>test</div>
        {profileMenuItems.map(({ label, icon, path }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <button
              key={label}
              onClick={() => handleClick(path)}
              className={`flex items-center gap-2 rounded py-3 text-sm text-gray-700 dark:text-gray-400 w-full mx-3 ${
                isLastItem
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
        })} */}
      </MenuList>
    </Menu>
  );
}
