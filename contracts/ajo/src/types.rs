use soroban_sdk::{contracttype, Address, Vec};

/// Represents an Ajo group configuration and state.
///
/// An Ajo (also known as Esusu or Tontine) is a rotating savings group
/// where members contribute a fixed amount each cycle, and one member
/// receives the full pool each round until everyone has been paid out.
///
/// Fields are ordered by size for optimal memory alignment:
/// - 16 bytes: i128
/// - 32 bytes: Address
/// - Variable: Vec<Address>
/// - 8 bytes: u64 fields
/// - 4 bytes: u32 fields
/// - 1 byte: bool
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    /// Fixed contribution amount each member must pay per cycle, denominated in stroops.
    /// 1 XLM = 10,000,000 stroops.
    pub contribution_amount: i128,

    /// Address of the member who created the group.
    /// Automatically added as the first member on creation.
    pub creator: Address,

    /// Ordered list of member addresses.
    /// Members receive payouts in the order they appear in this list.
    pub members: Vec<Address>,

    /// Unique group identifier, auto-incremented from storage counter
    pub id: u64,

    /// Duration of each cycle in seconds.
    /// When a cycle ends, the next payout can be triggered.
    pub cycle_duration: u64,

    /// Unix timestamp (seconds) when the group was created.
    pub created_at: u64,

    /// Unix timestamp (seconds) when the current cycle started.
    /// Used together with `cycle_duration` to calculate when the cycle ends.
    pub cycle_start_time: u64,

    /// Maximum number of members allowed in the group.
    /// Must be between 2 and 100 (inclusive).
    pub max_members: u32,

    /// Current cycle number, starts at 1 and increments after each payout.
    pub current_cycle: u32,

    /// Zero-based index into `members` indicating who receives the next payout.
    /// When `payout_index == members.len()`, the group is complete.
    pub payout_index: u32,

    /// Whether the group has completed all payout cycles.
    /// Once `true`, no further contributions or payouts are accepted.
    pub is_complete: bool,
}

/// Comprehensive snapshot of a group's current state.
///
/// Returned by [`crate::contract::AjoContract::get_group_status`] to give callers a single
/// consolidated view without having to make multiple queries.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupStatus {
    /// The unique identifier of the group being described.
    pub group_id: u64,

    /// Current cycle number (1-based). Increments after each successful payout.
    pub current_cycle: u32,

    /// `true` if there is a valid next recipient (i.e., the group is not yet complete).
    /// When `false`, `next_recipient` is a placeholder and should be ignored.
    pub has_next_recipient: bool,

    /// Address of the member scheduled to receive the next payout.
    /// Only meaningful when `has_next_recipient` is `true`.
    pub next_recipient: Address,

    /// Number of members who have already contributed in the current cycle.
    pub contributions_received: u32,

    /// Total number of members currently in the group.
    pub total_members: u32,

    /// Addresses of members who have not yet contributed in the current cycle.
    pub pending_contributors: Vec<Address>,

    /// Whether the group has finished all cycles and is closed.
    pub is_complete: bool,

    /// Whether the current cycle window is still open for contributions.
    /// `false` means the cycle has expired and a payout can be triggered.
    pub is_cycle_active: bool,

    /// Unix timestamp (seconds) when the current cycle started.
    pub cycle_start_time: u64,

    /// Unix timestamp (seconds) when the current cycle ends (`cycle_start_time + cycle_duration`).
    pub cycle_end_time: u64,

    /// The ledger timestamp at the moment this status was queried.
    pub current_time: u64,
}
