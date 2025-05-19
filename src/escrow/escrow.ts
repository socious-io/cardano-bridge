import { Asset, conStr0, mConStr0 } from '@meshsdk/core';

import { Offchain } from '../offchain';
import { ReleaseParams } from './escrow.types';

export class Escrow extends Offchain {
  async deposit(asset: Asset): Promise<string> {
    if (!this.wallet) throw Error('wallet is not connected');

    const utxos = await this.wallet.getUtxos();
    const walletAddress = await this.getWalletDappAddress();
    if (!walletAddress) throw Error('wallet address can not be found');
    const walletInfo = this.getWalletInfo(walletAddress);

    const txBuilder = this.getTxBuilder();
    await txBuilder
      .txOut(this.script.address, [asset])
      .txOutDatumHashValue(conStr0([walletInfo.pubKeyAddress]), 'JSON')
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();

    const unsignedTx = txBuilder.txHex;
    const signedTx = await this.wallet.signTx(unsignedTx);
    const txHash = await this.wallet.submitTx(signedTx);

    return txHash;
  }

  async release(params: ReleaseParams): Promise<string> {
    if (!this.wallet) throw Error('wallet is not connected');

    const utxos = await this.wallet.getUtxos();
    const walletAddress = await this.getWalletDappAddress();
    if (!walletAddress) throw Error('wallet address can not be found');
    const walletInfo = this.getWalletInfo(walletAddress);
    const collateral = await this.wallet.getCollateral();
    if (collateral.length === 0) {
      throw new Error('No collateral available');
    }

    const scriptUtxo = await this.getUtxoByTxHash(params.tx);
    if (!scriptUtxo?.output?.amount?.[0]) {
      throw new Error('Invalid script UTxO');
    }

    const asset = scriptUtxo.output.amount[0];

    console.log("Script UTxO:", scriptUtxo);
    console.log("Wallet UTxO:", utxos);
    console.log("Redeemer:", mConStr0([])); // Is this the expected redeemer?
    console.log("Datum:", conStr0([walletInfo.pubKeyAddress])); 
    console.log("Collateral:", collateral);

    const txBuilder = this.getTxBuilder();
    txBuilder
      .spendingPlutusScript(this.languageVersion)
      .txIn(scriptUtxo.input.txHash, scriptUtxo.input.outputIndex, scriptUtxo.output.amount, scriptUtxo.output.address)
      .txInScript(this.script.cbor)
      .txInRedeemerValue(mConStr0([]))
      .txInDatumValue(conStr0([walletInfo.pubKeyAddress]), 'JSON')
      // .requiredSignerHash(walletInfo.pubKeyHash)
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral[0].input.txHash,
        collateral[0].input.outputIndex,
        collateral[0].output.amount,
        collateral[0].output.address,
      )
      .selectUtxosFrom(utxos);

    params.payouts.forEach(payout =>
      txBuilder.txOut(payout.address, [{ unit: asset.unit, quantity: `${payout.amount}` }]),
    );

    await txBuilder.complete();

    const unsignedTx = txBuilder.txHex;

    const signedTx = await this.wallet.signTx(unsignedTx);
    const txHash = await this.wallet.submitTx(signedTx);

    return txHash;
  }
}
