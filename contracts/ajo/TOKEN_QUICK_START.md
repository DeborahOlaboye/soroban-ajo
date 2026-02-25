# Token Transfer Quick Start Guide

## Overview
The Ajo contract now supports real on-chain token transfers using Stellar Asset Contracts (SAC). This guide helps you get started quickly.

## Quick Example

```rust
use soroban_sdk::{token, Address, Env};
use soroban_ajo::AjoContractClient;

// Setup
let env = Env::default();
env.mock_all_auths();

// Register token (XLM, USDC, or custom)
let token_admin = Address::generate(&env);
let token_id = env.register_stellar_asset_contract(token_admin);
let token_client = token::Client::new(&env, &token_id);

// Register Ajo contract
let contract_id = env.register_contract(None, AjoContract);
let client = AjoContractClient::new(&env, &contract_id);

// Initialize contract
let admin = Address::generate(&env);
client.initialize(&admin);

// Create members and mint tokens
let creator = Address::generate(&env);
let contribution = 100_000_000i128; // 10 XLM
token_client.mint(&creator, &(contribution * 10));

// Create group with token
let group_id = client.create_group(
    &creator,
    &token_id,           // Token address (NEW!)
    &contribution,
    &604_800u64,         // 1 week cycle
    &5u32,               // Max 5 members
    &86400u64,           // 24h grace period
    &5u32,               // 5% penalty rate
);

// Contribute (tokens automatically transferred)
client.contribute(&creator, &group_id);

// Check contract balance
let balance = client.get_contract_balance(&token_id);
assert_eq!(balance, contribution);
```

## Key Changes

### 1. Creating Groups
**Before:**
```rust
client.create_group(&creator, &contribution, &cycle_duration, &max_members, &grace_period, &penalty_rate)
```

**After:**
```rust
client.create_group(&creator, &token_address, &contribution, &cycle_duration, &max_members, &grace_period, &penalty_rate)
//                             ^^^^^^^^^^^^^^ NEW PARAMETER
```

### 2. Contributing
**Before:** Only recorded contribution
**After:** Transfers tokens from member to contract

```rust
// Member must have sufficient token balance
client.contribute(&member, &group_id);
// Tokens are now transferred automatically
```

### 3. Payouts
**Before:** Only recorded payout
**After:** Transfers tokens from contract to recipient

```rust
client.execute_payout(&group_id);
// Tokens are now transferred automatically
```

### 4. Checking Balances
**New function:**
```rust
let balance = client.get_contract_balance(&token_address);
```

## Token Types Supported

### Native XLM
```rust
let xlm_token = env.register_stellar_asset_contract(admin);
```

### USDC or Other Assets
```rust
// Use actual USDC contract address on mainnet
let usdc_token = Address::from_string(&"CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
```

### Custom Tokens
```rust
// Deploy your own token contract
let custom_token = env.register_stellar_asset_contract(token_admin);
```

## Error Handling

### Insufficient Balance
```rust
// Member doesn't have enough tokens
match client.try_contribute(&member, &group_id) {
    Err(AjoError::InsufficientBalance) => {
        println!("Member needs more tokens!");
    }
    Ok(_) => println!("Contribution successful!"),
}
```

### Insufficient Contract Balance
```rust
// Contract doesn't have enough tokens for payout
match client.try_execute_payout(&group_id) {
    Err(AjoError::InsufficientContractBalance) => {
        println!("Contract needs more tokens!");
    }
    Ok(_) => println!("Payout successful!"),
}
```

## Testing

### Basic Test Template
```rust
#[test]
fn test_my_scenario() {
    let (env, client, token_id, token_client) = setup_test_env_with_token();
    
    // Create member
    let member = Address::generate(&env);
    
    // Mint tokens
    token_client.mint(&member, &1_000_000_000i128);
    
    // Create group
    let group_id = client.create_group(
        &member,
        &token_id,
        &100_000_000i128,
        &604_800u64,
        &2u32,
        &86400u64,
        &5u32,
    );
    
    // Test your scenario...
}
```

### Running Tests
```bash
cd contracts/ajo
cargo test token_transfer_tests
```

## Common Patterns

### Multi-Member Group
```rust
// Create members
let members: Vec<Address> = (0..5).map(|_| Address::generate(&env)).collect();

// Mint tokens to all
for member in &members {
    token_client.mint(member, &(contribution * 10));
}

// Create group
let group_id = client.create_group(&members[0], &token_id, &contribution, ...);

// Others join
for member in &members[1..] {
    client.join_group(member, &group_id);
}

// All contribute
for member in &members {
    client.contribute(member, &group_id);
}
```

### Complete Cycle
```rust
// All members contribute
for member in &members {
    client.contribute(member, &group_id);
}

// Advance time past grace period
env.ledger().with_mut(|li| {
    li.timestamp = li.timestamp + 604_800 + 86400 + 1;
});

// Execute payout
client.execute_payout(&group_id);
```

### Group Cancellation
```rust
// Creator cancels (before first payout)
client.cancel_group(&creator, &group_id);

// All contributors automatically refunded
```

## Best Practices

### 1. Always Check Balances
```rust
// Before creating group, ensure members have tokens
let balance = token_client.balance(&member);
assert!(balance >= contribution);
```

### 2. Mint Enough Tokens for Tests
```rust
// Mint 10x contribution amount for safety
token_client.mint(&member, &(contribution * 10));
```

### 3. Use Realistic Token Amounts
```rust
// XLM: 1 XLM = 10_000_000 stroops
let xlm_amount = 10_000_000i128; // 1 XLM

// USDC: 1 USDC = 1_000_000 (6 decimals)
let usdc_amount = 1_000_000i128; // 1 USDC
```

### 4. Handle Errors Gracefully
```rust
match client.try_contribute(&member, &group_id) {
    Ok(_) => {
        // Success - tokens transferred
    }
    Err(e) => {
        // Handle error appropriately
        match e {
            AjoError::InsufficientBalance => { /* ... */ }
            AjoError::AlreadyContributed => { /* ... */ }
            _ => { /* ... */ }
        }
    }
}
```

## Migration from Old Code

### Update create_group Calls
```rust
// OLD
let group_id = client.create_group(&creator, &100_000_000, &604_800, &5, &86400, &5);

// NEW - Add token_address parameter
let group_id = client.create_group(&creator, &token_id, &100_000_000, &604_800, &5, &86400, &5);
```

### Update Tests
```rust
// OLD
fn setup_test_env() -> (Env, AjoContractClient) { ... }

// NEW - Include token setup
fn setup_test_env_with_token() -> (Env, AjoContractClient, Address, token::Client) { ... }
```

## Troubleshooting

### "InsufficientBalance" Error
- Check member has enough tokens: `token_client.balance(&member)`
- Mint more tokens: `token_client.mint(&member, &amount)`

### "InsufficientContractBalance" Error
- Check contract balance: `client.get_contract_balance(&token_id)`
- Ensure all members contributed before payout

### "TransferFailed" Error
- Verify token contract is valid
- Check authorization is mocked: `env.mock_all_auths()`
- Ensure token contract is properly initialized

## Resources

- [Full Implementation Guide](./TOKEN_IMPLEMENTATION.md)
- [Implementation Summary](./TOKEN_TRANSFER_SUMMARY.md)
- [Test Examples](./tests/token_transfer_tests.rs)
- [Soroban Token Documentation](https://soroban.stellar.org/docs/built-in-contracts/stellar-asset-contract)

## Support

For issues or questions:
1. Check test examples in `tests/token_transfer_tests.rs`
2. Review error codes in `src/errors.rs`
3. Read full documentation in `TOKEN_IMPLEMENTATION.md`
