use soroban_sdk::{contracttype, Address, Vec};

/// Represents an Ajo group configuration and state
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    /// Unique group identifier
    pub id: u64,
    
    /// Creator of the group
    pub creator: Address,
    
    /// Fixed contribution amount per member per cycle (in stroops for XLM)
    pub contribution_amount: i128,
    
    /// Duration of each cycle in seconds
    pub cycle_duration: u64,
    
    /// Maximum number of members allowed
    pub max_members: u32,
    
    /// Current list of member addresses
    pub members: Vec<Address>,
    
    /// Current cycle number (starts at 1)
    pub current_cycle: u32,
    
    /// Index of member who receives payout next (0-based)
    pub payout_index: u32,
    
    /// Timestamp when the group was created
    pub created_at: u64,
    
    /// Timestamp when the current cycle started
    pub cycle_start_time: u64,
    
    /// Whether the group has completed all cycles
    pub is_complete: bool,
    
    /// Whether the group was cancelled by its creator
    pub is_cancelled: bool,
}

/// Contribution status for a specific member in a specific cycle
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContributionRecord {
    pub member: Address,
    pub group_id: u64,
    pub cycle: u32,
    pub has_paid: bool,
    pub timestamp: u64,
}

/// Payout record for tracking who has received their payout
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutRecord {
    pub member: Address,
    pub group_id: u64,
    pub cycle: u32,
    pub amount: i128,
    pub timestamp: u64,
}
/// Comprehensive status information for a group
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GroupStatus {
    /// Current cycle number
    pub current_cycle: u32,
    
    /// Address of the member who will receive the next payout
    pub next_recipient: Address,
    
    /// List of members who still need to contribute for the current cycle
    pub contributions_pending: Vec<Address>,
}
