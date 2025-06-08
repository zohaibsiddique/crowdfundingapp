# Crowdfunding app

The **Crowdfunding smart contract** enables the creation and management of a single, flexible, tier-based fundraising campaign on the Ethereum blockchain. Each campaign is initialized with essential metadata including a name, description, funding goal, and a deadline defined in days. The campaign owner holds administrative privileges such as managing contribution tiers, pausing or resuming the campaign, withdrawing funds, and extending the deadline if the campaign is still active. The contract supports **tiered contributions**, allowing the owner to define multiple funding levels with specific names and fixed contribution amounts. Contributors (backers) can select a tier to fund by sending the exact required ETH value; their total contributions and funded tiers are securely recorded.

The contract includes a **campaign state machine** that automatically transitions between three states — Active, Successful, and Failed — based on whether the funding goal has been met and if the deadline has passed. If the goal is met in time, the owner is allowed to withdraw the raised funds. If the campaign fails (i.e., the goal is not met by the deadline), users can **claim refunds** of their contributions. A pause mechanism is integrated, allowing the campaign to be temporarily halted, during which contributions are blocked to protect against unforeseen issues or abuse. Additionally, the contract provides several helper functions to query the campaign’s balance, get a list of tiers, check tier participation by a user, and determine the current campaign status based on live data. This combination of features makes the contract a well-structured foundation for running decentralized crowdfunding efforts with clear access control and fund management logic.

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

