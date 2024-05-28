interface CreateHostelRequest {
  hostelName: string;
  hostelAddress: string;
  hostelDescription: string;
  accountID: number;
}

interface CreateHostelResponse {
  hostelID: number;
}
