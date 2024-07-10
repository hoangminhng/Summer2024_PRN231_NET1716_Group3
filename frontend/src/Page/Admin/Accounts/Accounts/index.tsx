import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps,
  Tag, Button,
  notification
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccounts,
  DeleteAccount
} from "../../../../api/Admin/adminAccounts";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";

const AdminAccounts: React.FC = () => {

  const [accountData, setAccountData] = useState<Account[]>([]);
  const [filteredData, setFilteredData] = useState<Account[]>([]);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>("");
  const { token } = useContext(UserContext);

  const fetchAccountList = async () => {
    try {
      if (token != undefined) {
        let data: Account[] | undefined;
          data = await getAccounts(token);
          setAccountData(data || []);
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching account list:", error);
    }
  };
  
  const fetchDeleteAccount = async (accountID : number) => {
    try{
      if(token && accountID){
        let data = await DeleteAccount(token, accountID);
        return data;
      }
    }catch(error : any){
      throw error;
    }
  }

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

  const DeleteAccountFunction = async (accountID : number) =>{
    try{
      const response = await fetchDeleteAccount(accountID);
      if (response != undefined) {
        openNotificationWithIcon("success", "Delete account successfully!");
    }
    }catch(error : any){
      openNotificationWithIcon("error", "This account cannot be deleted because it has relationships with many other properties!");
    }
    await fetchAccountList()
  }

  const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
    notification[type]({
        message: "Notification Title",
        description: description,
    });
};


  const columns: TableProps<Account>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
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
      title: "Status",
      dataIndex: "status",
      width: "5%",
      render: (account_Status: number) => {
        let color = account_Status === 1 ? "volcano" : "green";
        let status = account_Status === 1 ? "BLOCK" : "ACTIVE"
        return (
          <Tag color={color} key={account_Status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: Account) => (
        <a onClick={() => navigate(`/admin/accounts/detail/${record.accountId}`)}>View details</a>
      ),
      width: "10%",
    },
    
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: Account) => (
        <Button onClick={() => DeleteAccountFunction(record.accountId)} style={{backgroundColor:"red", fontWeight:"bold"}}>
            Delete Account
            </Button>
      ),
      width: "10%",
    },
  ];


  return (
    <>
        <div>
          {/* Bảng danh sách */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h3 title="Accounts List"/>
            <br />
            <div className="w-full md:w-72 flex flex-row justify-start">
            <Input
              label="Search by Name or Email"
              value={searchInput}
              crossOrigin={undefined}
              onChange={(e) => { setSearchInput(e.target.value); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           
             />
            </div>
          </div>
          <Table columns={columns} dataSource={filteredData} bordered pagination={{ pageSize: 8 }}/>
        </div>
    </>
  );
};

export default AdminAccounts;
