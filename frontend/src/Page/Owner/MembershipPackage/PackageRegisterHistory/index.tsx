import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext";
import { getOwnerMembershipHistory } from "../../../../api/Owner/ownerPackage";
import { Table, TableProps, Tag } from "antd";
import { NumberFormat } from "../../../../Utils/numberFormat";
import { DateFormat } from "../../../../Utils/dateFormat";
import { months } from "moment";

const PackageRegisterHistory: React.FC = () => {
    const [membershipDetailData, setMembershipDetailData] = useState<RegisterPackage[]>();
    // const [infoData, setInfoData] = useState<MemberShipInformation>();
    // const [idnumber, setID] = useState<number>();
    const { userId, token } = useContext(UserContext);

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

    const fetchMembershipHistory = async () => {
        try {
            if (token != undefined && userId != undefined) {
                let data: RegisterPackage[] | undefined;
                data = await getOwnerMembershipHistory(token);
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
            title: "Package ",
            dataIndex: "membershipName",
            width: "15%",
        },
        {
            title: "Package Capacity",
            dataIndex: "capacityHostel",
            width: "10%",
        },
        {
            title: "Package Duration",
            dataIndex: "month",
            width: "10%",
            render: (month: number) => {
                let unit = "months";
                if (month === 1) {
                    unit = "month"
                }
                const display = month + " " + unit;
                return (
                    display
                )
            }
        },
        {
            title: "You Paid",
            dataIndex: "packageFee",
            width: "15%",
            render: (packageFee: number) => {
                return (
                    NumberFormat(packageFee)
                )
            }
        },
        {
            title: "Date Register",
            dataIndex: "dateRegister",
            width: "15%",
            render: (dateRegister: Date) => {
                return (
                    DateFormat(dateRegister)
                )
            },
        },
        {
            title: "Date Expire",
            dataIndex: "dateExpire",
            width: "15%",
            render: (dateExpire: Date) => {
                return (
                    DateFormat(dateExpire)
                )
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10%",
            render: (status: number) => {
                const statusString = statusStringMap[status];
                const statusColor = statusColorMap[status];
                if (statusString && statusColor) {
                    return (
                        <Tag
                            color={statusColor}
                            key={statusString}
                        >
                            {statusString}
                        </Tag>
                    );
                } else {
                    // Handle cases where status is not found in maps
                    return <span>Unknown Status ({status})</span>;
                }
            },
        },
    ];

    return (
        <>
            <div style={{ padding: '24px' }}>
                <Table columns={memberpackageHistory} dataSource={membershipDetailData} bordered />
            </div>
        </>
    );
};


export default PackageRegisterHistory;
