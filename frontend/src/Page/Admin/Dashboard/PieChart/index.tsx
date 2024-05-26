import { Pie } from "@ant-design/plots";
import { useState, useEffect , useContext} from "react";
import {
    getStatisticPackage
} from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";


const PropertiesPie: React.FC = () => {
  const { token } = useContext(UserContext);
  const [typeData, settypeData] = useState<TypePackage[]>();
  
  useEffect(() => {
    const fetchGetTypePackage = async () => {
      try {
        if (token) {
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
    radius: 0.8,
    label: {
      type: "outer",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return <Pie {...config} />;
};

export default PropertiesPie;
