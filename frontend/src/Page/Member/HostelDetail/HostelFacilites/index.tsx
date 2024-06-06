import { NumberFormat } from "../../../../Utils/numberFormat";

interface FacilitiesProps {
  hostelName: string;
  hostelSerivces: HostelService[];
}

const HostelFacilites: React.FC<FacilitiesProps> = ({
  hostelName,
  hostelSerivces,
}) => {
  return (
    <>
      <style>
        {`
          .hover\\:scale-up {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .hover\\:scale-up:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <div className="flex flex-col items-start mt-3">
        <h1 className="text-4xl font-bold">Facilities of {hostelName}</h1>
        <div className="w-full grid grid-cols-5 gap-4 mt-4">
          {hostelSerivces.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-full rounded mx-1 dark:bg-gray-800"
            >
              <div className="relative w-full bg-white border border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700 hover:scale-up">
                <div className="p-4">
                  <div className="flex flex-col items-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      {service.serviceName}
                    </p>
                    <p className="mb-3 font-normal text-xl text-[#4CAF50] dark:text-gray-400">
                      {NumberFormat(service.servicePrice)} /month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Service name
            </th>
            <th scope="col" className="px-6 py-3">
              Service price
            </th>
            <th scope="col" className="px-6 py-3">
              typeServiceID
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {hostelSerivces.map((service) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={service.serviceID}
            >
              <td className="px-6 py-4 w-1/5">{service.serviceName}</td>
              <td className="px-6 py-4 w-1/5">
                {NumberFormat(service.servicePrice)} /month
              </td>
              <td className="px-6 py-4 w-1/5">{service.typeServiceID}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      </div>
    </>
  );
};

export default HostelFacilites;
