import { Button, Flex, Table, Spin } from 'antd';
import { useNavigate, useParams, Link } from "react-router-dom";
import {ApiOutlined, LoadingOutlined} from "@ant-design/icons"
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../..//context/userContext";
import { getBillListByContractId } from "../../../api/Owner/ownerBillPayment";
import { NumberFormat } from "../../../Utils/numberFormat";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

const BillList: React.FC = () => {
  const navigate = useNavigate();
  const { contractId } = useParams<{ contractId: string }>();
  const [bills, setBills] = useState([]);
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const { token } = useContext(UserContext);
  const [packageLoading, setPackageLoading] = useState(true);

    console.log(contractId);
    const fetchBills = async () => {
      try {
        if (contractId && token) {
          const data = await getBillListByContractId(
            parseInt(contractId),
            token
          );
          setBills(data);
        }
      } catch (error) {
        console.error("There was an error fetching the bill data!", error);
      }
    };

    const fetchStatusPackage = async () => {
      try {
        if (token != undefined) {
          let data = await getOwnerCurrentActiveMembership(token);
          setActivePackage(data);
        }
      } catch (error) {
        console.error("Error fetching status package:", error);
      } finally {
        setPackageLoading(false);
      }
    };

  useEffect(() => {
    fetchStatusPackage();
  }, [token]);


  useEffect(() => {
    if (!packageLoading) {
      fetchBills();
    }
  }, [packageLoading, contractId, token]);

  const handleViewContract = () => {
    navigate(`/owner/contracts/detail/${contractId}`);
  };
  const columns = [
    {
      title: "Bill ID",
      dataIndex: "billPaymentID",
      key: "billPaymentID",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Amount",
      dataIndex: "billAmount",
      key: "billAmount",
      render: (text: number | undefined) => NumberFormat(text),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text: number | undefined) => NumberFormat(text),
    },
    {
      title: "Status",
      dataIndex: "billPaymentStatus",
      key: "billPaymentStatus",
      render: (status: number) => (status === 0 ? "Unpaid" : "Paid"),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Paid Date",
      dataIndex: "paidDate",
      key: "paidDate",
    },
    {
      title: "Bill Detail",
      key: "action",
      render: (_text: any, record: { billPaymentID: any; }) => (
        <Link to={`/owner/bill-payment/bills/details/${record.billPaymentID}`}>
          View Detail
        </Link>
      ),
    },
  ];

  return (
    <>
    {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
    <div>
      <Flex justify="flex-end" align="center" style={{ margin: 20 }}>
        {/* <Button onClick={handleOpenBillPaymentForm} style={{ marginRight: 8 }}>Create monthly bill</Button> */}
        <Button onClick={handleViewContract}>View contract</Button>
      </Flex>
      <div style={{ padding: '24px' }}>
      <Table dataSource={bills} columns={columns} rowKey="billPaymentID" />
      </div>
    </div>
    ) : (
      <div className="w-full text-center items-center justify-between">
        <ApiOutlined style={{fontSize:"100px", marginTop:"50px"}}/>
        <p style={{fontWeight: "bold"}}>Your current account has not registered for the package, so you cannot access this page. Please register for a membership package to use.</p>
      </div>
    )}
    </>
  );
};

export default BillList;
