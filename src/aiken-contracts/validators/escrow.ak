use aiken/collection/list
use cardano/transaction.{Transaction, OutputReference, find_input}
use cardano/assets.{from_asset}

use cocktail/vodka_value.{get_all_value_to, value_geq}
use cocktail/vodka_inputs.{inputs_at}

use escrow/types.{Datum, Redeemer, Release, Refund, Params}
 
 
validator escrow {
  spend(
    _datum: Option<Datum>,
    redeemer: Redeemer,
    ref: OutputReference,
    tx: Transaction
  ) {
    when redeemer is {
      Release -> {
        trace @"redeemer": "Release"
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
        True
      }
      Refund -> {
        trace @"redeemer": "Refund"
        False
      }
    }
  }
  else(_) {
    fail
  }
}