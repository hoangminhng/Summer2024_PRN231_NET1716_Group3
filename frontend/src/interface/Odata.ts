export interface Odata<T> {
  '@odata.context': string;
  value: T[];
}
