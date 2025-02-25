import { Asset } from '@meshsdk/core';

export type Script = {
  address: string;
  cbor: string;
};

export type Payout = {
  address: string;
  amount: number;
};

export type DepositParams = {
  admin: string;
  payouts: Payout[];
  asset: Asset;
};

export type ReleaseParams = {
  tx: string;
  payouts: Payout[];
};

