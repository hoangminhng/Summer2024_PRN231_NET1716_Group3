import { Card } from "antd";
import { useState, useEffect , useContext} from "react";
import { getStatistic } from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";


const Total: React.FC = () => {
  const { token } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState<Dashboard>();
  
  const fetchStatistic = async () => {
    try {
      if (token) {
        let data: Dashboard | undefined;
        data = await getStatistic(token);
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching statistic:", error);
    }
  };


useEffect(() => {
    fetchStatistic();
}, [token]);

  return (
    <>
      <Card
        title={
          <div className="flex justify-between">
            <span
              style={{
                color: "burlywood",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              Accounts : {<span className="text-black">{dashboardData?.totalAccount}</span>}
            </span>
            <span
              style={{
                color: "limegreen",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              MemberShips : {<span className="text-black">{dashboardData?.totalMemberShip}</span>}
            </span>
            <span
              style={{
                color: "#477ffb",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              Packages : {<span className="text-black">{dashboardData?.totalPackage}</span>}
            </span>
            <span
              style={{
                color: "#477ffb",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              Hostels : {<span className="text-black">{dashboardData?.totalHostel}</span>}
            </span>
          </div>
        }
      >
      </Card>
    </>
  );
};

export default Total;
