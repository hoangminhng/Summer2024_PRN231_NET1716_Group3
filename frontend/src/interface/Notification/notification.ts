interface notification {
  NotificationId: number;
  AccountNoticeId: number;
  ReceiveAccountId: number;
  NotificationText: string;
  CreateDate: Date;
  NotificationType: number;
  Title: string;
  ForwardToPath: string;
  IsRead: boolean;
}
