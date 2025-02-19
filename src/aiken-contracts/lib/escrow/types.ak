use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId}

pub type Datum {
  initiator: Address,
}

pub type Redeemer {
  Release
  Refund
}

pub type Asset {
  policy_id: PolicyId,
  name: AssetName,
  amount: Int,
}

pub type Payout {
  address: Address,
  amount: Int,
}

pub type Params {
  admin: Address,
  asset: Asset,
  payouts: List<Payout>,
}