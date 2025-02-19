import { ConStr0, LanguageVersion, PubKeyAddress } from '@meshsdk/core';

export type Inputs = {
  networkId?: 0 | 1;
  version?: LanguageVersion;
  blockfrost: string;
};

export type Script = {
  address: string;
  cbor: string;
};

export type InitEscrowParams = {
  admin: string;
  amount: number;
};

export type Payout = {
  address: string;
  amount: number;
};

export type InitiationDatum = ConStr0<
  (
    | PubKeyAddress
    | {
        constructor: number;
        fields: (
          | {
              bytes: string;
              int?: undefined;
            }
          | {
              int: number;
              bytes?: undefined;
            }
        )[];
      }
  )[]
>;

export type ReleaseParams = {
  tx: string;
  payouts: Payout[];
};
