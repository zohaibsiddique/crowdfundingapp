# Crowdfunding app

| Feature                | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| Campaign metadata      | Name, description, goal, deadline, owner               |
| Tier system            | Custom funding levels with set prices                  |
| Contribution tracking  | Tracks user funding per tier                           |
| Campaign lifecycle     | Active → Successful/Failed based on goal & deadline    |
| Refunds                | Users can reclaim funds if campaign fails              |
| Withdrawal             | Owner can withdraw ETH if campaign succeeds            |
| Pausable               | Owner can pause/unpause the contract                   |
| Deadline extension     | Owner can extend time during active phase              |
| State-checking helpers | `getCampaignStatus`, `getTiers`, `hasFundedTier`, etc. |

