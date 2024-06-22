import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import moment from 'moment'
import { NumberFormat } from "../../../Utils/numberFormat";
import { extendMembership, registerMembership, updateMembership } from "../../../api/Owner/ownerPackage";
import toast from "react-hot-toast";
import { createMemberComplain } from "../../../api/Member/memberComplain";
import { redirect, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { MemberRoomRented } from "../../../interface/Rooms/MemberRoomRented";

const CreateComplainModal: React.FC<{ room: MemberRoomRented | undefined }> = ({ room }) => {
    const navigate = useNavigate();
    const { token, userId } = useContext(UserContext);
    const [complain, setComplain] = useState("");

    const handleCreate = (complain: string) => {
        if (room === undefined) {
            return
        }
        const createComplain = async () => {
            if (userId && token) {
                const response = await createMemberComplain(
                    token,
                    userId,
                    room.roomID,
                    complain
                )
                if (response) {
                    toast.success("Your complain has been recorded", {
                        duration: 2000,
                    });
                    navigate("/complains")
                }
            }
        };
        createComplain();
        // navigate("/complains")

    };

    const handleChange = (content: any) => {
        setComplain(content);
    };

    return (
        <>
            (

            <div className="update-modal relative p-4 w-full max-w-md max-h-full flex flex-col items-center justify-center">
                <div className="update-modal-content relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="update-modal-header flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="update-modal-title text-center text-xl font-semibold text-gray-900 dark:text-white">
                            Create complain for room: {room?.roomName}
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
                            onClick={() => handleCreate(complain)}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>

            )


        </>
    );
};

export default CreateComplainModal;
