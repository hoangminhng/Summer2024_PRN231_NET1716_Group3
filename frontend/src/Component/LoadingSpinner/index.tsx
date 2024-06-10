import React, { Component } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export const LoadingSpinnerComponent: React.FunctionComponent = () => {

    return (
        (
            <div className="spinner w-full h-[100vh] flex justify-center items-center bg-opacity-0">
                <ThreeDots
                    visible={false}
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