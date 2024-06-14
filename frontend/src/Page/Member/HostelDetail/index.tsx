import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { GetHostelDetail } from "../../../api/Hostels";
import HostelFacilites from "./HostelFacilites";

const HostelOverview = lazy(() => import("./HostelOverview"));
const RoomAndPrice = lazy(() => import("./RoomAndPrice"));

interface TabProps {
  id: string;
  label: string;
  content: React.ReactNode;
}

const MemberHostelDetail: React.FC = () => {
  const { hostelID } = useParams<{ hostelID: string }>();
  const [hostel, setHostel] = useState<Hostel | undefined>();
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await GetHostelDetail(hostelID);
        if (response?.data) {
          setHostel(response.data);
        } else {
          console.error("Response data is undefined or empty");
        }
      } catch (error) {
        console.error("Error fetching hostel images:", error);
      }
    };

    fetchHostels();
  }, [hostelID]);

  const handleTabClick = (tabId: string) => {
    const index = tabs.findIndex((tab) => tab.id === tabId);
    setActiveTabIndex(index);
    tabRefs.current[tabId]?.scrollIntoView({ behavior: "smooth" });
  };

  const tabs: TabProps[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <Suspense fallback={<div>Loading...</div>}>
          <HostelOverview
            hostelId={parseInt(hostelID ?? "", 10)}
            hostelName={hostel?.hostelName ?? ""}
            hostelAddress={hostel?.hostelAddress ?? ""}
            hostelDescription={hostel?.hostelDescription ?? ""}
          />
        </Suspense>
      ),
    },
    {
      id: "infomation",
      label: "Apartment info & price",
      content: (
        <Suspense fallback={<div>Loading...</div>}>
          <RoomAndPrice hostelId={parseInt(hostelID ?? "", 10)} />
        </Suspense>
      ),
    },
    // {
    //   id: "facilities",
    //   label: "Facilities & Policies",
    //   content: (
    //     <HostelFacilites
    //       hostelName={hostel?.hostelName ?? ""}
    //       hostelSerivces={hostel?.hostelServices ?? []}
    //     />
    //   ),
    // },
    // {
    //   id: "rules",
    //   label: "House rules",
    //   content: <p>This is the Contacts tab's associated content.</p>,
    // },
    // {
    //   id: "notes",
    //   label: "The fine print",
    //   content: <p>This is the Contacts tab's associated content.</p>,
    // },
  ];

  return (
    <>
      <div className="p-4 md:p-5">
        <ul
          className="flex flex-wrap items-center justify-center -mb-px text-sm font-medium text-center bg-white px-4 w-full"
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <li key={tab.id} className="w-1/5" role="presentation">
              <button
                className={`inline-block p-4 rounded-t-lg w-full ${
                  activeTabIndex === index
                    ? "border-b-2 border-black font-semibold dark:border-gray-700 dark:text-gray-200"
                    : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 font-semibold"
                }`}
                id={`${tab.id}-tab`}
                data-tabs-target={`#${tab.id}`}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTabIndex === index}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div id="default-tab-content" className="p-4 md:p-5">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              className={`dark:bg-gray-800 ${
                activeTabIndex === index ? "block" : ""
              }`}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
            >
              {/* {index <= activeTabIndex && (
                <Suspense fallback={<div>Loading...</div>}></Suspense>
              )} */}

              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberHostelDetail;
