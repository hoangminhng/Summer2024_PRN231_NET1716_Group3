import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";

export interface UpdatePackageProps {
    type?: number | undefined //0 is buy, 1 is update, 2 is extend
    membershipId?: number | undefined,
    fee?: number | undefined,
    oldFee?: number | undefined,
}

const UpdatePackageModal: React.FC<UpdatePackageProps> = ({ type, membershipId, fee, oldFee }) => {
    // const { token, userPackageStatus, userRole, userId } = useContext(UserContext);

    const handleSubmit = () => {

    }



    return (
        <>
            {type === 1 && (

                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Update to new member package
                            </h3>
                        </div>
                        <h5>Please check your email for the OTP</h5>
                        <div>{membershipId} membershipId</div>
                        <div>{fee} fee</div>
                        <div>{oldFee} old fee</div>
                        <div className='py-5'>

                        </div>

                        <button
                            type="button"
                            className="w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={handleSubmit}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {type === 2 && (
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Confirm OTP
                            </h3>
                        </div>
                        <h5>Please check your email for the OTP</h5>

                        <div className='py-5'>

                        </div>

                        <button
                            type="button"
                            className="w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={handleSubmit}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )

            }
        </>
    );
};

export default UpdatePackageModal;
