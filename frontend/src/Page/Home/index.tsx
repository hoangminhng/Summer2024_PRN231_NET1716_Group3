import Banner from "../../Component/User/Banner";
import { NumberFormat } from "../../Utils/numberFormat";
import { useEffect, useState } from "react";
import { GetHostelCard } from "../../api/Hostels";
import CardHorizontal from "../../Component/User/HostelCardHorizontal";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Home: React.FC = () => {
  const [hostelList, setHostelList] = useState<Hostel[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const hostelsPerPage = 10;

  const fetchHostels = async () => {
    try {
      setLoading(true);
      let respone = await GetHostelCard();
      setHostelList(respone?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchHostels();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (priceRange: number) => {
    setSelectedPriceRanges((prev) => {
      if (prev.includes(priceRange)) {
        return prev.filter((range) => range !== priceRange);
      } else {
        return [...prev, priceRange];
      }
    });
  };

  const filterHostels = () => {
    if (selectedPriceRanges.length === 0) {
      return hostelList;
    }

    return hostelList?.filter((hostel) => {
      const price = hostel.lowestPrice; // Assuming hostel has a price property
      if (selectedPriceRanges.includes(1) && price <= 2000000) return true;
      if (
        selectedPriceRanges.includes(2) &&
        price >= 2000000 &&
        price <= 5000000
      )
        return true;
      if (
        selectedPriceRanges.includes(3) &&
        price >= 5000000 &&
        price <= 10000000
      )
        return true;
      if (selectedPriceRanges.includes(4) && price >= 10000000) return true;
      return false;
    });
  };

  const filteredHostels = filterHostels();
  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = filteredHostels?.slice(
    indexOfFirstHostel,
    indexOfLastHostel
  );
  const totalPages = filteredHostels
    ? Math.ceil(filteredHostels.length / hostelsPerPage)
    : 1;
  return (
    <>
      <Banner />
      <div className="p-4 flex">
        <div
          id="default-sidebar"
          className="transition-transform -translate-x-full sm:translate-x-0 mx-1 w-1/5"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 w-full">
            <ul className="space-y-2 font-medium">
              <li className="flex">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
                <span className="ms-3">SEARCH FILTER</span>
              </li>
              <hr />
              <li>
                <fieldset className="p-2">
                  <div className="text-gray-900 dark:text-white font-medium">
                    Price Range
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="price-range-1"
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-75 rounded"
                      onChange={() => handleFilterChange(1)}
                    />
                    <label
                      htmlFor="price-range-1"
                      className="ml-2 text-xs text-gray-900 dark:text-white font-bold"
                    >
                      Under {NumberFormat(2000000)}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="price-range-2"
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-75 rounded"
                      onChange={() => handleFilterChange(2)}
                    />
                    <label
                      htmlFor="price-range-2"
                      className="ml-2 text-xs text-gray-900 dark:text-white font-bold"
                    >
                      {NumberFormat(2000000)} - {NumberFormat(5000000)}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="price-range-3"
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-75 rounded"
                      onChange={() => handleFilterChange(3)}
                    />
                    <label
                      htmlFor="price-range-3"
                      className="ml-2 text-xs text-gray-900 dark:text-white font-bold"
                    >
                      {NumberFormat(5000000)} - {NumberFormat(10000000)}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="price-range-4"
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-75 rounded"
                      onChange={() => handleFilterChange(4)}
                    />
                    <label
                      htmlFor="price-range-4"
                      className="ml-2 text-xs text-gray-900 dark:text-white font-bold"
                    >
                      More than {NumberFormat(10000000)}
                    </label>
                  </div>
                </fieldset>
              </li>
            </ul>
          </div>
        </div>
        {loading == true ? (
          <div className="flex justify-center items-center w-full">
            <Spin
              size="large"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </div>
        ) : (
          <div className="flex flex-col mx-4 w-4/5">
            {currentHostels?.map((hostel, index) => (
              <CardHorizontal hostel={hostel} key={index} />
            ))}

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
        )}
      </div>
    </>
  );
};

export default Home;
