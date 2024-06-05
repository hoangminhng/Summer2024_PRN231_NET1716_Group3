import React, { Component } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import { ThreeDots } from 'react-loader-spinner';

export const LoadingSpinnerComponent: React.FunctionComponent = () => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && (
            <div className="spinner">
                <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="" />
            </div>
        )
    );
};