import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps,
  Tag,
  notification,
} from "antd";
// import { useState, useEffect } from "react";
// import {
//   getAccount
// } from "../../../../api/accounts";
// import { useContext } from "react";
// import { UserContext } from "";

const AdminAccounts: React.FC = () => {
  const columns: TableProps<Account>["columns"] = [
    {
      title: "Account Name",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Account Email",
      dataIndex: "email",
      width: "20%",
    },
    {
        title: "Account Phone",
        dataIndex: "phone",
        width: "20%",
    },
    {
        title: "Account Address",
        dataIndex: "address",
        width: "35%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      render: (account_Status: string) => {
        let color = account_Status === "Block" ? "volcano" : "green";
        return (
          <Tag color={color} key={account_Status}>
            {account_Status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  
  const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
    notification[type]({
      message: "Notification Title",
      description: description,
    });
  };

  return (
    <>
        <div>
          {/* Bảng danh sách */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72 flex flex-row justify-start">
              <Input
                label="Search by Name or Email"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                crossOrigin={undefined}
                onKeyDown={(e) => {
                   e.currentTarget.value;
                  }
                }
              />
            </div>
          </div>
          <Table columns={columns} dataSource={Accounts} bordered />
        </div>
    </>
  );
};

export default AdminAccounts;
