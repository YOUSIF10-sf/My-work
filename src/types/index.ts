export type Transaction = {
  id: string;
  exitTime: Date;
  exitGate: string;
  duration: number;
  plateNo: string;
  payType: string;
  shift: 'Morning' | 'Evening';
  parkingFee: number;
  valetFee: number;
  totalFee: number;
};
