import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { Table, TableColumnsType } from "antd";
import dayjs from "dayjs";
import { getMemberViewAppointment } from "../../../api/Member/memberRoomAppointment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const handleButtonClick = (roomID: string) => {
    navigate(`/room/detail/${roomID}`);
  };
  const columns: TableColumnsType<MemberViewAppointment> = [
    {
      title: "Appointment No.",
      dataIndex: "viewRoomAppointmentId",
      sortDirections: ["descend"],
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "appointmentTime",
      defaultSortOrder: "descend",
      render: (_, record) =>
        `${dayjs(record.appointmentTime).format("DD/MM/YYYY")}`,
      sorter: (a, b) => {
        return (
          new Date(a.appointmentTime).getTime() -
          new Date(b.appointmentTime).getTime()
        );
      },
      sortIcon: () => <ChevronUpDownIcon className="w-5 h-5" />,
      align: "center",
    },
    {
      title: "Room name",
      dataIndex: "roomName",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "View",
          value: 0,
        },
        {
          text: "Accept",
          value: 1,
        },
        {
          text: "Cancel",
          value: 1,
        },
        {
          text: "Hire Directly",
          value: 1,
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        switch (record.status) {
          case 0:
            return (
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                View
              </span>
            );
          case 1:
            return (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Accept
              </span>
            );
          case 2:
            return (
              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                Cancel
              </span>
            );
          case 3:
            return (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
                Hire Directly
              </span>
            );
        }
      },
      align: "center",
    },
    {
      title: "",
      align: "center",
      dataIndex: "action",
      render: (_, record) => (
        <button
          onClick={() => handleButtonClick(record.roomId.toString())}
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          // onClick={() => handleButtonClick(room.roomID.toString())}
        >
          View room detail
        </button>
      ),
    },
  ];
  const [memberViewAppointment, setMemberViewAppointment] = useState<
    MemberViewAppointment[]
  >([]);
  const { token, userId } = useContext(UserContext);
  const fetchMemberAppointmnet = async () => {
    if (token != undefined && userId != undefined) {
      let data: MemberViewAppointment[] | undefined;
      data = await getMemberViewAppointment(userId, token);
      setMemberViewAppointment(data || []);
    }
  };

  useEffect(() => {
    fetchMemberAppointmnet();
  }, []);
  return (
    <>
      <div className="w-full text-center font-bold bg-[#f0f8ff] p-5 mb-5 uppercase">
        Appointment list
      </div>
      <Table
        loading={memberViewAppointment.length === 0}
        columns={columns}
        dataSource={memberViewAppointment}
        pagination={{ position: ["bottomCenter"], pageSize: 5 }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
};

export default Appointment;
