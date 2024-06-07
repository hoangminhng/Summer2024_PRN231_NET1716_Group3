interface CreateHostelRequest {
  hostelName: string;
  hostelAddress: string;
  hostelDescription: string;
  accountID: number;
  hostelType: string,
}

interface CreateHostelResponse {
  hostelID: number;
}
