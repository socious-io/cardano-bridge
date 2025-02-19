import { MeshWallet } from '@meshsdk/core';
import fs from 'node:fs';

async function main() {
  const walletName = process.argv[2] || 'test';
  const secret_key = MeshWallet.brew(true) as string;

  fs.writeFileSync(`${walletName}.sk`, secret_key);

  const wallet = new MeshWallet({
    networkId: 0,
    key: {
      type: 'root',
      bech32: secret_key,
    },
  });

  fs.writeFileSync(`${walletName}.addr`, (await wallet.getUnusedAddresses())[0]);
}

main();
