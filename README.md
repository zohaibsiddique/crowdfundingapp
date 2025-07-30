Here’s your updated `README.md` for the **Crowdfunding App**, combining your existing smart contract description with clear frontend + contract usage instructions:

---

# 🧠 Crowdfunding App – Fullstack dApp (Smart Contract + Frontend)

The **Crowdfunding App** is a full-featured decentralized fundraising platform that combines an Ethereum smart contract with a modern React-based frontend. It allows campaign creators to launch, manage, and monitor tier-based fundraising efforts in a secure, transparent, and user-friendly way.

---

## ⚙️ Features

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

---

## 🧪 Technologies Used

* Solidity + Hardhat (for smart contract development)
* Ethers.js (for frontend interaction)
* React + Vite + TailwindCSS (frontend interface)
* ShadCN UI (for components)
* Hardhat Ignition (for deployment automation)

---

## 🚀 How to Run Locally

### 🧾 Prerequisites

* Node.js (>= 18.x)
* npm
* Hardhat (`npm install --save-dev hardhat`)
* Metamask or other Ethereum wallet for testing

---

### 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/crowdfunding-dapp.git
cd crowdfunding-dapp

# 2. Install dependencies
npm install

# 3. Start local Hardhat network (in project root)
npx hardhat node
```

---

### 🚀 Deploy Smart Contract

```bash
# 4. In a new terminal, deploy the contract using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/Token.js --network localhost
```

> 🔁 Replace `localhost` with your desired network like `sepolia` or `goerli` if deploying to testnets.

---

### 💻 Start Frontend

```bash
# 5. Go to frontend directory
cd frontend

# 6. Run the development server
npm run dev
```

The app will now be available at `http://localhost:5173` (or as specified by Vite).

---

## 🧑‍💻 Developer Notes

* Contract addresses and ABI are automatically picked from the deployment output or environment variables.
* Supports dynamic UI state changes based on contract state: campaign success, failure, refunds, etc.
* Includes fallback error messages for common reverts like `Contract is paused.`

---

## 📄 License

MIT License – feel free to fork and build on it!

---

Let me know if you want me to also include `.env` example or environment setup guide.
