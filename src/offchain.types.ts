import { LanguageVersion, Data, PlutusDataType } from '@meshsdk/core';

export type ScriptParams = {
  params: object[] | Data[];
  type?: PlutusDataType;
};

export type Inputs = {
  networkId?: 0 | 1;
  version?: LanguageVersion;
  blockfrost: string;
  scriptParams?: ScriptParams;
};

export type Script = {
  address: string;
  cbor: string;
};
