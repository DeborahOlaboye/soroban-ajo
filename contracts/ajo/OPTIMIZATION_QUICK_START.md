# Gas Optimization Quick Start Guide

## Overview

This guide provides a quick reference for implementing gas optimizations in the Soroban Ajo contract.

## Current Status

- **Contract Size**: 39KB (compiled WASM)
- **Build Status**: ✅ Compiles successfully
- **Test Status**: ✅ All tests passing
- **Warnings**: 8 warnings (unused functions)

## Quick Commands

```bash
# Navigate to contract directory
cd soroban-ajo/contracts/ajo

# Build release version
cargo build --release

# Run tests
cargo test

# Check contract size
ls -lh target/wasm32-unknown-unknown/release/soroban_ajo.wasm

# Optimize (requires stellar CLI)
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/soroban_ajo.wasm
```

## Top 5 Optimizations (Ordered by Impact)

### 1. Refactor execute_payout() - 25-30% savings
**File**: `src/contract.rs`
**Change**: Fetch group once, cache values, single write
**Risk**: Medium
**Time**: 1 hour

### 2. Optimize get_group_status() - 20-25% savings
**File**: `src/contract.rs`
**Change**: Pre-allocate vectors, single-pass iteration
**Risk**: Low
**Time**: 45 minutes

### 3. Add Inline Attributes - 10-15% savings
**File**: `src/utils.rs`
**Change**: Add `#[inline]` to small functions
**Risk**: Low
**Time**: 15 minutes

### 4. Pre-allocate Vectors - 10-15% savings
**Files**: `src/storage.rs`, `src/contract.rs`
**Change**: Use `Vec::with_capacity()` when size is known
**Risk**: Low
**Time**: 30 minutes

### 5. Optimize contribute() - 15-20% savings
**File**: `src/contract.rs`
**Change**: Cache group fields, optimize validation order
**Risk**: Low
**Time**: 30 minutes

## Implementation Checklist

### Phase 1: Quick Wins (1-2 hours)
- [ ] Add `#[inline]` to `is_member()`
- [ ] Add `#[inline]` to `calculate_payout_amount()`
- [ ] Add `#[inline]` to `get_current_timestamp()`
- [ ] Add `#[inline]` to `all_members_contributed()`
- [ ] Pre-allocate vector in `get_cycle_contributions()`
- [ ] Pre-allocate vector in `create_group()`
- [ ] Remove unused functions: `has_received_payout()`, `get_cycle_window()`, `is_within_cycle_window()`
- [ ] Run tests: `cargo test`

### Phase 2: High-Impact Changes (3-4 hours)
- [ ] Refactor `execute_payout()` for single-fetch
- [ ] Optimize `get_group_status()` with pre-allocation
- [ ] Optimize `contribute()` with field caching
- [ ] Optimize `join_group()` with member count caching
- [ ] Run tests: `cargo test`
- [ ] Verify test snapshots

### Phase 3: Structural Optimizations (2-3 hours)
- [ ] Reorder `Group` struct fields
- [ ] Update `is_member()` to use `.any()`
- [ ] Update `all_members_contributed()` to use `.all()`
- [ ] Remove unused structs: `ContributionRecord`, `PayoutRecord` (if confirmed unused)
- [ ] Run full test suite
- [ ] Build and measure final size

## Code Snippets

### Inline Attributes (utils.rs)
```rust
#[inline]
pub fn is_member(members: &Vec<Address>, address: &Address) -> bool {
    members.iter().any(|m| m == address)
}

#[inline]
pub fn calculate_payout_amount(group: &Group) -> i128 {
    group.contribution_amount * (group.members.len() as i128)
}

#[inline]
pub fn get_current_timestamp(env: &Env) -> u64 {
    env.ledger().timestamp()
}
```

### Vector Pre-allocation (storage.rs)
```rust
pub fn get_cycle_contributions(
    env: &Env,
    group_id: u64,
    cycle: u32,
    members: &Vec<Address>,
) -> Vec<(Address, bool)> {
    let capacity = members.len();
    let mut results = Vec::with_capacity(env, capacity);
    
    for member in members.iter() {
        let paid = has_contributed(env, group_id, cycle, &member);
        results.push_back((member, paid));
    }
    results
}
```

### Field Caching Pattern
```rust
// Before
if group.members.len() >= group.max_members {
    // ...
}
let count = group.members.len() as i128;

// After
let member_count = group.members.len();
if member_count >= group.max_members as usize {
    // ...
}
let count = member_count as i128;
```

## Testing Strategy

### After Each Phase
1. Run `cargo test` - all tests must pass
2. Check for new warnings: `cargo build --release 2>&1 | grep warning`
3. Verify contract size: `ls -lh target/wasm32-unknown-unknown/release/soroban_ajo.wasm`
4. Document any issues

### Final Validation
1. Run complete test suite: `cargo test`
2. Verify all test snapshots match
3. Check contract size reduction
4. Document gas savings

## Common Pitfalls

### ❌ Don't Do This
```rust
// Multiple group fetches
let group = storage::get_group(&env, group_id)?;
// ... some code ...
let group = storage::get_group(&env, group_id)?; // WASTEFUL
```

### ✅ Do This Instead
```rust
// Single fetch, cache values
let group = storage::get_group(&env, group_id)?;
let group_id = group.id;
let current_cycle = group.current_cycle;
// ... use cached values ...
```

### ❌ Don't Do This
```rust
// No pre-allocation
let mut results = Vec::new(env);
for i in 0..100 {
    results.push_back(i); // May reallocate multiple times
}
```

### ✅ Do This Instead
```rust
// Pre-allocate with known capacity
let mut results = Vec::with_capacity(env, 100);
for i in 0..100 {
    results.push_back(i); // No reallocation
}
```

## Measuring Success

### Before Optimization
- Contract size: 39KB
- Baseline gas costs: (to be measured)

### After Optimization (Target)
- Contract size: 35-37KB (5-10% reduction)
- Gas savings: 15-25% average across operations

### How to Measure
1. Build baseline: `cargo build --release`
2. Note size: `ls -lh target/wasm32-unknown-unknown/release/soroban_ajo.wasm`
3. Apply optimizations
4. Build optimized: `cargo build --release`
5. Compare sizes
6. Run gas profiling (if tools available)

## Resources

- **Full Analysis**: See `GAS_OPTIMIZATION_ANALYSIS.md`
- **Spec Files**: See `.kiro/specs/gas-optimization/`
- **Soroban Docs**: https://soroban.stellar.org/docs
- **Rust Performance**: https://nnethercote.github.io/perf-book/

## Support

If you encounter issues:
1. Check that all tests pass: `cargo test`
2. Review warnings: `cargo build --release 2>&1 | grep warning`
3. Verify no functional changes
4. Consult the full analysis document

## Next Steps

1. ✅ Review this guide
2. ⬜ Start with Phase 1 (quick wins)
3. ⬜ Measure and validate
4. ⬜ Proceed to Phase 2
5. ⬜ Document results
