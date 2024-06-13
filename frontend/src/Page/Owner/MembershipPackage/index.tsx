import Title from "../../../Component/User/Title";
import PackageCard from "../../../Component/User/PackageCard";
import Banner from "../../../Component/User/Banner";

const OwnerPackage: React.FC = () => {
    return (
        <>
            <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <PackageCard />
                </div>
            </div>
        </>
    );
};

export default OwnerPackage;
