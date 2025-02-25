use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId}

pub type Redeemer {
  Release
  Refund
}

pub type Payout {
  address: Address,
  amount: Int,
}


pub type Datum {
  admin: VerificationKeyHash,
  owner: VerificationKeyHash,
  payouts: List<Payout>,
}