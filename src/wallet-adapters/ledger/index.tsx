import type Transport from "@ledgerhq/hw-transport";
import type { Transaction } from "@safecoin/web3.js";

import EventEmitter from "eventemitter3";
import { PublicKey } from "@safecoin/web3.js";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { WalletAdapter } from "../walletAdapter";
import { notify } from "../../utils/notifications";
import { getPublicKey, signTransaction } from "./core";

let TRANSPORT: Transport | null = null;

export class LedgerWalletAdapter extends EventEmitter implements WalletAdapter {
  _connecting: boolean;
  _publicKey: PublicKey | null;
  _transport: Transport | null;

  constructor() {
    super();
    this._connecting = false;
    this._publicKey = null;
    this._transport = null;
  }

  get publicKey() {
    return this._publicKey;
  }

  async signTransaction(transaction: Transaction) {
    if (!this._transport || !this._publicKey) {
      throw new Error("Not connected to Ledger");
    }

    // @TODO: account selection (derivation path changes with account)
    const signature = await signTransaction(this._transport, transaction);

    transaction.addSignature(this._publicKey, signature);

    return transaction;
  }

  async connect() {
    if (this._connecting) {
      return;
    }

    this._connecting = true;

    try {
      // @TODO: transport selection (WebUSB, WebHID, bluetooth, ...)
      if (TRANSPORT === null) {
        TRANSPORT = await TransportWebHID.create();
      }
      this._transport = TRANSPORT;
      // @TODO: account selection
      this._publicKey = await getPublicKey(this._transport);
      this.emit("connect", this._publicKey);
    } catch (error:any) {
      notify({
        message: "Ledger Error",
        description: error.message,
      });
      await this.disconnect();
    } finally {
      this._connecting = false;
    }
  }

  async disconnect() {
    let emit = false;
    if (this._transport) {
      await this._transport.close();
      this._transport = null;
      emit = true;
    }

    this._connecting = false;
    this._publicKey = null;

    if (emit) {
      this.emit("disconnect");
    }
  }
}
