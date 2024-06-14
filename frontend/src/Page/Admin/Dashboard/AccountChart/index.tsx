import { Line } from "@ant-design/plots";
import { Select } from "antd";
import { useState, useEffect, useContext } from "react";
import { getStatisticAccount } from "../../../../api/Admin/adminDashboard";
import { UserContext } from "../../../../context/userContext";

const AccountLine: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { token } = useContext(UserContext);
  const [monthData, setMonthData] = useState<AccountMonth[]>([]);
  const [yearValue, setYear] = useState<number>();

  const handleChange = async (value: number) => {
    setYear(value);
    try {
      if (token) {
        const data: AccountMonth[] | undefined = await getStatisticAccount(token, value);
        setMonthData(data || []);
      }
    } catch (error) {
      console.error("Error fetching month data:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (token) {
          const initialYear = 2024;
          setYear(initialYear);
          const data: AccountMonth[] | undefined = await getStatisticAccount(token, initialYear);
          setMonthData(data || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [token]);

  const config = {
    data: monthData,
    xField: "month",
    yField: "numberOfAccount",
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <div style={{ height: '100%', ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", margin: "30px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase" }}>
            Statistics table of the number of account
          </h2>
          <p style={{ fontFamily: "cursive" }}>
            Statistics table of the number of accounts in flatform each year.
          </p>
        </div>
        <div>
          <Select
            defaultValue={2024}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: 2021, label: '2021' },
              { value: 2022, label: '2022' },
              { value: 2023, label: '2023' },
              { value: 2024, label: '2024' },
              { value: 2025, label: '2025' },
              { value: 2026, label: '2026' },
            ]}
          />
        </div>
      </div>
      <Line {...config} />
    </div>
  );
};

export default AccountLine;
