import { GetProp, Input } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import { resendRegisterOtp, confirmRegisterOtp } from "../../api/register";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface ConfirmOtpModalProps {
    email: string; // Prop to receive the email address
}

const ConfirmOtpModal: React.FC<ConfirmOtpModalProps> = ({ email }) => {
    const navigate = useNavigate();
    const [otpToken, setOtp] = useState<string>("");
    const onChange: GetProp<typeof Input.OTP, 'onChange'> = (otp) => {
        setOtp(otp);
    };
    const handleSubmit = () => {
        if (otpToken.length !== 6) return;

        const confirmOtp = async () => {
            const response = await confirmRegisterOtp(email, otpToken);
            toast.success("Account create successfully", { duration: 2000 });
            navigate("/");
        };
        confirmOtp();
    }

    const onResend = (event: any) => {
        event.preventDefault();
        const resendOtp = async () => {
            await resendRegisterOtp(email);
        }
        resendOtp();
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    return (
        <>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
                            Confirm OTP
                        </h3>
                    </div>
                    <h5>Please check your email for the OTP</h5>

                    <div className='py-5'>
                        <Input.OTP variant="filled" length={6} {...sharedProps} />
                    </div>

                    <button
                        type="button"
                        className="w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </button>
                    <div className="py-3 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not receive email?{" "}
                        <a
                            href="register"
                            className="text-blue-700 hover:underline dark:text-blue-500"
                            onClick={onResend}
                        >
                            Resend
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmOtpModal;

