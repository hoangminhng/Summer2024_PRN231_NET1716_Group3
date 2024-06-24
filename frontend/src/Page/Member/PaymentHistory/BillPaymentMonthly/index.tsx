import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { Table, TableColumnsType } from "antd";
import { NumberFormat } from "../../../../Utils/numberFormat";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { payMonthlyBill } from "../../../../api/payment";

interface BillPaymentMonthlyProps {
  data: BillPaymentMonthlyMember[];
}
const BillPaymentMonthly: React.FC<BillPaymentMonthlyProps> = ({ data }) => {
  const navigate = useNavigate();
  const handleRoomClick = (roomID: number) => {
    navigate(`/room/detail/${roomID}`);
  };

  const handleButtonClick = (contractId: number) => {
    navigate(`/contracts/detail/${contractId}`);
  };

  const { token, userId } = useContext(UserContext);
  const handlePayBill = (billPaymentID: number) => {
    try {
      const fetchPaymentUrl = async () => {
        if (userId && token) {
          const response = await payMonthlyBill(billPaymentID, token);
          if (response) {
            window.location.href = response?.paymentUrl;
          }
        }
      };
      fetchPaymentUrl();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columns: TableColumnsType<BillPaymentMonthlyMember> = [
    {
      title: "Bill No.",
      dataIndex: "billPaymentID",
      sortDirections: ["descend"],
      width: 10,
    },
    {
      title: "Datetime",
      dataIndex: "monthYear",
      defaultSortOrder: "descend",
      render: (_, record) =>
        `${String(record.month).padStart(2, "0")}/${record.year}`,
      sorter: (a, b) => {
        if (a.year === b.year) {
          return a.month - b.month;
        }
        return a.year - b.year;
      },
      sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
      width: 15,
    },
    {
      title: "Bill amount",
      dataIndex: "billAmount",
      render: (_, record) => `${NumberFormat(record.billAmount)}`,
      sorter: (a, b) => a.billAmount - b.billAmount,
      sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
      width: 15,
    },
    {
      title: "Total amount",
      dataIndex: "totalAmount",
      render: (_, record) => `${NumberFormat(record.totalAmount)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
      width: 15,
    },
    {
      title: "Room Name",
      dataIndex: "roomName",
      render: (_, record) => {
        return (
          <a
            onClick={() => handleRoomClick(record.roomID)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            {record.roomName}
          </a>
        );
      },
      width: 10,
    },
    {
      title: "Status",
      dataIndex: "billPaymentStatus",
      onFilter: (value, record) => record.billPaymentStatus === value,
      render: (_, record) => {
        switch (record.billPaymentStatus) {
          case 0:
            return (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                Pending
              </span>
            );
        }
      },
      width: 15,
    },
    {
      title: "Date created",
      dataIndex: "createdDate",
      render: (_, record) =>
        `${dayjs(record.createdDate).format("DD/MM/YYYY")}`,
      sorter: (a, b) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
      width: 15,
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex flex-col">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => handleButtonClick(record.contractId)}
          >
            View contract
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => handlePayBill(record.billPaymentID)}
          >
            Pay Now
          </button>
        </div>
      ),
      width: 15,
    },
  ];
  return (
    <>
      <div className="w-full text-center font-bold bg-[#f0f8ff] p-5 mb-5 uppercase">
        Payment monthly
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"] }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
};
export default BillPaymentMonthly;
