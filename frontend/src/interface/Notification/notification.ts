interface notification {
  notification_id: number;
  account_notice_id: number;
  receive_account_id: number;
  notification_text: string;
  create_date: Date;
  notification_type: number;
  title: string;
  forward_to_path: string;
  is_read: boolean;
}
