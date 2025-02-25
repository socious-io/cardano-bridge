use cardano/transaction.{OutputReference, Transaction}
use cardano/assets.{from_lovelace}
use cardano/address.{from_verification_key, with_delegation_key}
use aiken/cbor.{serialise}
use escrow
use escrow/types.{Release, Payout, Datum}

use mocktail.{complete, mocktail_tx, tx_in, tx_in_inline_datum, tx_out, required_signer_hash}
use mocktail/virgin_key_hash.{mock_pub_key_hash}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_output_reference.{mock_tx_hash}



test release_ada() {
  // Define addresses for admin, beneficiary, and owner
  let admin = mock_pub_key_hash(1)
  let owner_hash = mock_pub_key_hash(2)
  let owner_address = mock_pub_key_address(2, None)
  
  let beneficiary1 = mock_pub_key_address(3, None)
  let beneficiary2 = mock_pub_key_address(4, None)

  // Define the payouts
  let payouts = [
    Payout { address: beneficiary1, amount: 1_000_000 },
    Payout { address: beneficiary2, amount: 2_000_000 },
  ]

  // Define the input datum (ActiveEscrow state)
  let input_datum = Datum {
    admin,
    owner: owner_hash,
    payouts
  }

  // Define a placeholder UTXO reference
  let placeholder_utxo = OutputReference { transaction_id: mock_tx_hash(0), output_index: 0 }

  // Define the redeemer for the Release action
  let redeemer = Release

  // Build the mock transaction
  let tx: Transaction = mocktail_tx()
    |> tx_in(True, mock_tx_hash(0), 0, from_lovelace(0), owner_address) // Input from the owner
    |> tx_in_inline_datum(True, input_datum)  // Attach the ActiveEscrow datum to the input
    |> tx_out(True, beneficiary1, from_lovelace(1_000_000)) // Output to the owner
    |> tx_out(True, beneficiary2, from_lovelace(2_000_000)) // Output to the beneficiary
    |> required_signer_hash(True, owner_hash)
    |> complete()

  // Run the validator with the Release redeemer
  escrow.escrow.spend(    
    Some(input_datum),
    redeemer,
    placeholder_utxo,
    tx,
  )
}


test test_types() {
  let admin = mock_pub_key_hash(1)
  let owner = mock_pub_key_hash(2)
  trace @"owner": owner
  
  let beneficiary1 = mock_pub_key_address(3, None)
  let beneficiary2 = mock_pub_key_address(4, None)

  let payouts = [
    Payout { address: beneficiary1, amount: 1 },
    Payout { address: beneficiary2, amount: 2 },
  ]

  let params =
    Datum {
      admin,
      owner,
      payouts,
    }

  serialise(params) == #""
}