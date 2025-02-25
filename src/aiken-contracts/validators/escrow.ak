use aiken/collection/list
use cardano/transaction.{Transaction, OutputReference, find_input}
use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{from_asset}

use cocktail/vodka_value.{get_all_value_to, value_geq}
use cocktail/vodka_inputs.{inputs_at}

use escrow/types.{Datum, Redeemer, Release, Refund}
 
 
validator escrow {
  spend(
    datum: Option<Datum>,
    redeemer: Redeemer,
    ref: OutputReference,
    tx: Transaction
  ) {
    
    expect Some(Datum { admin, owner, payouts }) = datum

    when redeemer is {
      Release -> {
        trace @"redeemer": "Release"

        let must_be_signed = list.has(tx.extra_signatories, owner) || list.has(tx.extra_signatories, admin)

        // expect Some(own_input) = find_input(tx.inputs, ref)
        // let own_address = own_input.output.address
        
        // let is_only_one_input_from_script =
        //   when inputs_at(tx.inputs, own_address) is {
        //    [_] -> True
        //    _ -> False
        //  }
        
        // let is_payouts_correct = list.all(contract_input.payouts, fn(payout) {
        //  let expected_value = from_asset(contract_input.asset.policy_id, contract_input.asset.name, payout.amount)
        //  let received_value = get_all_value_to(tx.outputs, payout.address)
        //  value_geq(received_value, expected_value)
        // })

        // is_payouts_correct
        must_be_signed
      }
      Refund -> {
        trace @"redeemer": "Refund"
        let must_be_signed = list.has(tx.extra_signatories, admin)
        must_be_signed
      }
    }
  }
  else(_) {
    fail
  }
}