interface OwnerRoom {
  roomID: number;
  roomName: string;
  capacity: number;
  roomFee: number;
  hostelID: number;
  status: number;
  roomThumbnail: string;
}

interface OwnerRoomDetail {
  lenght: number;
  width: number;
  description: string;
  renterName: string;
  roomImageUrls: string[];
  roomServices: RoomService[];
  roomID: number;
  roomName: string;
  capacity: number;
  roomFee: number;
  hostelID: number;
  status: number;
  roomThumbnail: string;
}

interface RoomService {
  serviceID: number;
  typeServiceID: number;
  serviceName: string;
  servicePrice: number;
  status: number;
}
