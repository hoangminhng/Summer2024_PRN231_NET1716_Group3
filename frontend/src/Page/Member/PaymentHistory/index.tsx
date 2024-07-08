import { Table, TableColumnsType } from "antd";
import dayjs from "dayjs";
import { NumberFormat } from "../../../Utils/numberFormat";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { getBillPaymentMember } from "../../../api/Member/memberPaymentHistory";
import BillPaymentMonthly from "./BillPaymentMonthly";
import { getBillPaymentMonthlyMember } from "../../../api/Member/memberMonthlyPayment";

const columns: TableColumnsType<BillPaymentMember> = [
  {
    title: "Bill No.",
    dataIndex: "billPaymentId",
    sortDirections: ["descend"],
    width: 10,
  },
  {
    title: "Datetime",
    dataIndex: "monthYear",
    defaultSortOrder: "descend",
    render: (_, record) => `${dayjs(record.createDate).format("DD/MM/YYYY")}`,
    sorter: (a, b) =>
      new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
    sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
    width: 15,
  },
  {
    title: "Paid date",
    dataIndex: "paidDate",
    render: (_, record) => `${dayjs(record.paidDate).format("DD/MM/YYYY")}`,
    sorter: (a, b) =>
      new Date(a.paidDate).getTime() - new Date(b.paidDate).getTime(),
    sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
    width: 15,
  },
  {
    title: "Bill type",
    dataIndex: "billType",
    filters: [
      {
        text: "Deposit",
        value: 1,
      },
      {
        text: "Monthly payment",
        value: 2,
      },
    ],
    onFilter: (value, record) => record.billType === value,
    render: (_, record) => {
      switch (record.billType) {
        case 1:
          return (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              Deposit
            </span>
          );
        case 2:
          return (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              Monthly payment
            </span>
          );
      }
    },
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
    title: "",
    dataIndex: "action",
    render: (_) => (
      <button
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        // onClick={() => handleButtonClick(room.roomID.toString())}
      >
        View detail
      </button>
    ),
    width: 15,
  },
];

const PaymentHistory: React.FC = () => {
  const [billPaymentMember, setBillPaymentMember] = useState<
    BillPaymentMember[]
  >([]);
  const { token, userId } = useContext(UserContext);
  const fetchBillPaymentMember = async () => {
    if (token != undefined && userId != undefined) {
      let data: BillPaymentMember[] | undefined;
      data = await getBillPaymentMember(token);
      setBillPaymentMember(data || []);
    }
  };

  const [billMonthlyPaymentMember, setBillMonthlyPaymentMember] = useState<
    BillPaymentMonthlyMember[]
  >([]);
  const fetchBillMonthlyPaymentMember = async () => {
    if (token != undefined && userId != undefined) {
      let data: BillPaymentMonthlyMember[] | undefined;
      data = await getBillPaymentMonthlyMember(token);
      setBillMonthlyPaymentMember(data || []);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    fetchBillPaymentMember();
    fetchBillMonthlyPaymentMember();
  }, []);
  return (
    <>
      <div className="w-full text-center font-bold bg-[#f0f8ff] p-5 mb-5 uppercase">
        Payment history
      </div>
      <Table
        loading={billPaymentMember === undefined}
        columns={columns}
        dataSource={billPaymentMember}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
      {billMonthlyPaymentMember.length > 0 ? (
        <BillPaymentMonthly data={billMonthlyPaymentMember} />
      ) : null}
    </>
  );
};

export default PaymentHistory;
