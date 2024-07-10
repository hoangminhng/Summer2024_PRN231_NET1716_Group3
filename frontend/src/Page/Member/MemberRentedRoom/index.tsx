import { Card, Button, Col, Row, Pagination, Tag } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { NumberFormat } from "../../../Utils/numberFormat";
import { MemberRoomRented } from "../../../interface/Rooms/MemberRoomRented";
import { getMemberRentedRoom } from "../../../api/Member/memberRooms";
import moment from 'moment'
import CreateComplainModal from "../../../Component/User/CreateComplainModal";

const MemberRentedRoom: React.FC = () => {
    const { token, userId } = useContext(UserContext);
    const [rentedRoomsData, setRentedRoomsData] = useState<MemberRoomRented[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<MemberRoomRented | undefined>(undefined);
    const navigate = useNavigate();

    const itemsPerPage = 3;

    const fetchRoomList = async () => {
        try {
            if (token != undefined) {
                let data: MemberRoomRented[] | undefined;
                data = await getMemberRentedRoom(token);
                setRentedRoomsData(data || []);
            }
        } catch (error) {
            console.error("Error fetching contract list:", error);
        }
    };

    useEffect(() => {
        fetchRoomList();
    }, []);

    const statusStringMap: { [key: number]: string } = {
        1: "CURRENT",
        2: "EXPIRED",
        3: "EXTENDED"
    };

    const statusColorMap: { [key: number]: string } = {
        1: "green",
        2: "red",
        4: "orange"
    };

    const paginatedData = rentedRoomsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openModal = (room: MemberRoomRented) => {
        setSelectedRoom(room);
        setIsModalOpen(!isModalOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            // If the click occurs on the overlay (not on the modal content), close the modal
            toggleModal();
        }
    };

    const handleDetailClick = (contractID: string) => {
        navigate(`/rentedRoomsDetail/${contractID}`);
      };


    return (
        <div>
            <div
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
                <h2>RENTED ROOM LIST</h2>
            </div>
            <Row gutter={16}>
                {paginatedData.map((roomItem, index) => (
                    <Col span={23} key={index}>
                        <Card
                            extra={

                                <div>
                                    <Button
                                        className="mx-2"
                                        type="primary"
                                        onClick={() => openModal(roomItem)}
                                    >
                                        Create Complain
                                    </Button>
                                    {isModalOpen && (
                                        <div
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            onMouseDown={handleOverlayClick}
                                            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
                                        // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                                        >
                                            <CreateComplainModal room={selectedRoom} />
                                        </div>
                                    )}
                                    <Button
                                        className="mx-2"
                                        type="primary"
                                        onClick={() => handleDetailClick(roomItem.contractId.toString())}
                                    >
                                        View detail
                                    </Button>
                                </div>
                            }
                            style={{
                                width: "100%",
                                marginBottom: "20px",
                                marginLeft: "10px",
                            }}
                        >
                            <Row justify="space-evenly">
                                <Col span={4}>
                                    <img
                                        className="h-auto w-full rounded-lg shadow-md"
                                        src={roomItem?.roomThumbnail}
                                        alt={roomItem?.roomName || "Room thumbnail"}
                                    />
                                </Col>
                                <Col span={4}>
                                    <p>
                                        Hostel : <span>{roomItem.hostelName}</span>
                                    </p>{" "}
                                    <br />
                                    <p>
                                        Room : <span>{roomItem.roomName}</span>
                                    </p>
                                    <br />
                                    <p>
                                        Owner name: <span>{roomItem.ownerName}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        Date Start :{" "}
                                        <span>{moment(roomItem.dateStart).format("DD-MM-YYYY")}</span>
                                    </p>
                                    <br />
                                    <p>
                                        Date End : <span>{moment(roomItem.dateEnd).format("DD-MM-YYYY")}</span>
                                    </p>
                                    <br />
                                    <p>
                                        Room fee: <span>{NumberFormat(roomItem.roomFee)}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <div style={{ padding: "20px" }}>
                                        <Tag
                                            color={statusColorMap[roomItem.status]}
                                            key={roomItem.status}
                                        >
                                            {statusStringMap[roomItem.status].toUpperCase()}
                                        </Tag>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination
                current={currentPage}
                total={rentedRoomsData.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                style={{ textAlign: "center", marginTop: "20px" }}
            />

        </div >

    );
};
export default MemberRentedRoom;
