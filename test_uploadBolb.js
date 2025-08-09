import { createHash } from 'crypto';
import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';
import walrus from 'walrus-sdk'; // Adjust import if needed

async function generateBlobId(contentBuffer) {
  // Hash the content using SHA-256
  const hash = await sha256.digest(contentBuffer);
  
  // Create a CIDv1 using RAW codec + SHA-256 hash
  const cid = CID.create(1, raw.code, hash);
  
  return cid.toString(); // This is your blob ID (e.g., bafkreigh2akisc...)
}

async function uploadBlob(filePath) {
  const fs = await import('fs');
  const contentBuffer = fs.readFileSync(filePath);

  // Generate a valid blob ID
  const blobId = await generateBlobId(contentBuffer);
  console.log("Generated Blob ID:", blobId);

  // Upload to Walrus
  const client = walrus({ endpoint: 'https://your-walrus-node' });
  const result = await client.writeBlob({
    blobId,
    data: contentBuffer
  });

  console.log("Upload result:", result);
}

// Example usage:
uploadBlob('./example.txt')
  .catch(console.error);

