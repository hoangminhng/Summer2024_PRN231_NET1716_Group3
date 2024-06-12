import { Pie } from "@ant-design/plots";
import { useState, useEffect , useContext} from "react";
import {
    getStatisticPackage
} from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";


const PropertiesPie: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { token } = useContext(UserContext);
  const [typeData, settypeData] = useState<TypePackage[]>();
  
  useEffect(() => {
    const fetchGetTypePackage = async () => {
      try {
        if (token != undefined) {
          const data: TypePackage[] | undefined = await getStatisticPackage(token);
          settypeData(data);
        }
      } catch (error) {
        console.error("Error fetching type list:", error);
      }
    };

    fetchGetTypePackage();
  }, [token]); 

  if (!typeData) {
    return <div>Loading...</div>;
  }

  const config = {
    appendPadding: 10,
    data: typeData,
    angleField: "numberOfMember", 
    colorField: "memberShipName", 
    radius: 0.6,
    label: {
      type: "outer",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return(
  <div style={{ height: '100%', ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", margin: "30px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase" }}>
          Package statistics chart
          </h2>
          <p style={{ fontFamily: "cursive" }}>
          Statistical chart of number of members for each package.
          </p>
        </div> 
      </div>
      <Pie {...config} />;
    </div>
  )
};

export default PropertiesPie;
