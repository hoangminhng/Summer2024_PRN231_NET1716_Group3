import React, { useState } from "react";
import toast from "react-hot-toast";
import { sendOtpForgetPassword } from "../../api/forgetPassword";
import ForgetPasswordOtpModal from "../../Component/ForgetPasswordOtpModal";

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = () => {
        let roleId: number = 1; //default is user

        const forgetPassword = async () => {
            if (email === "" || password === "") {
                toast.error("Please input all fields.", {
                    duration: 2000,
                });
            } else {

                const response = await sendOtpForgetPassword(email);
                if (response != null) {
                    toggleModal();
                }
            }
        };
        forgetPassword();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            handleSubmit(); // Trigger login action
        }
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

    return (
        <>
            <div className="justify-center">
                <div className="w-3/5 mx-auto">
                    <div
                        className="w-full bg-[#f6f5ec] gap-4 mb-4 rounded-[12px] overflow-hidden"
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "30px",
                            padding: "20px",
                            color: "black",
                        }}
                    >
                        <h3>
                            Forget Password
                        </h3>
                    </div>
                    <form className="space-y-4" onKeyDown={handleKeyDown}>
                        <div>
                            <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="name@company.com"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-start">
                                Your password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Send OTP
                        </button>
                    </form>
                </div>
            </div >
            {isModalOpen && (
                <div
                    tabIndex={-1}
                    aria-hidden="true"
                    onMouseDown={handleOverlayClick}
                    className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
                // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <ForgetPasswordOtpModal email={email} password={password} />
                </div>
            )}
        </>
    );
};


export default ForgetPassword;