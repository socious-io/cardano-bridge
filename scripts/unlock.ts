import { config } from 'dotenv';
import fs from 'node:fs';
import { Escrow } from '../src/escrow/escrow';

config();

const dest =
  'addr_test1qrgc7hlxscruz50ntl7g94p8rfamlulncag333ju823n37nn5j2m090tssjuj9qkd7q5xgnlud6msndp3zdzjnqx366qtznk9m';
const admin =
  'addr_test1qqhxq3ps5rjnkj72v5trr8t78ljxhccetx0et6wt0r0vehgl85luz4yhrk7j449qff3zy9d5m7dw87f3sqvx3009vwwqt8lzve';

const escrow = new Escrow({ blockfrost: process.env.BLOCKFROST_PROJECT_ID as string });

escrow.connectWalletBySecret(fs.readFileSync('test.sk').toString());

const payouts = [
  { address: dest, amount: 2000000 },
  // { address: admin, amount: 1000000 },
];

escrow
  .release({ tx: process.argv[2] as string, payouts })
  .then(tx => console.log(`asset unlocked with transaction ${tx}`))
  .catch(err => console.log(err));
