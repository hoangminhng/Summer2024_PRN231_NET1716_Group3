import { useContext, useEffect, useState } from "react";
import {Spin} from "antd";
import {ApiOutlined, LoadingOutlined} from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getBillPaymentDetail } from "../../../api/Owner/ownerBillPayment";
import BillDetail from "../../../Component/Owner/BillDetail/indext";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

const BillPaymentDetail: React.FC = () => {
  const [billPayment, setBillPayment] = useState<BillPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);
  const [packageLoading, setPackageLoading] = useState(true);
  const { billPaymentId } = useParams<{ billPaymentId: string }>();
  const [activePackage, setActivePackage] = useState<RegisterPackage>()
  const navigate = useNavigate();

  const fetchBillPaymentDetail = async () => {
    if (billPaymentId !== undefined && token !== undefined) {
      setLoading(true);
      try {
        const response = await getBillPaymentDetail(
          parseInt(billPaymentId),
          token
        );
        if ("statusCode" in response && "message" in response) {
          console.log(response);
        } else {
          console.log("Bill payment details: ", response);
          setBillPayment(response);
        }
      } catch (error) {
        console.log(error);
        navigate("/owner/bill-payment");
      } finally {
        setLoading(false);
      }
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
      fetchBillPaymentDetail();
    }
  }, [packageLoading]);

  

  return (
    <>
    {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
    <div style={{ margin: 16 }}>
      <BillDetail billPayment={billPayment} loading={loading} />
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

export default BillPaymentDetail;
