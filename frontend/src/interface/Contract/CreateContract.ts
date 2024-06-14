interface CreateContract{
    ownerAccountID : number,
    studentAccountID : number,
    roomID : number,
    contractTerm : string,
    dateStart : Date,
    dateEnd : Date,
    roomFee : number,
    depositFee : number,
    contractMember : MemberContract[],
    roomService : number[]
}