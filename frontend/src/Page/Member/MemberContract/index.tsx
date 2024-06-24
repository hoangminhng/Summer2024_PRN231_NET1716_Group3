import { Card, Button, Col, Row, Pagination, Tag } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { DateFormat } from "../../../Utils/dateFormat";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { NumberFormat } from "../../../Utils/numberFormat";
import {
  getContractDetail,
  getMemberContract,
} from "../../../api/Member/memberContract";
import { payDeposit } from "../../../api/payment";

const MemberViewContract: React.FC = () => {
  const navigate = useNavigate();
  const { token, userId } = useContext(UserContext);
  const [contractData, setContractData] = useState<MemberViewContract[]>([]);
  const [contactDetailData, setContractDetailData] = useState<ContractDetail>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const formatDate = (date: Date) => {
    if (!date) return null;
    const parsedDate = new Date(date);
    return parsedDate;
  };

  const splitHtmlIntoParagraphs = (html: any) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const paragraphs = div.querySelectorAll("p");
    return Array.from(paragraphs).map((p) => p.textContent ?? "");
  };
  const contractTermParagraphs = splitHtmlIntoParagraphs(
    contactDetailData?.contractTerm ?? "<p>......</p>"
  );
  const contractTermDocxParagraphs = contractTermParagraphs.map(
    (text) =>
      new Paragraph({
        children: [
          new TextRun({
            text,
            break: 1,
          }),
        ],
      })
  );

  const createdDate = formatDate(contactDetailData?.createdDate || new Date());
  const dateStart = formatDate(contactDetailData?.dateStart || new Date());
  const dateEnd = formatDate(contactDetailData?.dateEnd || new Date());

  const fetchContractList = async () => {
    try {
      if (token != undefined && userId != undefined) {
        let data: MemberViewContract[] | undefined;
        data = await getMemberContract(userId, token);
        setContractData(data || []);
      }
    } catch (error) {
      console.error("Error fetching contract list:", error);
    }
  };
  const fetchContractDetail = async (contractID: number) => {
    try {
      if (token) {
        const data = await getContractDetail(contractID, token);
        if (data) {
          setContractDetailData(data);
        }
      }
    } catch (error) {
      console.error("Error fetching contract detail:", error);
    }
  };

  useEffect(() => {
    fetchContractList();
  }, []);

  const statusStringMap: { [key: number]: string } = {
    1: "SIGNED",
    0: "NOT SIGN",
  };

  const statusColorMap: { [key: number]: string } = {
    1: "green",
    0: "red",
  };

  const paginatedData = contractData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSignContract = (contractID: number) => {
    try {
      const fetchPaymentUrl = async () => {
        if (userId && token) {
          const response = await payDeposit(contractID, token);
          if (response) {
            window.location.href = response?.paymentUrl;
          }
        }
      };
      fetchPaymentUrl();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDownload = async (value: number) => {
    await fetchContractDetail(value);
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"),
                new TextRun({
                  text: "Độc lập - Tự do - Hạnh phúc",
                  break: 2,
                }),
                new TextRun({
                  text: "HỢP ĐỒNG THUÊ PHÒNG",
                  break: 2,
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun(
                  `Hôm nay, ngày ${
                    createdDate?.getDate().toString() || "......"
                  } tháng ${
                    createdDate?.getMonth().toString() || "......"
                  } năm ${
                    createdDate?.getFullYear().toString() || "......"
                  } tại địa chỉ ${
                    contactDetailData?.hostelAddress || "......"
                  }.`
                ),
                new TextRun({
                  text: "Chúng tôi gồm :",
                  break: 2,
                  bold: true,
                }),
                new TextRun({
                  text: "1. Bên cho thuê phòng (Bên A):",
                  break: 2,
                  bold: true,
                }),
                new TextRun({
                  text: `Ông/bà : ${
                    contactDetailData?.ownerAccountName.toUpperCase() ||
                    "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: `Căn cước công dân : ${
                    contactDetailData?.ownerCitizen || "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: `Số điện thoại : ${
                    contactDetailData?.ownerPhone || "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: "2. Bên thuê phòng (Bên B):",
                  break: 2,
                  bold: true,
                }),
                new TextRun({
                  text: `Ông/bà : ${
                    contactDetailData?.studentLeadAccountName.toUpperCase() ||
                    "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: `Căn cước công dân : ${
                    contactDetailData?.studentLeadCitizen || "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: `Số điện thoại : ${
                    contactDetailData?.studentLeadPhone || "......"
                  }`,
                  break: 1,
                }),
                new TextRun({
                  text: "Chúng tôi tự nguyện thỏa thuận, cam kết và chịu trách nhiệm trước pháp Luật về các điều khoản sau đây:",
                  break: 2,
                  bold: true,
                }),
                new TextRun({
                  text: `Bên A đồng ý cho bên B thuê phòng ${
                    contactDetailData?.roomName || "......"
                  } tại địa chỉ ${
                    contactDetailData?.hostelAddress || "......"
                  }.`,
                  break: 2,
                }),
                new TextRun({
                  text: "Điều 1. GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN",
                  break: 2,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: `- Giá thuê phòng 1 tháng : ${NumberFormat(
                    contactDetailData?.roomFee || 0
                  )}`,
                  break: 2,
                }),
                new TextRun({
                  text: `- Bên B phải đặt cọc cho Bên A với số tiền là : ${NumberFormat(
                    contactDetailData?.depositFee || 0
                  )}`,
                  break: 3,
                }),
                new TextRun({
                  text : `- Số nước hiện tại khi bắt đầu thuê phòng : ${contactDetailData?.initWaterNumber || 0} m³`,
                  break: 3,
              }),
              new TextRun({
                  text : `- Số điện hiện tại khi bắt đầu thuê phòng : ${contactDetailData?.initElectricityNumber || 0} kWh`,
                  break: 3,
              }),
              ],
            }),
            ...(contactDetailData?.roomServiceDetails || []).map(
              (service) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `- ${service.typeServiceName} : ${NumberFormat(
                        service.servicePrice
                      )} (${service.serviceName})`,
                      break: 2,
                    }),
                  ],
                })
            ),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Điều 2. THỜI GIAN HỢP ĐỒNG",
                  break: 2,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: `Thời gian hợp đồng : Kể từ ngày ${
                    dateStart?.getDate().toString() || "......"
                  } tháng ${dateStart?.getMonth().toString() || "......"} năm ${
                    dateStart?.getFullYear().toString() || "......"
                  } đến hết ngày ${
                    dateEnd?.getDate().toString() || "......"
                  } tháng ${dateEnd?.getMonth().toString() || "......"} năm ${
                    dateEnd?.getFullYear().toString() || "......"
                  }`,
                  break: 2,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Điều 3. CÁC THÔNG TIN VỀ PHÒNG",
                  break: 2,
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: `${contactDetailData?.roomDescription || "......"}`,
                  break: 3,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Điều 3. ĐIỀU KHOẢN HỢP ĐỒNG",
                  break: 2,
                  bold: true,
                  size: 24,
                }),
                ...contractTermDocxParagraphs,
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Hợp đồng này được thành lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản, hợp đồng này có hiệu lực kể từ ngày ký.",
                  break: 2,
                  bold: true,
                }),
                new TextRun({
                  text: `\t\t\t\t\t\tHôm nay, ngày ${
                    createdDate?.getDate().toString() || "......"
                  } tháng ${
                    createdDate?.getMonth().toString() || "......"
                  } năm ${createdDate?.getFullYear().toString() || "......"}`,
                  break: 2,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Bên A:\t\t\t\t\t\t\t\t\t",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: "Bên B:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${
                    contactDetailData?.ownerAccountName || "......"
                  }\t\t\t\t\t\t\t\t\t`,
                }),
                new TextRun({
                  text:
                    contactDetailData?.status === 0
                      ? contactDetailData?.studentLeadAccountName
                      : "........",
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `${contactDetailData?.hostelName || "......"}_${
          contactDetailData?.roomName || "......"
        }.docx`
      );
    });
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
        <h2>CONTRACT LIST</h2>
      </div>
      <Row gutter={16}>
        {paginatedData.map((contractItem, index) => (
          <Col span={23} key={index}>
            <Card
              extra={
                <div>
                  <Button
                    type="primary"
                    onClick={() => handleDownload(contractItem.contractID)}
                  >
                    Print contract
                  </Button>
                  <Button
                    className="mx-2"
                    type="primary"
                    onClick={() =>
                      navigate(
                        `/contracts/detail/${contractItem.contractID}`
                      )
                    }
                  >
                    View detail
                  </Button>
                  {contractItem.status === 0 && (
                    <Button
                      type="primary"
                      onClick={() =>
                        handleSignContract(contractItem.contractID)
                      }
                    >
                      Sign contract
                    </Button>
                  )}
                </div>
              }
              style={{
                width: "100%",
                marginBottom: "20px",
                marginLeft: "10px",
              }}
            >
              <Row justify="space-between">
                <Col span={6}>
                  <p>
                    Hostel : <span>{contractItem.hostelName}</span>
                  </p>{" "}
                  <br />
                  <p>
                    Room : <span>{contractItem.roomName}</span>
                  </p>
                </Col>
                <Col span={6}>
                  <p>
                    Date Create :{" "}
                    <span>{DateFormat(contractItem.dateStart)}</span>
                  </p>
                  <p>
                    Date End : <span>{DateFormat(contractItem.dateEnd)}</span>
                  </p>
                  <p>
                    Date Sign :{" "}
                    <span>
                      {contractItem.dateSign
                        ? DateFormat(contractItem.dateSign)
                        : " "}
                    </span>
                  </p>
                </Col>
                <Col span={6}>
                  <div style={{ paddingTop: "20px" }}>
                    <p>
                      Student Sign :{" "}
                      <span>{contractItem.ownerAccountName}</span>
                    </p>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ padding: "20px" }}>
                    <Tag
                      color={statusColorMap[contractItem.status]}
                      key={contractItem.status}
                    >
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
};
export default MemberViewContract;
