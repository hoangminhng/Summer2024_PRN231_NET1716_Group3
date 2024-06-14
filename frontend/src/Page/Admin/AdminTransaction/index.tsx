import {
  Table,
  TableProps
} from "antd";
import { useState, useEffect } from "react";
import { getTransactions } from "../../../api/Admin/adminTransaction";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { NumberFormat } from "../../../Utils/numberFormat";
import { DateFormat } from "../../../Utils/dateFormat";

const AdminTransaction: React.FC = () => {

  const [transactionData, setTransactionData] = useState<TransactionMembership[]>([]);
  const { token } = useContext(UserContext);

  const fetchAccountList = async () => {
    try {
      if (token != undefined) {
        let data: TransactionMembership[] | undefined;
          data = await getTransactions(token);
          setTransactionData(data || []);
        }
      } catch (error) {
      console.error("Error fetching transaction list:", error);
    }
  };

  useEffect(() => {
    fetchAccountList();
  }, [token]);


  const columns: TableProps<TransactionMembership>["columns"] = [
    {
      title: "No",
      dataIndex: "memberShipTransactionID",
      width: "5%",
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
        title: "Fee Amount",
        dataIndex: "packageFee",
        width: "20%",
        render: (packageFee : number) => {
            return NumberFormat(packageFee);
        }
    },
    {
        title: "Date Create",
        dataIndex: "dateRegister",
        width: "20%",
        render: (dateRegister : Date) => {
            return DateFormat(dateRegister);
        }
    },
  ];


  return (
    <>
        <div>
          {/* Bảng danh sách */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h3 title="Transaction List"/>
            <br />
          </div>
          <Table columns={columns} dataSource={transactionData} bordered pagination={{ pageSize: 8 }}/>
        </div>
    </>
  );
};

export default AdminTransaction;
