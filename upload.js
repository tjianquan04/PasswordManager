import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { WalrusClient, WalrusFile } from '@mysten/walrus';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Usage: npm run upload -- <file_path> [epochs]');
    process.exit(1);
  }
  const epochsArg = process.argv[3];
  const epochs = epochsArg ? Number(epochsArg) : 3;
  if (!Number.isFinite(epochs) || epochs <= 0) {
    console.error('Invalid epochs value. Provide a positive integer.');
    process.exit(1);
  }

  const resolvedPath = path.resolve(fileArg);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }
  const contents = fs.readFileSync(resolvedPath);

  const suiRpc = process.env.SUI_RPC_URL || getFullnodeUrl('testnet');
  const suiClient = new SuiClient({ url: suiRpc });

  const priv = process.env.SUI_PRIVATE_KEY;
  if (!priv) {
    console.error('Missing SUI_PRIVATE_KEY in environment. Accepted formats: suiprivkey..., 0x<hex 32-byte>, or base64.');
    process.exit(1);
  }

  const keypair = parsePrivateKeyToKeypair(priv);

  const walrus = new WalrusClient({ network: 'testnet', suiClient });

  const file = WalrusFile.from(contents, {
    identifier: path.basename(resolvedPath),
    tags: { 'content-type': guessContentType(resolvedPath) },
  });

  try {
    const [result] = await walrus.writeFiles({ files: [file], epochs, deletable: true, signer: keypair });
    console.log(result.blobId);
  } catch (err) {
    console.error('Upload failed:', err?.message || err);
    process.exit(1);
  }
}

function parsePrivateKeyToKeypair(value) {
  // suiprivkey... (bech32)
  if (value.startsWith('suiprivkey')) {
    const parsed = decodeSuiPrivateKey(value);
    return Ed25519Keypair.fromSecretKey(parsed.secretKey);
  }
  // 0x... hex (strip 0x)
  if (/^0x[0-9a-fA-F]+$/.test(value)) {
    const hex = value.slice(2);
    const bytes = hexStringToBytes(hex);
    const seed = bytes.length === 32 ? bytes : bytes.slice(0, 32);
    return Ed25519Keypair.fromSecretKey(seed);
  }
  // base64
  try {
    const b = Buffer.from(value, 'base64');
    if (b.length > 0) {
      const seed = b.length === 32 ? new Uint8Array(b) : new Uint8Array(b.slice(0, 32));
      return Ed25519Keypair.fromSecretKey(seed);
    }
  } catch (_) {
    // fall through
  }
  console.error('Unrecognized SUI_PRIVATE_KEY format. Use suiprivkey..., 0x<hex>, or base64.');
  process.exit(1);
}

function hexStringToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex length');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

function guessContentType(p) {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case '.txt':
    case '.log':
    case '.md':
      return 'text/plain';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

main();


