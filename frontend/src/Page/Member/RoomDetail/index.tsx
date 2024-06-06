import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetRoomDetailById } from "../../../api/Room";

const MemberRoomDetails: React.FC = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | undefined>();
  const [roomImages, setRoomImages] = useState<string[] | undefined>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await GetRoomDetailById(roomID);
        if (response?.data) {
          setRoomDetail(response?.data);
          setRoomImages(response?.data.roomImageUrls);
        } else {
          console.error("Response data is undefined or empty");
        }
      } catch (error) {
        console.error("Error fetching room detail:", error);
      }
    };
    fetchRooms();
  }, [roomID]);

  return (
    <>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src={roomDetail?.roomImageUrls[0]}
            alt=""
          />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {roomImages?.map((image) => (
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src={image}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberRoomDetails;
