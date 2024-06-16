import { useState, useEffect, useContext } from "react";
import { Button, notification, Form, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getOldPassword, getOwnerProfleDetail, updateOwnerPassword } from "../../../api/Owner/ownerProfile";

const OwnerChangePassword : React.FC = () => {
    const [profileData, setProfileData] = useState<AccountDetail>();
    const { token, userId } = useContext(UserContext);
    const [errorContent, setErrorContent] = useState<any>();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const fetchProfile = async () => {
        try {
            if (token && userId) {
                const data = await getOwnerProfleDetail(userId, token);
                if (data) {
                    setProfileData(data);
                    form.setFieldsValue(data); // Set form values here
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchUpdatePassword = async (account: AccountPassword) => {
        try {
            if (token != undefined) {
                let data = await updateOwnerPassword(account, token);
                return data;
            }
        } catch (error: any) {
            setErrorContent(error.message);
            throw error;
        }
    };

    const fetchGetOldPassword = async (account: AccountPassword) => {
        try {
            if (token != undefined) {
                let data = await getOldPassword(account, token);
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
        navigate("/owner/profile");
    };

    const updatePassword = async (value: any) => {
        let accountOld: AccountPassword = {
            accountID: userId ? userId : 0,
            password: value.old_password
        };
        let accountNew: AccountPassword = {
            accountID: userId ? userId : 0,
            password: value.new_password
        };
        try{
            const response = await fetchGetOldPassword(accountOld);
            if (response != undefined && !errorContent) {
                if(value.old_password == value.new_password){
                    openNotificationWithIcon("error", "New password is not the same with old password!");
                }else{
                    if(value.new_password != value.confirm_password){
                        openNotificationWithIcon("error", "Confirm password is not the same with new password!");
                    }
                    else{
                        try{
                            const responseUpdate = await fetchUpdatePassword(accountNew);
                            if (responseUpdate != undefined && !errorContent) {
                                openNotificationWithIcon("success", "Change password successfully!");
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1500);
                            }
                        }catch(error : any){
                            openNotificationWithIcon("error", error.message || "Have some error when execute!");
                            setErrorContent("");
                        }
                    }
                }
            }
        }catch(error: any){
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
                <p style={{textAlign:"center", fontSize:"24px", fontWeight:"bold"}}>CHANGE  PASSWORD</p>
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
                            onFinish={updatePassword}
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
                                label="Old Password"
                                name="old_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your old password!',
                                    },
                                ]}
                            >
                                <Input type="password"/>
                            </Form.Item>

                            <Form.Item
                                label="New password"
                                name="new_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                ]}
                            >
                                <Input type="password"/>
                            </Form.Item>

                            <Form.Item
                                label="Confirm password"
                                name="confirm_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input confirm password!',
                                    },
                                ]}
                            >
                                <Input type="password"/>
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
                                        Update Password
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

export default OwnerChangePassword;
