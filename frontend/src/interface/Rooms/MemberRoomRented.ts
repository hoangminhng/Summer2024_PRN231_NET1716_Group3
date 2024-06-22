export interface MemberRoomRented {
  roomID: number;
  roomName: string;
  hostelID: number;
  hostelName: string;
  ownerId: number;
  ownerName: string;
  status: number;
  roomThumbnail: string;
  studentAccountId: number;
  contractId: number;
  dateStart: Date;
  dateEnd: Date;
  roomFee: number;
}
