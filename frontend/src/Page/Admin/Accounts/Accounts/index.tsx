import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps,
  Tag,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import {
  getAccounts
} from "../../../../api/Admin/adminAccounts";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";

const AdminAccounts: React.FC = () => {

  const [accountData, setAccountData] = useState<Account[]>([]);
  const [filteredData, setFilteredData] = useState<Account[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { token } = useContext(UserContext);

  const fetchAccountList = async () => {
    try {
      if (token) {
        let data: Account[] | undefined;
          data = await getAccounts(token);
          setAccountData(data || []);
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching account list:", error);
    }
  };

  useEffect(() => {
    fetchAccountList();
  }, [token]);

  useEffect(() => {
    if (accountData) {
      const filtered = accountData.filter(
        (account) =>
          account.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          account.email.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchInput, accountData]);


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
      render: (account_Status: number) => {
        let color = account_Status === 1 ? "volcano" : "green";
        let status = account_Status === 1 ? "Block" : "Active"
        return (
          <Tag color={color} key={account_Status}>
            {status.toUpperCase()}
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
              value={searchInput}
              crossOrigin={undefined}
              onChange={(e) => { setSearchInput(e.target.value); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           
             />
            </div>
          </div>
          <Table columns={columns} dataSource={filteredData} bordered />
        </div>
    </>
  );
};

export default AdminAccounts;
