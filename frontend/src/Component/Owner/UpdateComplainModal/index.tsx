import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import toast from "react-hot-toast";
import { createMemberComplain } from "../../../api/Member/memberComplain";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Complain } from "../../../interface/Complains/Complain";
import { reponseComplain } from "../../../api/Owner/ownerComplain";

const UpdateComplainModal: React.FC<{ complain: Complain | undefined }> = ({ complain }) => {
    const navigate = useNavigate();
    const { token, userId } = useContext(UserContext);
    const [complainResponse, setComplainResponse] = useState("");

    const handleUpdate = () => {
        if (complain === undefined) {
            return
        }
        const updateComplain = async () => {
            if (complainResponse === null || complainResponse === "") {
                toast.error("You have to response", {
                    duration: 2000,
                });
                return;
            }
            if (userId && token) {
                const response = await reponseComplain(
                    token,
                    complain.ComplainID,
                    complainResponse
                )
                if (response) {
                    toast.success("Your reponse has been recorded", {
                        duration: 2000,
                    });
                    // navigate("/owner/complains", { replace: true });
                    // window.location.reload();
                    navigate("/owner/complains", { replace: true });
                    window.dispatchEvent(new Event('modalClosed'));
                }
            }
        };
        updateComplain();

    };

    const handleChange = (content: any) => {
        setComplainResponse(content);
    };

    return (
        <>
            (

            <div className="update-modal relative p-4 w-full max-w-md max-h-full flex flex-col items-center justify-center">
                <div className="update-modal-content relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="update-modal-header flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="update-modal-title text-center text-xl font-semibold text-gray-900 dark:text-white">
                            Repsonse the complain for room: {complain?.RoomName}
                        </h3>
                    </div>
                    <div className="update-modal-details flex flex-col gap-2 p-4 md:p-5">
                        <div className="update-modal-fee text-lg">
                            <ReactQuill
                                theme="snow"
                                onChange={handleChange}
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }],
                                        [{ size: [] }],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                        { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['clean']
                                    ],
                                }}
                                formats={[
                                ]}
                                style={{ height: '300px', marginBottom: '40px', width: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="update-modal-actions flex justify-center py-5">
                        <button
                            type="button"
                            className="update-modal-confirm-btn w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => handleUpdate()}
                        >
                            Response
                        </button>
                    </div>
                </div>
            </div>

            )


        </>
    );
};

export default UpdateComplainModal;
