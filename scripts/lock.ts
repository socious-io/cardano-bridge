import { config } from 'dotenv';
import fs from 'node:fs';
import { Escrow } from '../src/escrow/escrow';


config();

const adminAddr = 'addr_test1qply2amz0qd5wy0zpr2supsqg4hx82qeslkvhdv4wv9azfqa5l9qujrcp5uukdv7nahwtnudu7ymtxu4evahqm9mvmrq2ydty0';

const escrow = new Escrow({ blockfrost: process.env.BLOCKFROST_PROJECT_ID as string });

escrow.connectWalletBySecret(fs.readFileSync('owner.sk').toString());

escrow
  .deposit({
    admin: adminAddr,
    payouts: [
      {
        address: 'addr_test1qzrlwu9rrpwez5eph87474x4q79p5kwtnjfz5ty0yfxexns7gs889n54v6nxgh8xvy8apfdk09rfqus5kz4fjyf0r9qqhnjfq2',
        amount: 2000000,
      }
    ],
    asset: {
      unit: 'lovelace',
      quantity: '2000000',
    },  
  })
  .then(tx => console.log(`asset locked with transaction ${tx}`))
  .catch(err => console.log(err));
