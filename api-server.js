import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Endpoint to validate wallet address
app.get('/api/validate-wallet/:address', (req, res) => {
  try {
    const walletAddress = req.params.address.toLowerCase();
    const walletFilePath = path.join(__dirname, 'wallet.txt');
    
    // Read wallet.txt file
    if (!fs.existsSync(walletFilePath)) {
      return res.status(500).json({ 
        error: 'Wallet authorization file not found',
        authorized: false 
      });
    }
    
    const allowedAddresses = fs.readFileSync(walletFilePath, 'utf8')
      .split('\n')
      .map(addr => addr.trim().toLowerCase())
      .filter(addr => addr.length > 0);
    
    const isAuthorized = allowedAddresses.includes(walletAddress);
    
    res.json({
      authorized: isAuthorized,
      address: req.params.address
    });
    
  } catch (error) {
    console.error('Error validating wallet:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      authorized: false 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Wallet validation API is running' });
});

app.listen(PORT, () => {
  console.log(`Wallet validation API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
