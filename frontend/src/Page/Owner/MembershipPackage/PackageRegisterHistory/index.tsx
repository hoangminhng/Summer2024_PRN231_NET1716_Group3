import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext";
import { getOwnerMembershipHistory } from "../../../../api/Owner/ownerPackage";
import { Table, TableProps, Tag } from "antd";
import { NumberFormat } from "../../../../Utils/numberFormat";
import { DateFormat } from "../../../../Utils/dateFormat";
import moment from "moment";

const statusStringMap: { [key: number]: string } = {
    1: "CURRENT",
    2: "EXPIRED",
    3: "BE UPDATED",
    4: "BE EXTENDED"
};

const statusColorMap: { [key: number]: string } = {
    1: "green",
    2: "red",
    3: "grey",
    4: "orange"
};

const PackageRegisterHistory: React.FC = () => {
    const [membershipDetailData, setMembershipDetailData] = useState<RegisterPackage[]>();
    const { userId, token } = useContext(UserContext);

    const fetchMembershipHistory = async () => {
        try {
            if (token && userId) {
                const data = await getOwnerMembershipHistory(token);
                setMembershipDetailData(data);
            }
        } catch (error) {
            console.error("Error fetching package register history:", error);
        }
    };

    useEffect(() => {
        fetchMembershipHistory();
    }, [token]);

    const memberpackageHistory: TableProps<RegisterPackage>["columns"] = [
        {
            title: "No",
            width: "5%",
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: "Package",
            dataIndex: "membershipName",
            width: "15%",
            sorter: (a, b) => a.membershipName.localeCompare(b.membershipName),
        },
        {
            title: "Package Capacity",
            dataIndex: "capacityHostel",
            width: "10%",
            sorter: (a, b) => a.capacityHostel - b.capacityHostel,
        },
        {
            title: "Package Duration",
            dataIndex: "month",
            width: "10%",
            render: (month: number) => `${month} ${month === 1 ? "month" : "months"}`,
            sorter: (a, b) => a.month - b.month,
        },
        {
            title: "You Paid",
            dataIndex: "packageFee",
            width: "15%",
            render: (packageFee: number) => NumberFormat(packageFee),
            sorter: (a, b) => a.packageFee - b.packageFee,
        },
        {
            title: "Date Register",
            dataIndex: "dateRegister",
            width: "15%",
            render: (dateRegister: Date) => DateFormat(dateRegister),
            sorter: (a, b) => new Date(a.dateRegister).getTime() - new Date(b.dateRegister).getTime(),
        },
        {
            title: "Date Expire",
            dataIndex: "dateExpire",
            width: "15%",
            render: (dateExpire: Date) => DateFormat(dateExpire),
            sorter: (a, b) => new Date(a.dateExpire).getTime() - new Date(b.dateExpire).getTime(),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10%",
            render: (status: number) => {
                const statusString = statusStringMap[status];
                const statusColor = statusColorMap[status];
                return statusString && statusColor ? (
                    <Tag color={statusColor} key={statusString}>
                        {statusString}
                    </Tag>
                ) : (
                    <span>Unknown Status ({status})</span>
                );
            },
            sorter: (a, b) => a.status - b.status,
        },
    ];


    return (
        <>
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    backgroundColor: "aliceblue",
                    padding: "20px",
                    marginBottom: "20px",
                }}
            >
                <h2>Package Register History</h2>
            </div>
            <div style={{ padding: "24px" }}>
                <Table
                    columns={memberpackageHistory}
                    dataSource={membershipDetailData}
                    bordered
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </>
    );
};

export default PackageRegisterHistory;
