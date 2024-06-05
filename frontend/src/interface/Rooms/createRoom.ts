interface CreateRoomRequest {
  roomName: string;
  capacity: number;
  length: number;
  width: number;
  description: string;
  roomFee: number;
  hostelID: number;
}

interface CreateRoomResponse {
  roomID: number;
}
