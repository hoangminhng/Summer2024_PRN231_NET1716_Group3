import { Button, Flex, Table } from 'antd';
import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../..//context/userContext";
import { getBillListByContractId } from '../../../api/Owner/ownerBillPayment';

const BillList: React.FC = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [bills, setBills] = useState([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    console.log(contractId);
    const fetchBills = async () => {
      try {
        const data = await getBillListByContractId(contractId, token);
        setBills(data);
      } catch (error) {
        console.error('There was an error fetching the bill data!', error);
      }
    };

    fetchBills();
  }, [contractId, token]);

  const handleOpenBillPaymentForm = () => {
    navigate("/owner/bill-payment/bills/form");
  };

  const columns = [
    {
      title: 'Bill ID',
      dataIndex: 'billPaymentID',
      key: 'billPaymentID',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Amount',
      dataIndex: 'billAmount',
      key: 'billAmount',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Status',
      dataIndex: 'billPaymentStatus',
      key: 'billPaymentStatus',
      render: status => (status === 0 ? 'Unpaid' : 'Paid'),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Paid Date',
      dataIndex: 'paidDate',
      key: 'paidDate',
    },
    {
      title: 'Bill Detail',
      key: 'action',
      render: (text, record) => (
        <Link to={`/owner/bill-payment/bills/details/${record.billPaymentID}`}>
          View Detail
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="flex-end" style={{ margin: 20 }}>
        <Button onClick={() => handleOpenBillPaymentForm()}>Create monthly bill</Button>
      </Flex>
      <div style={{ padding: '24px' }}>
      <Table dataSource={bills} columns={columns} rowKey="billPaymentID" />
      </div>
    </div>
  );
};

export default BillList;
