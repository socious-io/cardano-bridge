import { config } from 'dotenv';
import fs from 'node:fs';
import { Escrow } from '../src/escrow/escrow';
import { parseDatumCbor } from '@meshsdk/core-csl';
import { Payout } from '../src/escrow/escrow.types';
import {
  BlockfrostProvider,
  BrowserWallet,
  IFetcher,
  IWallet,
  LanguageVersion,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  UTxO,
  Asset,
  deserializeDatum,
  deserializeAddress,
  pubKeyAddress,
  conStr0,
  list
} from '@meshsdk/core';

config();

/* const escrow = new Escrow({ blockfrost: process.env.BLOCKFROST_PROJECT_ID as string });

escrow.connectWalletBySecret(fs.readFileSync('test.sk').toString());

escrow
  .deposit({
    unit: 'lovelace',
    quantity: '2000000',
  })
  .then(tx => console.log(`asset locked with transaction ${tx}`))
  .catch(err => console.log(err)); */


console.log(JSON.stringify(parseDatumCbor("d8799f581c23fb0532cd979e17dfdaf6db6d3537c0ca13fcc9e3965dd1cc3976229fd8799fd8799fd8799f581c3051e9a974254ccd56bb5434cd2d2368f992859e87cf638da1285d9bffd87a80ff01ffd8799fd8799fd8799f581cda115ddf5ee4800cfd61bb43889af983ce002ab1d545f042e7ffbf2affd87a80ff02ffffff")))

function datum(owner: string, payouts: Payout[]) {
  const { pubKeyHash } = deserializeAddress(owner);
    return conStr0([
      pubKeyHash,
      list(payouts.map(p => {        
        const { pubKeyHash, stakeCredentialHash } = deserializeAddress(p.address);        
        return conStr0([pubKeyAddress(pubKeyHash, stakeCredentialHash), p.amount])
      }))
  ])
}
console.log('---------------------------------------')
console.log('---------------------------------------')

console.log(JSON.stringify(datum(
  'addr_test1qqmsnx4jyn7vdtyk0yxnhw5ywvs0srxjuzymwe3edd3fqu977mnsdtmez22rydcyyv6y062gz5742r4ptt9lgp80g0rqw2ydmm',
  [
    {address: 'addr_test1qqmsnx4jyn7vdtyk0yxnhw5ywvs0srxjuzymwe3edd3fqu977mnsdtmez22rydcyyv6y062gz5742r4ptt9lgp80g0rqw2ydmm', amount: 1},
    {address: 'addr_test1qqmsnx4jyn7vdtyk0yxnhw5ywvs0srxjuzymwe3edd3fqu977mnsdtmez22rydcyyv6y062gz5742r4ptt9lgp80g0rqw2ydmm', amount: 2},
  ]
)))