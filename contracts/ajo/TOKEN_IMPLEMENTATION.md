# Token Transfer Implementation

## Overview

The Ajo contract now supports actual on-chain token transfers using the Stellar Asset Contract (SAC) interface. This implementation enables real financial transactions for contributions, payouts, and refunds.

## Features Implemented

### 1. Token Support
- **Multiple Token Types**: Supports any Stellar Asset Contract token including:
  - Native XLM (wrapped as SAC)
  - USDC and other stablecoins
  - Custom tokens deployed on Stellar
- **Token Address Storage**: Each group stores its token contract address
- **Token Flexibility**: Different groups can use different tokens

### 2. Contribution with Token Transfer
- **Balance Checking**: Verifies member has sufficient balance before transfer
- **Atomic Transfer**: Transfers tokens from member to contract during contribution
- **Error Handling**: Returns `InsufficientBalance` if member lacks funds
- **Transfer Verification**: Ensures transfer succeeds before recording contribution

### 3. Payout with Token Transfer
- **Contract Balance Verification**: Checks contract has sufficient tokens for payout
- **Payout Calculation**: Includes base contributions plus penalty bonuses
- **Atomic Transfer**: Transfers tokens from contract to recipient
- **Error Handling**: Returns `InsufficientContractBalance` if contract lacks funds

### 4. Refund with Token Transfer
- **Creator Cancellation**: Refunds all contributors when creator cancels group
- **Member Vote Refund**: Refunds all contributors when refund vote passes
- **Emergency Refund**: Admin can force refunds in emergencies
- **Atomic Transfers**: Each refund is a separate token transfer
- **Refund Records**: All refunds are tracked in storage

### 5. Balance Checking Functions
- **get_contract_balance()**: Query contract's token balance for any token
- **check_balance()**: Internal function to verify user balance
- **check_contract_balance()**: Internal function to verify contract balance

## API Changes

### Updated Functions

#### create_group
```rust
pub fn create_group(
    env: Env,
    creator: Address,
    token_address: Address,  // NEW: Token contract address
    contribution_amount: i128,
    cycle_duration: u64,
    max_members: u32,
    grace_period: u64,
    penalty_rate: u32,
) -> Result<u64, AjoError>
```

#### contribute
Now performs actual token transfer from member to contract.

#### execute_payout
Now performs actual token transfer from contract to recipient.

#### cancel_group
Now performs actual token refunds to all contributors.

#### execute_refund
Now performs actual token refunds to all contributors.

#### emergency_refund
Now performs actual token refunds to all contributors.

### New Functions

#### get_contract_balance
```rust
pub fn get_contract_balance(
    env: Env,
    token_address: Address
) -> i128
```
Returns the contract's balance for a specific token.

## Error Codes

### New Errors
- `InvalidTokenAddress` (38): Token contract address is invalid
- `InsufficientContractBalance` (39): Contract lacks tokens for payout
- `InsufficientAllowance` (40): Token allowance insufficient (future use)

### Existing Errors Used
- `InsufficientBalance` (12): Member lacks tokens for contribution
- `TransferFailed` (13): Token transfer operation failed

## Implementation Details

### Token Module (`src/token.rs`)
Provides a clean interface for token operations:
- `transfer_token()`: Transfer tokens between addresses
- `get_balance()`: Query token balance
- `check_balance()`: Verify sufficient balance
- `check_contract_balance()`: Verify contract has sufficient balance

### Type Changes (`src/types.rs`)
- Added `token_address: Address` field to `Group` struct
- Field stores the SAC token contract address for the group

### Contract Changes (`src/contract.rs`)
- Updated `create_group()` to accept and store token address
- Updated `contribute()` to perform token transfers
- Updated `execute_payout()` to perform token transfers
- Updated all refund functions to perform token transfers
- Added `get_contract_balance()` helper function

## Usage Examples

### Creating a Group with XLM
```rust
let xlm_token = env.register_stellar_asset_contract(admin);
let group_id = client.create_group(
    &creator,
    &xlm_token,  // XLM token address
    &100_000_000i128,  // 10 XLM
    &604_800u64,
    &5u32,
    &86400u64,
    &5u32,
);
```

### Creating a Group with USDC
```rust
let usdc_token = get_usdc_token_address(&env);
let group_id = client.create_group(
    &creator,
    &usdc_token,  // USDC token address
    &100_000_000i128,  // 100 USDC (6 decimals)
    &604_800u64,
    &5u32,
    &86400u64,
    &5u32,
);
```

### Contributing with Token Transfer
```rust
// Member must have sufficient token balance
client.contribute(&member, &group_id);
// Tokens are automatically transferred from member to contract
```

### Checking Contract Balance
```rust
let balance = client.get_contract_balance(&token_address);
println!("Contract holds {} tokens", balance);
```

## Testing

### Test Coverage
- ✅ Contribution with token transfer
- ✅ Payout with token transfer
- ✅ Full cycle with multiple members
- ✅ Group cancellation with refunds
- ✅ Multiple token types support
- ✅ Contract balance queries
- ✅ Insufficient balance error handling
- ✅ Insufficient contract balance error handling

### Running Tests
```bash
cd contracts/ajo
cargo test token_transfer_tests
```

## Security Considerations

### Balance Checks
- Always verify member balance before accepting contribution
- Always verify contract balance before executing payout
- Prevents failed transactions and inconsistent state

### Atomic Operations
- Token transfers are atomic with state updates
- If transfer fails, entire operation reverts
- No partial state updates possible

### Authorization
- All transfers require proper authentication
- Members must authorize their own contributions
- Contract authorizes payouts and refunds

### Reentrancy Protection
- Soroban's execution model prevents reentrancy attacks
- Token transfers cannot call back into contract
- State updates occur after transfers complete

## Gas Optimization

### Efficient Token Operations
- Single token transfer per contribution
- Single token transfer per payout
- Batch refunds in single transaction
- Minimal storage reads/writes

### Balance Caching
- Balance checks use direct token queries
- No redundant balance storage in contract
- Reduces storage costs

## Migration Guide

### For Existing Groups
Existing groups created before this update will need to be migrated:
1. Groups without `token_address` field cannot process transfers
2. Consider deprecating old groups and creating new ones
3. Or implement migration function to add token address to existing groups

### For Frontend Integration
Update frontend to:
1. Prompt for token selection when creating group
2. Display token type for each group
3. Show contract balance for group's token
4. Handle new error codes (38, 39, 40)

## Future Enhancements

### Potential Improvements
1. **Token Allowance**: Implement allowance-based transfers
2. **Multi-Token Groups**: Support multiple tokens in single group
3. **Token Swaps**: Integrate DEX for automatic token conversion
4. **Yield Generation**: Stake idle tokens for additional returns
5. **Emergency Withdrawal**: Admin function to recover stuck tokens

### Backwards Compatibility
- New `token_address` parameter is required for new groups
- Existing test code needs updates to include token address
- Consider versioning for contract upgrades

## Conclusion

The token transfer implementation transforms the Ajo contract from a tracking system into a fully functional DeFi application. All contributions, payouts, and refunds now involve real on-chain token transfers, making the contract production-ready for Stellar mainnet deployment.
