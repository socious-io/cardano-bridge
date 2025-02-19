use cardano/transaction.{OutputReference, Transaction}
use cardano/assets.{from_lovelace}

use escrow
use escrow/types.{Release, Payout, Params, Datum, Asset}

use mocktail.{complete, mocktail_tx, tx_in, tx_in_inline_datum, tx_out}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_output_reference.{mock_tx_hash}



test release_ada() {
  // Define addresses for admin, beneficiary, and owner
  let admin = mock_pub_key_address(0, None)
  let beneficiary = mock_pub_key_address(1, None)
  let owner = mock_pub_key_address(2, None)

  // Define the payouts
  let payouts = [
    Payout { address: owner, amount: 1_000_000 },
    Payout { address: beneficiary, amount: 2_000_000 },
  ]

  let asset = Asset {
    policy_id: "",
    name: "",
    amount: 3_000_000,
  }

  // Define the input datum (ActiveEscrow state)
  let input_datum = Datum {
    initiator: owner,
  }

  // Define a placeholder UTXO reference
  let placeholder_utxo = OutputReference { transaction_id: mock_tx_hash(0), output_index: 0 }

  // Define the redeemer for the Release action
  let redeemer = Release

  // Build the mock transaction
  let tx: Transaction = mocktail_tx()
    |> tx_in(True, mock_tx_hash(0), 0, from_lovelace(0), owner) // Input from the owner
    |> tx_in_inline_datum(True, input_datum) // Attach the ActiveEscrow datum to the input
    |> tx_out(True, owner, from_lovelace(1_000_000)) // Output to the owner
    |> tx_out(True, beneficiary, from_lovelace(2_000_000)) // Output to the beneficiary
    |> complete()

  // Run the validator with the Release redeemer
  escrow.escrow.spend(
    // Params{ asset },
    Some(input_datum),
    redeemer,
    placeholder_utxo,
    tx,
  )
}