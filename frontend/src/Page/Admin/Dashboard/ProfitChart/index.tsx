import { Line } from "@ant-design/plots";
import { useState, useEffect, useContext } from "react";
import { getStatisticProfit } from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";

const DemoLine: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { token } = useContext(UserContext);
  const [monthData, setMonthData] = useState<TypeMonth[]>();
  
  useEffect(() => {
    const fetchGetMonthProfit = async () => {
      try {
        if (token) {
          const data: TypeMonth[] | undefined = await getStatisticProfit(token);
          setMonthData(data);
        }
      } catch (error) {
        console.error("Error fetching month list:", error);
      }
    };

    fetchGetMonthProfit();
  }, [token]);

  if (!monthData) {
    return <div>Loading...</div>;
  }

  const config = {
    data: monthData, 
    xField: "month",
    yField: "formattedNumberOfProfit",
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <div style={{ height: '100%', ...style }}>
      <Line {...config} />
    </div>
  );
};

export default DemoLine;
