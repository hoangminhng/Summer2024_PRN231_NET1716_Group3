const Banner = () => {
  return (
    <div className="w-full relative bg-[#eefaf2] grid grid-cols-2 gap-4 mb-4 rounded-[12px] overflow-hidden">
      <div className="container w-full mx-auto inset-0 flex lg:items-start justify-center flex-col md:text-5xl sm:text-4xl text-black font-bold p-3">
        <p className="text-3xl text-gray-900 font-extralight dark:text-white">
          Welcome to Airestates
        </p>
        <p className="text-6xl text-gray-900 font-medium dark:text-white text-left font-sans">
          Find Your Dream Home Today
        </p>
        {/* <div className="w-2/3 mt-5 flex items-center relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="email"
            id="default-search"
            className="block w-full p-4 ps-10 text-base text-gray-900 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter find hostel"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 text-lg font-medium text-white absolute right-2.5 bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-full"
          >
            Search
          </button>
        </div> */}
      </div>
      <img
        src="src/assets/Housebanner.png"
        alt=""
        className="w-full md:h-96 sm:h-72"
      />
    </div>
  );
};

export default Banner;
