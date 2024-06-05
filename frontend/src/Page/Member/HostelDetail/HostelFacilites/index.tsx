interface FacilitiesProps {
  hostelId: number;
  hostelName: string;
}

const HostelFacilites: React.FC<FacilitiesProps> = ({
  hostelId,
  hostelName,
}) => {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-4xl font-bold">Facilities of {hostelName}</h1>
    </div>
  );
};

export default HostelFacilites;
