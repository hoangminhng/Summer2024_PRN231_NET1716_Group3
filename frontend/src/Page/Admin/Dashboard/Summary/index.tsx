import { Card, Statistic } from "antd";
import { NumberFormat } from "../../../../Utils/numberFormat";
import {
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect , useContext} from "react";
import {
    getStatistic
} from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";

const gridStyle: React.CSSProperties = {
  width: "50%",
  textAlign: "center",
  //   borderStyle: "none",
};

const Summary: React.FC = () => {
  const { token } = useContext(UserContext);
  const [totalData, settotalData] = useState<Dashboard>();
  
  useEffect(() => {
    const fetchGetSummary = async () => {
      try {
        if (token) {
          const data: Dashboard | undefined = await getStatistic(token);
          settotalData(data);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchGetSummary();
  }, [token]);

  return (
    <>
      <Card>
        <Card.Grid style={gridStyle} hoverable={false}>
          <Statistic
            title={
              <span
                style={{
                  color: "#bdc3c9",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                TOTAL REVENUE
              </span>
            }
            value={NumberFormat(totalData?.totalProfit || 0)}
            valueStyle={{ color: "#001529", fontWeight: "bold" }}
            prefix={
              <span
                style={{ color: "red", fontSize: "30px", fontWeight: "bold" }}
              >
                <DollarOutlined />
              </span>
            }
          />
        </Card.Grid>
        <Card.Grid style={gridStyle} hoverable={false}>
          <Statistic
            title={
              <span
                style={{
                  color: "#bdc3c9",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                ACCOUNTS
              </span>
            }
            value={totalData?.totalAccount}
            valueStyle={{ color: "#001529", fontWeight: "bold" }}
            prefix={
              <span
                style={{
                  color: "green",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                <UserOutlined />
              </span>
            }
          />
        </Card.Grid>
      </Card>
    </>
  );
};

export default Summary;
