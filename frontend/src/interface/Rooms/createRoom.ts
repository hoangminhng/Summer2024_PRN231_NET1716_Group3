interface CreateRoomRequest {
  roomName: string;
  capacity: number;
  length: number;
  width: number;
  description: string;
  roomFee: number;
  hostelID: number;
  roomServices: ServiceDetails[];
}

interface CreateRoomResponse {
  roomID: number;
}
