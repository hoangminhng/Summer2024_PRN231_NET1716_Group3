import { useState } from "react";
import UserLogin from "./UserLogin";

interface TabProps {
  id: string;
  label: string;
  content: React.ReactNode;
}

const tabs: TabProps[] = [
  {
    id: "dashboard",
    label: "User Login",
    content: <UserLogin />,
  },
];

const LoginModal: React.FC = () => {
  const [activeTab] = useState<string>(tabs[0].id);

  return (
    <>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
          </div>
          <div className="p-4 md:p-5">
            {/* <ul
              className="flex flex-wrap items-center justify-center -mb-px text-sm font-medium text-center bg-white px-4 w-full"
              role="tablist"
            >
              {tabs.map((tab) => (
                <li key={tab.id} className="w-1/2" role="presentation">
                  <button
                    className={`inline-block p-4 rounded-t-lg w-full ${
                      activeTab === tab.id
                        ? "border-b-2 border-black font-semibold dark:border-gray-700 dark:text-gray-200"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 font-semibold"
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
            </ul> */}
            <div id="default-tab-content" className="p-4 md:p-5">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`dark:bg-gray-800 ${
                    activeTab === tab.id ? "block" : "hidden"
                  }`}
                  id={tab.id}
                  role="tabpanel"
                  aria-labelledby={`${tab.id}-tab`}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
