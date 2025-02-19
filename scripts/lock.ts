import { config } from 'dotenv';
import fs from 'node:fs';
import { Escrow } from '../src/escrow/escrow';

config();

const escrow = new Escrow({ blockfrost: process.env.BLOCKFROST_PROJECT_ID as string });

escrow.connectWalletBySecret(fs.readFileSync('test.sk').toString());

escrow
  .deposit({
    unit: 'lovelace',
    quantity: '2000000',
  })
  .then(tx => console.log(`asset locked with transaction ${tx}`))
  .catch(err => console.log(err));
