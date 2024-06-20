import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";
import moment from 'moment'
import { NumberFormat } from "../../../Utils/numberFormat";
import { extendMembership, registerMembership, updateMembership } from "../../../api/Owner/ownerPackage";
import toast from "react-hot-toast";


export interface UpdatePackageProps {
    type?: number | undefined //0 is buy, 1 is update, 2 is extend
    membershipId?: number | undefined,
    membershipName?: string | undefined,
    fee?: number | undefined,
    oldFee?: number | undefined,
    expiredDate?: string | undefined,
}

const UpdatePackageModal: React.FC<UpdatePackageProps> = ({ type, membershipId, fee, oldFee, membershipName, expiredDate }) => {
    const { token, userId } = useContext(UserContext);

    const handleBuy = (packageID: number | undefined) => {
        // redirect payment thanh toán
        if (packageID === undefined) {
            return;
        }
        const fetchPaymentUrl = async () => {
            if (userId && token) {
                const response = await registerMembership(
                    userId,
                    packageID,
                    token
                )
                if (response) {
                    window.location.href = response.data?.paymentUrl as string;
                }
            }
        };
        fetchPaymentUrl();
    };

    const handleUpdate = (packageID: number | undefined, fee: number | undefined) => {
        // redirect payment thanh toán
        if (packageID === undefined || fee === undefined) {
            return;
        }

        if (fee <= 100000) {
            toast.error("You cannot make this update", { duration: 2000 });
            return;
        }
        const fetchPaymentUrl = async () => {
            if (userId && token) {
                const response = await updateMembership(
                    userId,
                    packageID,
                    token,
                    fee
                )
                if (response) {
                    window.location.href = response.data?.paymentUrl as string;
                }
            }
        };
        fetchPaymentUrl();
    };

    const handleExtend = (packageID: number | undefined) => {
        // redirect payment thanh toán
        if (packageID === undefined) {
            return;
        }
        const fetchPaymentUrl = async () => {
            if (userId && token) {
                const response = await extendMembership(
                    userId,
                    packageID,
                    token
                )
                if (response) {
                    window.location.href = response.data?.paymentUrl as string;
                }
            }
        };
        fetchPaymentUrl();
    };



    const handleSubmit = () => {
        switch (type) {
            case 0:
                handleBuy(membershipId)
                break;
            case 1:
                handleUpdate(membershipId, fee)
                break;
            case 2:
                handleExtend(membershipId)
                break;
        }
    }

    return (
        <>
            {type === 0 && (

                <div className="update-modal relative p-4 w-full max-w-md max-h-full flex flex-col items-center justify-center">
                    <div className="update-modal-content relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="update-modal-header flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="update-modal-title text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Buy new member package: {membershipName?.toUpperCase()}
                            </h3>
                        </div>
                        <div className="update-modal-details flex flex-col gap-2 p-4 md:p-5">
                            <div className="update-modal-fee text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">Fee: </span>
                                <span className="text-black dark:text-white font-bold">{NumberFormat(fee)}</span>
                            </div>

                            <div className="update-modal-expired-date text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">New Expired Date: </span>
                                <span className="text-red-500 dark:text-red-300">{expiredDate}</span>
                            </div>
                        </div>
                        <div className="update-modal-actions flex justify-center py-5">
                            <button
                                type="button"
                                className="update-modal-confirm-btn w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={handleSubmit}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                </div>

            )}
            {type === 1 && (

                <div className="update-modal relative p-4 w-full max-w-md max-h-full flex flex-col items-center justify-center">
                    <div className="update-modal-content relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="update-modal-header flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="update-modal-title text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Update to new member package: {membershipName?.toUpperCase()}
                            </h3>
                        </div>
                        <div className="update-modal-details flex flex-col gap-2 p-4 md:p-5">
                            <div className="update-modal-old-fee text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">Instead of: </span>
                                <span className="text-gray-500 dark:text-gray-300 line-through">{NumberFormat(oldFee)}</span>
                            </div>
                            <div className="update-modal-fee text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">You now only have to pay: </span>
                                <span className="text-black dark:text-white font-bold">{NumberFormat(fee)}</span>
                            </div>

                            <div className="update-modal-expired-date text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">New Expired Date: </span>
                                <span className="text-red-500 dark:text-red-300">{expiredDate}</span>
                            </div>
                        </div>
                        <div className="update-modal-actions flex justify-center py-5">
                            <button
                                type="button"
                                className="update-modal-confirm-btn w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

            )}

            {type === 2 && (
                <div className="update-modal relative p-4 w-full max-w-md max-h-full flex flex-col items-center justify-center">
                    <div className="update-modal-content relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="update-modal-header flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="update-modal-title text-center text-xl font-semibold text-gray-900 dark:text-white">
                                Extend the membership package: {membershipName?.toUpperCase()}
                            </h3>
                        </div>
                        <div className="update-modal-details flex flex-col gap-2 p-4 md:p-5">
                            <div className="update-modal-fee text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">Fee: </span>
                                <span className="text-black dark:text-white font-bold">{NumberFormat(fee)}</span>
                            </div>

                            <div className="update-modal-expired-date text-lg">
                                <span className="text-gray-700 dark:text-gray-400 font-medium">New Expired Date: </span>
                                <span className="text-red-500 dark:text-red-300">{expiredDate}</span>
                            </div>
                        </div>
                        <div className="update-modal-actions flex justify-center py-5">
                            <button
                                type="button"
                                className="update-modal-confirm-btn w-fit text-white bg-slate-950 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={handleSubmit}
                            >
                                Extend
                            </button>
                        </div>
                    </div>
                </div>
            )

            }
        </>
    );
};

export default UpdatePackageModal;
