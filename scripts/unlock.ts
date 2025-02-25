import { config } from 'dotenv';
import fs from 'node:fs';
import { Escrow } from '../src/escrow/escrow';

config();

const dest =
  'addr_test1qq3yn36mqf7phf7j2k7n2eyyy2qyn4k95ncemupqj50d36tqqx9cwx6al5gamz6vs0wmk492r6krlyyvdvgec3n3a42qfgcsq8';
const admin =
  'addr_test1qzg0muwwwmcclf9gwvwnjwjx22zzksllznpsd9zhng4saknzxwx2jtelp3ux5tvwykkxt6mxh6wvyuxvj3uuwuwlgnwswhd9ah';

const escrow = new Escrow({ blockfrost: process.env.BLOCKFROST_PROJECT_ID as string });

escrow.connectWalletBySecret(fs.readFileSync('owner.sk').toString());

const payouts = [
  { address: dest, amount: 1000000 },
  { address: admin, amount: 1000000 },
];

escrow
  .release({ tx: process.argv[2] as string, payouts })
  .then(tx => console.log(`asset unlocked with transaction ${tx}`))
  .catch(err => console.log(err));
