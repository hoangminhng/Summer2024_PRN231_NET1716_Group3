import Banner from "../../Component/User/Banner";
import PackageCard from "../../Component/User/PackageCard";

const Package: React.FC = () => {
  return (
    <>
      <Banner />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <PackageCard />
        </div>
        </div>
    </>
  );
};

export default Package;
