import { useState, useEffect, useContext } from "react";
import { Button, notification, Form, Input, InputNumber } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getMemberProfle, updateMemberProfile } from "../../../api/Owner/ownerProfile";

const MemberChangeProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<AccountDetail>();
    const { token, userId } = useContext(UserContext);
    const [errorContent, setErrorContent] = useState<any>("");
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const fetchProfile = async () => {
        try {
            if (token && userId) {
                const data = await getMemberProfle(userId, token);
                if (data) {
                    setProfileData(data);
                    form.setFieldsValue(data); // Set form values here
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchUpdateInformation = async (account: AccountUpdate) => {
        try {
            if (token != undefined) {
                let data = await updateMemberProfile(account, token);
                return data;
            }
        } catch (error: any) {
            setErrorContent(error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId, token]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleBackToList = () => {
        navigate(-1);
    };

    const updateInformation = async (value: any) => {
        let account: AccountUpdate = {
            accountID: userId ? userId : 0,
            address: value.address,
            citizenCard: value.citizenCard.toString(),
            email: value.email,
            name: value.name,
            phone: value.phone.toString()
        };
        try {
            const response = await fetchUpdateInformation(account);
            if (response != undefined && !errorContent) {
                openNotificationWithIcon("success", "Update information successfully!");
            }
        } catch (error: any) {
            openNotificationWithIcon("error", error.message || "Have some error when execute!");
            setErrorContent("");
        }
        await fetchProfile();
    };

    const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
        notification[type]({
            message: "Notification Title",
            description: description,
        });
    };

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                        <Button onClick={handleBackToList}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
                        </Button>
                    </div>
                </div>
                <p style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>CHANGE  PROFILE</p>
                <br />
                <br />
                <br />
                <div className="max-w-full rounded overflow-hidden shadow-lg m-5">
                    <div className="px-6 py-4 ">
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 900,
                            }}
                            initialValues={profileData} // Initial values set here
                            onFinish={updateInformation}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Citizen Card"
                                name="citizenCard"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your citizen card!',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && value.toString().length === 12
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Citizen card must be exactly 12 digits!')),
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your phone!',
                                    },
                                    {
                                        validator: (_, value) =>
                                            value && value.toString().length === 10
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Phone number must be exactly 10 digits!')),
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your address!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded-full mr-10"
                                    >
                                        Update Information
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberChangeProfile;
