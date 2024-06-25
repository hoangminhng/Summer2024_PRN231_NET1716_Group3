import { useState, useEffect, useContext } from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getContractDetail } from "../../../api/Member/memberContract";
import { NumberFormat } from "../../../Utils/numberFormat";
import { Document, Packer, Paragraph, TextRun} from "docx";
import { saveAs } from "file-saver";

const MemberContractDetail = () => {
    const [contactDetailData, setContractDetailData] = useState<ContractDetail>();
    const { contractID } = useParams<{ contractID: string }>();
    const [idnumber, setID] = useState<number>();
    const navigate = useNavigate();
    const { token } = useContext(UserContext);

    const formatDate = (date : Date) => {
        if (!date) return null;
        const parsedDate = new Date(date);
        return parsedDate;
    };

    const splitHtmlIntoParagraphs = (html : any) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        const paragraphs = div.querySelectorAll("p");
        return Array.from(paragraphs).map(p => p.textContent ?? "");
    };
    const contractTermParagraphs = splitHtmlIntoParagraphs(contactDetailData?.contractTerm ?? "<p>......</p>");
    const contractTermDocxParagraphs = contractTermParagraphs.map(text => 
        new Paragraph({
            children: [
                new TextRun({
                    text,
                    break: 1,
                }),
            ],
        })
    );

    const createdDate = formatDate(contactDetailData?.createdDate || new Date);
    const dateStart = formatDate(contactDetailData?.dateStart|| new Date);
    const dateEnd = formatDate(contactDetailData?.dateEnd|| new Date);


    const fetchContractDetail = async () => {
        try {
            if (token && contractID) {
                const data = await getContractDetail(parseInt(contractID), token);
                if (data) {
                    setID(parseInt(contractID));
                    setContractDetailData(data);
                }
            }
        } catch (error) {
            console.error("Error fetching contract detail:", error);
        }
    };

    useEffect(() => {
        fetchContractDetail();
    }, [idnumber, token]);

    const handleBackToList = () => {
        navigate(-1);
    };

    const handleDownload = () => {
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
                            `Hôm nay, ngày ${createdDate?.getDate().toString() || "......"} tháng ${
                                createdDate?.getMonth().toString() || "......"
                            } năm ${
                                createdDate?.getFullYear().toString() || "......"
                            } tại địa chỉ ${contactDetailData?.hostelAddress || "......"}.`
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
                            text: `Ông/bà : ${contactDetailData?.ownerAccountName.toUpperCase() || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: `Căn cước công dân : ${contactDetailData?.ownerCitizen || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: `Số điện thoại : ${contactDetailData?.ownerPhone || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: "2. Bên thuê phòng (Bên B):",
                            break: 2,
                            bold: true,
                        }),
                        new TextRun({
                            text: `Ông/bà : ${contactDetailData?.studentLeadAccountName.toUpperCase() || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: `Căn cước công dân : ${contactDetailData?.studentLeadCitizen || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: `Số điện thoại : ${contactDetailData?.studentLeadPhone || "......"}`,
                            break: 1,
                        }),
                        new TextRun({
                            text: "Chúng tôi tự nguyện thỏa thuận, cam kết và chịu trách nhiệm trước pháp Luật về các điều khoản sau đây:",
                            break: 2,
                            bold: true,
                        }),
                        new TextRun({
                            text: `Bên A đồng ý cho bên B thuê phòng ${contactDetailData?.roomName || "......"} tại địa chỉ ${contactDetailData?.hostelAddress || "......"}.`,
                            break: 2,
                        }),
                        new TextRun({
                            text: "Điều 1. GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN",
                            break: 2,
                            bold: true,
                            size: 24,
                        }),
                        new TextRun({
                            text : `- Giá thuê phòng 1 tháng : ${NumberFormat(
                                contactDetailData?.roomFee || 0
                            )}`,
                            break: 2,
                        }),
                        new TextRun({
                            text : `- Bên B phải đặt cọc cho Bên A với số tiền là : ${NumberFormat(
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
                ...((contactDetailData?.roomServiceDetails || []).map((service) =>
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `- ${service.typeServiceName} : ${NumberFormat(service.servicePrice)} (${service.serviceName})`,
                                break: 2,
                            }),
                        ],
                    })
                )),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Điều 2. THỜI GIAN HỢP ĐỒNG",
                            break: 2,
                            bold: true,
                            size: 24,
                        }),
                        new TextRun({
                            text : `Thời gian hợp đồng : Kể từ ngày ${
                                dateStart?.getDate().toString() || "......"
                            } tháng ${
                                dateStart?.getMonth().toString() || "......"
                            } năm ${
                                dateStart?.getFullYear().toString() || "......"
                            } đến hết ngày ${
                                dateEnd?.getDate().toString() || "......"
                            } tháng ${
                                dateEnd?.getMonth().toString() || "......"
                            } năm ${dateEnd?.getFullYear().toString() || "......"}`,
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
                        new TextRun({text : `${contactDetailData?.roomDescription || "......"}`, break: 3}),
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
                            text: `\t\t\t\t\t\tHôm nay, ngày ${createdDate?.getDate().toString() || "......"} tháng ${
                                createdDate?.getMonth().toString() || "......"
                            } năm ${
                                createdDate?.getFullYear().toString() || "......"
                            }`,
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
                            text: `${contactDetailData?.ownerAccountName || "......"}\t\t\t\t\t\t\t\t\t`,
                        }),
                        new TextRun({
                            text: contactDetailData?.status === 0 ? contactDetailData?.studentLeadAccountName : "........",
                        }),
                    ],
                }),
            ],
        },
    ],
});

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${contactDetailData?.hostelName || "......"}_${contactDetailData?.roomName || "......"}.docx`);
        });
    };

    return (
        <>
            <div style={{ textAlign: "left" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                    }}
                >
                    <Button onClick={handleBackToList}>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ color: "#74C0FC" }}
                        />
                    </Button>
                    <Button onClick={handleDownload}>Print Contract</Button>
                </div>
                <br />
                <br />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <div>
                        <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </p>
                        <p style={{ fontSize: "20px" }}>
                            Độc lập - Tự do - Hạnh phúc
                        </p>
                        <br />
                        <p style={{ fontSize: "30px", fontWeight: "bold" }}>
                            HỢP ĐỒNG THUÊ PHÒNG
                        </p>
                    </div>
                </div>
                <div style={{padding: "30px"}}>
                    <p>
                        Hôm nay, ngày{" "}
                        {createdDate?.getDate().toString() || "......"} tháng{" "}
                        {createdDate?.getMonth().toString() || "......"} năm{" "}
                        {createdDate?.getFullYear().toString() || "......"} tại địa
                        chỉ {contactDetailData?.hostelAddress || "......"}.
                    </p>
                    <br />
                    <p style={{ fontWeight: "bold" }}>Chúng tôi gồm :</p>
                    <p style={{ fontWeight: "bold" }}>
                        1. Bên cho thuê phòng (Bên A):
                    </p>
                    <p>
                        Ông/bà :{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {contactDetailData?.ownerAccountName.toUpperCase() || "......"}
                        </span>
                    </p>
                    <p>
                        Căn cước công dân :{" "}
                        <span>{contactDetailData?.ownerCitizen || "......"}</span>
                    </p>
                    <p>
                        Số điện thoại :{" "}
                        <span>{contactDetailData?.ownerPhone || "......"}</span>
                    </p>
                    <br />

                    <p style={{ fontWeight: "bold" }}>
                        2. Bên thuê phòng (Bên B):
                    </p>
                    <p>
                        Ông/bà :{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {contactDetailData?.studentLeadAccountName.toUpperCase() || "......"}
                        </span>
                    </p>
                    <p>
                        Căn cước công dân :{" "}
                        <span>{contactDetailData?.studentLeadCitizen || "......"}</span>
                    </p>
                    <p>
                        Số điện thoại :{" "}
                        <span>{contactDetailData?.studentLeadPhone || "......"}</span>
                    </p>
                    <br />
                    <br />

                    <p style={{ fontWeight: "bold" }}>
                        Chúng tôi tự nguyện thỏa thuận, cam kết và chịu trách
                        nhiệm trước pháp Luật về các điều khoản sau đây:
                    </p>
                    <p>
                        Bên A đồng ý cho bên B thuê phòng{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {contactDetailData?.roomName || "......"}
                        </span>{" "}
                        tại địa chỉ {contactDetailData?.hostelAddress || "......"}.
                    </p>
                    <br />

                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Điều 1. GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
                    </p>
                    <p>
                        - Giá thuê phòng 1 tháng :{" "}
                        {NumberFormat(contactDetailData?.roomFee || 0)}
                    </p>
                    <p>
                        -Bên B phải đặt cọc cho Bên A với số tiền là :{" "}
                        {NumberFormat(contactDetailData?.depositFee || 0)}
                    </p>
                    <p>
                        - Số nước hiện tại khi bắt đầu thuê phòng :{" "}
                        {contactDetailData?.initWaterNumber || 0} {" "} m³
                    </p>
                    <p>
                        - Số điện hiện tại khi bắt đầu thuê phòng :{" "}
                        {contactDetailData?.initElectricityNumber || 0}{" "} kWh
                    </p>

                    <div>
                        {...(contactDetailData?.roomServiceDetails || []).map((service) => (
                            <div key={service.roomServiceId}>
                                <p style={{ fontWeight: "bold" }}>
                                   - {service.typeServiceName} :{" "}
                                    {NumberFormat(service.servicePrice)} (
                                    {service.serviceName})
                                </p>
                            </div>
                        ))}
                    </div>
                    <br />

                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Điều 2. THỜI GIAN HỢP ĐỒNG
                    </p>
                    <p>
                        Thời gian hợp đồng : Kể từ ngày{" "}
                        {dateStart?.getDate().toString() || "......"} tháng{" "}
                        {dateStart?.getMonth().toString() || "......"} năm{" "}
                        {dateStart?.getFullYear().toString() || "......"} đến hết
                        ngày {dateEnd?.getDate().toString() || "......"} tháng{" "}
                        {dateEnd?.getMonth().toString() || "......"} năm{" "}
                        {dateEnd?.getFullYear().toString() || "......"}
                    </p>
                    <br />

                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Điều 3. CÁC THÔNG TIN VỀ PHÒNG
                    </p>
                    {contactDetailData?.roomDescription || "......"} <br />

                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Điều 4. ĐIỀU KHOẢN HỢP ĐỒNG
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: contactDetailData?.contractTerm || "......" }} /> <br />

                    <p style={{ fontWeight: "bold" }}>
                        Hợp đồng này được thành lập thành 02 bản có giá trị
                        pháp lý như nhau, mỗi bên giữ 01 bản, hợp đồng này có
                        hiệu lực kể từ ngày ký.
                    </p>
                    <br />
                    <br />

                    <div style={{ display: "flex", justifyContent: "right" }}>
                        <p>
                            Hôm nay, ngày{" "}
                            {createdDate?.getDate().toString() || "......"} tháng{" "}
                            {createdDate?.getMonth().toString() || "......"} năm{" "}
                            {createdDate?.getFullYear().toString() || "......"}
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                                Bên A
                            </p>
                            <p>{contactDetailData?.ownerAccountName || "......"}</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                                Bên B
                            </p>
                            <p>
                                {contactDetailData?.status === 0
                                    ? contactDetailData?.studentLeadAccountName
                                    : "......"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberContractDetail;
