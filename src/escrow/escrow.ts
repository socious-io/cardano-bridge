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
    const collateral = (await this.wallet.getCollateral())[0];

    const scriptUtxo = await this.getUtxoByTxHash(params.tx);
    const asset = scriptUtxo.output.amount[0];

    const txBuilder = this.getTxBuilder();
    await txBuilder
      .spendingPlutusScript(this.languageVersion)
      .txIn(scriptUtxo.input.txHash, scriptUtxo.input.outputIndex, scriptUtxo.output.amount, scriptUtxo.output.address)
      .txInScript(this.script.cbor)
      .txInRedeemerValue(mConStr0([]))
      .txInDatumValue(conStr0([walletInfo.pubKeyAddress]), 'JSON')
      .requiredSignerHash(walletInfo.pubKeyHash)
      .changeAddress(params.payouts[1].address)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address,
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
