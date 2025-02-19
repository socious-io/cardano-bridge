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
} from '@meshsdk/core';
import { applyParamsToScript } from '@meshsdk/core-csl';
import { Script, Inputs, ScriptParams } from './offchain.types';
import blueprint from './aiken-contracts/plutus.json';

export class Offchain {
  wallet?: IWallet;
  networkId = 0;
  languageVersion: LanguageVersion = 'V3';
  provider: BlockfrostProvider;
  script: Script;

  constructor(inputs: Inputs) {
    this.provider = new BlockfrostProvider(inputs.blockfrost);
    if (inputs.networkId) this.networkId = inputs.networkId;
    if (inputs.version) this.languageVersion = inputs.version;
    this.script = this.getScript(inputs.scriptParams);
  }

  getScriptValidatorIndex() {
    return 0;
  }

  getScript(params?: ScriptParams): Script {
    const src = blueprint.validators[this.getScriptValidatorIndex()];
    const cbor = applyParamsToScript(src!.compiledCode, params?.params || [], params?.type);

    const address = serializePlutusScript({ code: cbor, version: this.languageVersion }).address;

    return { cbor, address };
  }

  getTxBuilder() {
    return new MeshTxBuilder({
      fetcher: this.provider,
      submitter: this.provider,
    });
  }

  getWalletInfo(address: string) {
    const { pubKeyHash, stakeCredentialHash } = deserializeAddress(address);

    return {
      pubKeyHash,
      stakeCredentialHash,
      pubKeyAddress: pubKeyAddress(pubKeyHash, stakeCredentialHash),
    };
  }

  connectWalletBySecret(sk: string) {
    this.wallet = new MeshWallet({
      networkId: 0,
      fetcher: this.provider,
      submitter: this.provider,
      key: {
        type: 'root',
        bech32: sk,
      },
    });
  }

  connectWallet(walletProvider: any) {
    this.wallet = walletProvider as IWallet;
  }

  protected getWalletDappAddress = async () => {
    if (!this.wallet) throw Error('wallet not connected');

    const usedAddresses = await this.wallet.getUsedAddresses();
    if (usedAddresses.length > 0) {
      return usedAddresses[0];
    }
    const unusedAddresses = await this.wallet.getUnusedAddresses();
    if (unusedAddresses.length > 0) {
      return unusedAddresses[0];
    }

    return '';
  };

  async getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await this.provider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error('UTxO not found');
    }
    return utxos[0];
  }
}
