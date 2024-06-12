import {Card, Button, Col, Row, Pagination, Tag} from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { DateFormat } from "../../../Utils/dateFormat";
import { getOwnerContract } from "../../../api/Owner/ownerContract";

const OwnerViewContract : React.FC = () =>{

    const navigate = useNavigate();
    const { token , userId } = useContext(UserContext);
    const [contractData, setContractData] = useState<ViewContract[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const fetchContractList = async () => {
        try {
            if(token != undefined && userId != undefined){
                let data : ViewContract[] | undefined
                data = await getOwnerContract(userId, token);
                setContractData(data || []);
            }
        } catch (error) {
          console.error("Error fetching contract list:", error);
        }
      };

    useEffect(() => {
        fetchContractList()
    }, []);

    const statusStringMap: { [key: number]: string } = {
        0 : "SIGNED",
        1 : "NOT SIGN",
      };
    
    const statusColorMap: { [key: number]: string } = {
        0: "green",
        1: "red",
    };

    const paginatedData = contractData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        };

    return (
            <div>
                <div style={{width: "100%", textAlign: "center", fontSize: "20", fontWeight:"bold", backgroundColor:"aliceblue", padding:"20px", marginBottom: "20px"}}>
                <h2>CONTRACT LIST</h2>
            </div>
            <Row gutter={16}>
                {paginatedData.map((contractItem, index) => (
                    <Col span={24} key={index}>
                        <Card
                            extra={<div>
                                <Button type="primary">Print contract</Button> <Button type="primary" onClick={() => navigate(`/owner/contracts/detail/${contractItem.contractID}`)}>View detail</Button>
                                </div>}
                            style={{
                            width: "100%",
                            }}
                        >
                            <Row justify="space-between">
                                <Col span={4}>
                                    <p>Hostel : <span>{contractItem.hostelName}</span></p> <br />
                                    <p>Room : <span>{contractItem.roomName}</span></p>
                                </Col>
                                <Col span={4}>
                                    <p>Date Create : <span>{DateFormat(contractItem.createdDate)}</span></p> <br />
                                    <p>Date Sign : <span>{DateFormat(contractItem.dateSign)}</span></p>
                                </Col>
                                <Col span={4}>
                                    <div style={{paddingTop: "20px"}}>
                                        <p>Student Sign : <span>{contractItem.studentLeadAccountName}</span></p>
                                    </div>
                                </Col>
                                <Col span={4}>
                                <div style={{padding: "20px"}}>                              
                                    <Tag color={statusColorMap[contractItem.status]} key={contractItem.status}>
                                        {statusStringMap[contractItem.status].toUpperCase()}
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
                    total={contractData.length}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    style={{ textAlign: "center", marginTop: "20px" }}
                />
        </div>
    );
}
export default OwnerViewContract;