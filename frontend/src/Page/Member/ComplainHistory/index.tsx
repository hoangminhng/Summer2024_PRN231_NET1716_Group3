import { Card, Button, Col, Row, Pagination, Tag, Table, TableProps } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { NumberFormat } from "../../../Utils/numberFormat";
import { MemberRoomRented } from "../../../interface/Rooms/MemberRoomRented";
import { getMemberRentedRoom } from "../../../api/Member/memberRooms";
import moment from 'moment'
import CreateComplainModal from "../../../Component/User/CreateComplainModal";
import { Complain } from "../../../interface/Complains/Complain";
import { Odata } from "../../../interface/Odata";
import { getMemberComplains } from "../../../api/Member/memberComplain";

const ComplainHistory: React.FC = () => {
    const { token, userId } = useContext(UserContext);
    const [complainData, setComplainData] = useState<Odata<Complain>>();
    const [currentPage, setCurrentPage] = useState(1);

    const fetchComplainList = async () => {
        try {
            if (token != undefined) {
                let data: Odata<Complain> | undefined;
                data = await getMemberComplains(token, userId);
                console.log({ ...data?.value });
                setComplainData(data || undefined);
            }
        } catch (error) {
            console.error("Error fetching contract list:", error);
        }
    };

    useEffect(() => {
        fetchComplainList();
    }, []);

    const statusStringMap: { [key: number]: string } = {
        1: "PROCESSING",
        2: "DONE",
    };

    const statusColorMap: { [key: number]: string } = {
        1: "orange",
        2: "green",
    };


    const memberComplainHistory: TableProps<Complain>["columns"] = [
        {
            title: "No",
            width: "2%",
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: "Room",
            dataIndex: "RoomName",
            width: "10%",
        },
        {
            title: "Hostel",
            dataIndex: "HostelName",
            width: "10%",
        },
        {
            title: "Owner Name",
            dataIndex: "OwnerName",
            width: "10%",
        },
        {
            title: "Complain",
            dataIndex: "ComplainText",
            width: "10%",
            render: (text: string) => (
                <span dangerouslySetInnerHTML={{ __html: text }} />
            ),
        },
        {
            title: "Date Created",
            dataIndex: "DateComplain",
            width: "20%",
            render: (dateComplain: Date) => {
                return (
                    moment(dateComplain).format("DD-MM-YYYY HH:mm:ss")
                )
            }
        },
        {
            title: "Response",
            dataIndex: "ComplainResponse",
            width: "20%",
            render: (text: string | null) => ( // Allow null type for dataIndex
                text ? (
                    <span dangerouslySetInnerHTML={{ __html: text }} /> // Use dangerouslySetInnerHTML (with caution)
                ) : (
                    <span>___</span>
                )
            )
        },

        {
            title: "Date Response",
            dataIndex: "DateUpdate",
            width: "10%",
            render: (dateUpdate: Date) => {
                let display = "";
                if (dateUpdate === undefined || dateUpdate === null) {
                    display = "___"
                } else
                    display = moment(dateUpdate).format("DD-MM-YYYY: HH:mm:ss")
                return (
                    display
                )
            }
        },
        {
            title: "Status",
            dataIndex: "Status",
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
        <> <div
            style={{
                width: "100%",
                textAlign: "center",
                fontSize: "20",
                fontWeight: "bold",
                backgroundColor: "aliceblue",
                padding: "20px",
                marginBottom: "20px",
            }}
        >
            <h2>Complain History</h2>
        </div>
            <div style={{ padding: '24px' }}>
                <Table columns={memberComplainHistory}
                    dataSource={complainData?.value}
                    bordered
                    pagination={{ pageSize: 8 }}
                />
            </div>

        </>
    );
};
export default ComplainHistory;
