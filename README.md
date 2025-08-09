🔐 Secure Password Manager with Walrus + Seal

A password manager implementation using Walrus (decentralized storage) and Seal (threshold encryption) as backend infrastructure.

## Features

### 🔒 Security Architecture
- **Seal Encryption**: Threshold cryptography with distributed key management
- **Walrus Storage**: Decentralized, fault-tolerant blob storage  
- **Session Keys**: Time-limited access control for decryption
- **On-chain Authorization**: Blockchain-based access verification

### 📱 User Interface
- **Password Manager**: Store/retrieve passwords with master password protection
- **File Upload**: Optional Seal encryption for regular file uploads
- **Blob Retrieval**: Automatic detection and decryption of encrypted content

## Prerequisites
- Node.js 18+
- Sui Wallet (with SUI tokens for transactions)
- Modern web browser

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:** http://localhost:5173

## Usage

### Password Manager
1. **Connect Wallet**: Click "Connect" and select your Sui wallet
2. **Set Master Password**: Enter a master password for encrypting/decrypting passwords
3. **Add Password**: 
   - Enter service name (e.g., "Gmail", "Facebook")
   - Enter username/email
   - Enter password to store
   - Click "🔒 Encrypt & Store Password"
4. **Retrieve Password**: Click "🔓 Decrypt & View" on any stored password

### Regular File Upload (Optional Encryption)
1. **Enable Encryption**: Check "Enable Seal Encryption" 
2. **Set Password**: Enter encryption password
3. **Upload**: Select file or paste text
4. **Retrieve**: Use blob ID to fetch and decrypt

## Command Line Upload (Legacy)

```powershell
$env:SUI_PRIVATE_KEY = "suiprivkey1..."
npm run upload -- <path-to-file> [epochs]
```

## Security Features

- **Threshold Encryption**: Data encrypted across multiple key servers
- **No Single Point of Failure**: Distributed key management prevents single server compromise  
- **On-chain Access Control**: Wallet signatures required for decryption
- **Time-limited Sessions**: Session keys expire automatically
- **Zero-knowledge Architecture**: Key servers cannot read your data

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Storage**: Walrus (Mysten Labs)
- **Encryption**: Seal SDK (Mysten Labs)  
- **Blockchain**: Sui Network (Testnet)
- **Wallet**: Sui dApp Kit

---

**⚠️ Testnet Warning**: This is a demo on Sui Testnet. Do not store real passwords or sensitive data.


