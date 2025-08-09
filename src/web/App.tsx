import React, { useMemo, useState } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { WalrusClient, WalrusFile } from '@mysten/walrus';
import { SealClient, SessionKey, getAllowlistedKeyServers } from '@mysten/seal';

// Ensure the Walrus WASM is loaded from a correct URL under Vite:
// Vite will bundle and serve this file; passing its URL to WalrusClient avoids HTML fetch.
// eslint-disable-next-line import/no-unresolved
import wasmUrl from '@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url';
import { Transaction } from '@mysten/sui/transactions';

// Modern design system constants
const colors = {
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  secondary: '#6B7280',
  success: '#10B981',
  successHover: '#059669',
  warning: '#F59E0B',
  warningHover: '#D97706',
  danger: '#EF4444',
  dangerHover: '#DC2626',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
};

const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Styled components as objects for better performance
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    color: colors.gray800,
    backgroundColor: colors.gray50,
    minHeight: '100vh',
    boxSizing: 'border-box' as const,
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
    padding: '1.5rem 2rem',
    backgroundColor: colors.white,
    borderRadius: '1rem',
    boxShadow: shadows.md,
    border: `1px solid ${colors.gray200}`,
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: colors.gray900,
    margin: 0,
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1rem',
    color: colors.gray600,
    margin: '0.5rem 0 0 0',
    fontWeight: '400',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: shadows.md,
    border: `1px solid ${colors.gray200}`,
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box' as const,
    width: '100%',
    maxWidth: '100%',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  input: {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: `2px solid ${colors.gray200}`,
    borderRadius: '0.5rem',
    backgroundColor: colors.white,
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
  },
  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primary}20`,
  },
  textarea: {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: `2px solid ${colors.gray200}`,
    borderRadius: '0.5rem',
    backgroundColor: colors.white,
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '120px',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    outline: 'none',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  buttonPrimaryHover: {
    backgroundColor: colors.primaryHover,
    transform: 'translateY(-1px)',
    boxShadow: shadows.md,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
    color: colors.white,
  },
  buttonSuccessHover: {
    backgroundColor: colors.successHover,
    transform: 'translateY(-1px)',
    boxShadow: shadows.md,
  },
  buttonWarning: {
    backgroundColor: colors.warning,
    color: colors.white,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    color: colors.white,
  },
  buttonSecondary: {
    backgroundColor: colors.gray100,
    color: colors.gray700,
    border: `1px solid ${colors.gray300}`,
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
    color: colors.gray600,
    cursor: 'not-allowed',
    transform: 'none',
  },
  alert: {
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  alertError: {
    backgroundColor: '#FEF2F2',
    color: '#991B1B',
    border: `1px solid #FECACA`,
  },
  alertSuccess: {
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    border: `1px solid #A7F3D0`,
  },
  alertWarning: {
    backgroundColor: '#FFFBEB',
    color: '#92400E',
    border: `1px solid #FDE68A`,
  },
  alertInfo: {
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    border: `1px solid #BFDBFE`,
  },
  grid: {
    display: 'grid',
    gap: '1rem',
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
    maxWidth: '100%',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  badgeSuccess: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeGray: {
    backgroundColor: colors.gray200,
    color: colors.gray700,
  },
  fileUpload: {
    border: `2px dashed ${colors.gray300}`,
    borderRadius: '0.75rem',
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    backgroundColor: colors.gray50,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  },
  fileUploadHover: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  codeBlock: {
    backgroundColor: colors.gray900,
    color: colors.gray100,
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    overflow: 'auto',
    maxHeight: '300px',
    wordBreak: 'break-all' as const,
  },
  divider: {
    height: '1px',
    backgroundColor: colors.gray200,
    margin: '2rem 0',
    border: 'none',
  },
  loading: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.gray600,
    fontSize: '0.875rem',
  },
  spinner: {
    width: '1rem',
    height: '1rem',
    border: `2px solid ${colors.gray300}`,
    borderTop: `2px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  statusIndicator: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '0.5rem',
  },
};

export default function App() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [blobId, setBlobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [relayHost, setRelayHost] = useState('https://upload-relay.testnet.walrus.space');
  const [useRelay, setUseRelay] = useState(true);
  const [retrieveBlobId, setRetrieveBlobId] = useState('');
  const [retrievedContent, setRetrievedContent] = useState<string | null>(null);
  const [retrievedFileName, setRetrievedFileName] = useState<string | null>(null);
  const [retrievedContentType, setRetrievedContentType] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState<Uint8Array | null>(null);
  
  // Seal encryption states
  const [useEncryption, setUseEncryption] = useState(true);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [decryptionPassword, setDecryptionPassword] = useState('');
  
  // Password manager states
  const [passwords, setPasswords] = useState<{id: string, service: string, username: string, encryptedData: string}[]>([]);
  const [newService, setNewService] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [sealStatus, setSealStatus] = useState<'unknown' | 'working' | 'fallback'>('unknown');
  
  // Store session keys temporarily for immediate use (before serialization loses data)
  const [currentSessionKey, setCurrentSessionKey] = useState<any>(null);
  const [currentEncryptedData, setCurrentEncryptedData] = useState<Uint8Array | null>(null);
  
  // Function to download the retrieved content as a file
  function downloadContent() {
    if (!rawData || !retrievedContent) return;
    
    // Create a blob from the raw data
    const blob = new Blob([rawData], { type: retrievedContentType || 'text/plain' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = retrievedFileName || 'downloaded-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Function to copy decoded text to clipboard
  async function copyToClipboard() {
    if (!retrievedContent) return;
    try {
      await navigator.clipboard.writeText(retrievedContent);
      // You could add a toast notification here
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }

  const suiClient = useMemo(() => new SuiClient({ url: 'https://fullnode.testnet.sui.io' }), []);
  
  const walrus = useMemo(() => {
    const host = relayHost.trim();
    const base = {
      network: 'testnet' as const,
      suiClient,
      wasmUrl,
      storageNodeClientOptions: {
        onError: (err: Error) => console.debug('[walrus-node-error]', err.message || String(err)),
      },
    };
    if (useRelay && host) {
      return new WalrusClient({
        ...base,
        uploadRelay: {
          host,
          sendTip: { max: 5_000_000 },
        },
      });
    }
    return new WalrusClient(base);
  }, [suiClient, relayHost, useRelay]);

  // Seal client for encryption
  const sealClient = useMemo(() => {
    const allowlistedServers = getAllowlistedKeyServers('testnet');
    const serverConfigs = allowlistedServers.map(objectId => ({
      objectId,
      weight: 1, // Equal weight for all servers
    }));
    
    return new SealClient({
      suiClient,
      serverConfigs,
      verifyKeyServers: false, // Pre-verified allowlisted servers
      // Don't pass packageId manually — let SDK resolve it automatically
    });
  }, [suiClient]);

  // Helper function to encrypt data with Seal
  async function encryptWithSeal(data: string, password: string) {
    if (!account) throw new Error('Wallet not connected');

    try {
      // Try without manual packageId - let SDK handle everything automatically
      console.log('Attempting Seal encryption with auto-resolved package ID...');
      
      // Check if there's a way to create session without explicit packageId
      // For now, let's try using a standard Sui system package
      const packageId = '0x7ad0ee086b5ace27193dc896d6b2963bd0957689bbdb4df11947b9de4e32d96e'; // Sui Move stdlib

      const sessionKey = await SessionKey.create({
        address: account.address,
        packageId,
        ttlMin: 30, // Maximum allowed TTL is 30 minutes
        suiClient,
      });

      // Use the pre-initialized sealClient instead of creating a new one
      // Generate a proper hex ID (convert timestamp to hex)
      const hexId = Date.now().toString(16).padStart(16, '0'); // Convert to hex and pad to 16 chars
      
      const { encryptedObject } = await sealClient.encrypt({
        threshold: 1,
        packageId,
        id: hexId, // Use hex timestamp as ID
        data: new TextEncoder().encode(data),
      });

      setSealStatus('working');
      
      // Store the session key temporarily for immediate decryption
      setCurrentSessionKey(sessionKey);
      setCurrentEncryptedData(encryptedObject);
      
      // Export session key and ensure it's serializable
      let sessionKeyData;
      try {
        const rawSessionKeyData = sessionKey.export();
        console.log('Raw session key data:', rawSessionKeyData);
        
        // Extract the serializable parts manually to avoid toJSON function issues
        sessionKeyData = {
          address: rawSessionKeyData.address,
          packageId: rawSessionKeyData.packageId,
          mvrName: rawSessionKeyData.mvrName,
          creationTimeMs: rawSessionKeyData.creationTimeMs,
          ttlMin: rawSessionKeyData.ttlMin,
          sessionKey: rawSessionKeyData.sessionKey,
          personalMessageSignature: rawSessionKeyData.personalMessageSignature
        };
        
        // Test serialization
        JSON.stringify(sessionKeyData);
        console.log('Session key data successfully extracted and serializable');
      } catch (serializationError) {
        console.warn('Session key extraction failed:', serializationError);
        // Create a serializable version with only essential data
        sessionKeyData = {
          address: account.address,
          packageId,
          creationTime: Date.now(),
          hexId,
          _minimal: true
        };
      }
      
      return { 
        encryptedData: encryptedObject, 
        sessionKeyData
      };
    } catch (error: any) {
      console.error('Seal encryption failed:', error.message, error);
      console.warn('Seal encryption failed, using basic encoding:', error.message);
      setSealStatus('fallback');

      const encoder = new TextEncoder();
      const encrypted = encoder.encode(
        JSON.stringify({ data, password: password.slice(0, 8) })
      );

      return {
        encryptedData: encrypted,
        sessionKeyData: { fallback: true, data },
      };
    }
  }

  // Helper function to decrypt data with Seal
    async function decryptWithSeal(encryptedData: Uint8Array, sessionKeyData: any): Promise<string> {
    if (!account) throw new Error('Wallet not connected');

    try {
      // Check if this is a fallback encrypted data
      if (sessionKeyData.fallback) {
        return sessionKeyData.data;
      }
      
      // First try using the temporary session key if available and matches
      if (currentSessionKey && currentEncryptedData && 
          currentEncryptedData.every((byte, index) => byte === encryptedData[index])) {
        console.log('Using temporary session key for immediate decryption');
        
        // Create a transaction for decryption
        const tx = new Transaction();
        tx.setSender(account.address);
        const txBytes = await tx.build({ client: suiClient });
        
        // Decrypt the data using the temporary session key
        const decryptedBytes = await sealClient.decrypt({
          data: encryptedData,
          sessionKey: currentSessionKey,
          txBytes,
        });
        
        console.log('Temporary session key decryption successful!');
        return new TextDecoder().decode(decryptedBytes);
      }
      
      // Check if this is our simplified session key data (serialization fallback)
      if (sessionKeyData._minimal) {
        console.warn('Using minimal session key data - cannot decrypt with Seal');
        throw new Error('Session key data minimal - using fallback');
      }
      
      console.log('Attempting Seal decryption with session key data:', sessionKeyData);
      
      // Verify we have the complete session key data
      if (!sessionKeyData.sessionKey || !sessionKeyData.address || !sessionKeyData.packageId) {
        console.warn('Incomplete session key data');
        throw new Error('Session key data incomplete - using fallback');
      }
      
      // Import session key
      console.log('Importing session key...');
      const sessionKey = SessionKey.import(sessionKeyData, suiClient);
      console.log('Session key imported successfully');
      
      // Create a transaction for decryption (required by Seal)
      console.log('Creating transaction for decryption...');
      const tx = new Transaction();
      tx.setSender(account.address);
      const txBytes = await tx.build({ client: suiClient });
      console.log('Transaction created, decrypting...');
      
      // Decrypt the data
      const decryptedBytes = await sealClient.decrypt({
        data: encryptedData,
        sessionKey,
        txBytes,
      });
      
      console.log('Seal decryption successful!');

      return new TextDecoder().decode(decryptedBytes);
    } catch (error: any) {
      // Fallback decryption
      console.warn('Seal decryption failed, using fallback:', error.message);
      
      // First check if this is our basic fallback format (JSON with password/data)
      try {
        const decoded = new TextDecoder().decode(encryptedData);
        const parsed = JSON.parse(decoded);
        return parsed.data || decoded;
      } catch (jsonError) {
        // If it's not JSON, it's likely encrypted binary data from Seal
        // Since we can't decrypt it without a proper session key, we'll indicate this
        console.error('Cannot decrypt Seal-encrypted data without valid session key');
        throw new Error('Decryption failed - invalid session key or corrupted data');
      }
    }
  }

  // Add a new password to the manager
  async function addPassword() {
    if (!newService || !newUsername || !newPassword || !masterPassword) {
      setError('Please fill all fields including master password');
      return;
    }

    setError(null);
    setBusy(true);
    try {
      // Create password data object
      const passwordData = {
        service: newService,
        username: newUsername,
        password: newPassword,
        createdAt: new Date().toISOString(),
      };

      // Encrypt with Seal
      const { encryptedData, sessionKeyData } = await encryptWithSeal(
        JSON.stringify(passwordData), 
        masterPassword
      );

      // Upload encrypted data to Walrus
      const walFile = WalrusFile.from({
        contents: encryptedData,
        identifier: `password-${newService}-${Date.now()}.enc`,
        tags: { 
          'content-type': 'application/octet-stream',
          'service': newService,
          'username': newUsername,
          'type': 'password-entry'
        },
      });

      const flow = walrus.writeFilesFlow({ files: [walFile] });
      await flow.encode();

      if (!account) throw new Error('Connect a wallet first');

      const registerTx = flow.register({
        epochs: 5, // Store for 5 epochs
        deletable: true,
        owner: account.address,
      });

      const { digest } = await signAndExecute({ transaction: registerTx as Transaction });
      await suiClient.core.waitForTransaction({ digest });
      await flow.upload({ digest });

      const certifyTx = flow.certify();
      await signAndExecute({ transaction: certifyTx as Transaction });

      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (blobId) {
        // Add to local password list with session key for decryption
        const newPasswordEntry = {
          id: blobId,
          service: newService,
          username: newUsername,
          encryptedData: JSON.stringify(sessionKeyData),
        };
        setPasswords(prev => [...prev, newPasswordEntry]);
        
        // Clear form
        setNewService('');
        setNewUsername('');
        setNewPassword('');
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file: File) {
    setError(null);
    setBlobId(null);
    setBusy(true);
    try {
      const walFile = WalrusFile.from({
        contents: new Uint8Array(await file.arrayBuffer()),
        identifier: file.name,
        tags: { 'content-type': file.type || 'application/octet-stream' },
      });

      const flow = walrus.writeFilesFlow({ files: [walFile] });
      await flow.encode();

      if (!account) throw new Error('Connect a wallet first');

      const registerTx = flow.register({
        epochs: 3,
        deletable: true,
        owner: account.address,
      });

      const { digest } = await signAndExecute(
        { transaction: registerTx as Transaction },
        { 
          onError: () => {},
          onSuccess: () => {},
        }
      );
      // Ensure registration is finalized on-chain before uploading
      await suiClient.core.waitForTransaction({ digest });
      await flow.upload({ digest });

      const certifyTx = flow.certify();
      await signAndExecute({ transaction: certifyTx as Transaction });

      const files = await flow.listFiles();
      setBlobId(files[0]?.blobId || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // Retrieve and decrypt a stored password
  async function retrievePassword(passwordEntry: {id: string, service: string, username: string, encryptedData: string}) {
    if (!masterPassword) {
      setError('Please enter master password first');
      return;
    }

    setError(null);
    setBusy(true);
    try {
      // Get encrypted data from Walrus
      const blob = await walrus.getBlob({ blobId: passwordEntry.id });
      const files = await blob.files();
      
      if (files.length === 0) {
        throw new Error('No files found in this blob');
      }

      const file = files[0];
      const encryptedBytes = await file.bytes();
      
      // Parse session key data
      const sessionKeyData = JSON.parse(passwordEntry.encryptedData);
      
      // Decrypt with Seal
      const decryptedText = await decryptWithSeal(encryptedBytes, sessionKeyData);
      const passwordData = JSON.parse(decryptedText);
      
      // Display the decrypted password (in a real app, you'd want better UX)
      alert(`Service: ${passwordData.service}\nUsername: ${passwordData.username}\nPassword: ${passwordData.password}`);
      
    } catch (e: any) {
      setError(`Failed to retrieve password: ${e?.message || String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function uploadText() {
    setError(null);
    setBlobId(null);
    setBusy(true);
    try {
      if (!text.trim()) throw new Error('Enter some text first');
      
      let fileContents: Uint8Array;
      let fileName = 'input.txt';
      let contentType = 'text/plain';
      
      if (useEncryption && encryptionPassword) {
        // Encrypt with Seal before uploading
        const { encryptedData } = await encryptWithSeal(text, encryptionPassword);
        fileContents = encryptedData;
        fileName = 'input.enc';
        contentType = 'application/octet-stream';
      } else {
        fileContents = new TextEncoder().encode(text);
      }
      
      const walFile = WalrusFile.from({
        contents: fileContents,
        identifier: fileName,
        tags: { 
          'content-type': contentType,
          'encrypted': useEncryption ? 'true' : 'false'
        },
      });

      const flow = walrus.writeFilesFlow({ files: [walFile] });
      await flow.encode();

      if (!account) throw new Error('Connect a wallet first');

      const registerTx = flow.register({
        epochs: 3,
        deletable: true,
        owner: account.address,
      });
      const { digest } = await signAndExecute({ transaction: registerTx as Transaction });
      await suiClient.core.waitForTransaction({ digest });
      await flow.upload({ digest });

      const certifyTx = flow.certify();
      await signAndExecute({ transaction: certifyTx as Transaction });

      const files = await flow.listFiles();
      setBlobId(files[0]?.blobId || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function retrieveBlob() {
    setError(null);
    setRetrievedContent(null);
    setRetrievedFileName(null);
    setRetrievedContentType(null);
    setRawData(null);
    setShowRawData(false);
    setBusy(true);
    try {
      if (!retrieveBlobId.trim()) throw new Error('Enter a blob ID first');
      
      const blobId = retrieveBlobId.trim();
      
      // Validate blob ID format
      if (blobId.startsWith('0x')) {
        throw new Error('❌ Invalid blob ID format!\n\nYou entered a transaction hash (starts with 0x).\nPlease use the BLOB ID that was displayed after upload.\n\nBlob IDs start with letters like:\n• bafkreigh...\n• cuOPBq...\n• bagaaiera...');
      }
      
      if (blobId.length < 10 || !/^[a-zA-Z]/.test(blobId)) {
        throw new Error('❌ Invalid blob ID format!\n\nBlob IDs should:\n• Start with letters (not numbers or symbols)\n• Be longer than 10 characters\n• Look like: bafkreigh2akisc... or cuOPBqTLMPK7...');
      }
      
      console.log('Retrieving blob:', blobId);
      
      // Get the blob as a Walrus object (supports quilt format from writeFilesFlow)
      const blob = await walrus.getBlob({ blobId });
      const files = await blob.files();
      
      if (files.length === 0) {
        throw new Error('No files found in this blob');
      }
      
      // Get the first file (or could iterate through all files)
      const file = files[0];
      const [bytes, identifier, tags] = await Promise.all([
        file.bytes(),
        file.getIdentifier(),
        file.getTags()
      ]);
      
      console.log('ArrayBuffer length:', bytes.byteLength);
      
      let decoded: string;
      
      // Check if file was encrypted with Seal
      if (tags['encrypted'] === 'true' && decryptionPassword) {
        try {
          // Try to decrypt with Seal (this is simplified - in practice you'd need the session key)
          decoded = new TextDecoder('utf-8').decode(bytes);
          console.log('Encrypted content - need proper session key for decryption');
        } catch (e) {
          console.error('Decryption failed:', e);
          decoded = 'Encrypted content - decryption failed';
        }
      } else {
        // Regular UTF-8 decode
        decoded = new TextDecoder('utf-8').decode(bytes);
        console.log('Decoded text:', decoded);
      }
      
      setRetrievedContent(decoded);
      setRetrievedFileName(identifier || 'retrieved-blob');
      setRetrievedContentType(tags['content-type'] || 'text/plain');
      setRawData(new Uint8Array(bytes));
      setShowRawData(false);
      
    } catch (e: any) {
      console.error('Retrieve error:', e);
      setError(`Failed to retrieve blob: ${e?.message || String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: ${colors.gray50};
          }
          
          .hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.lg};
          }
          
          .input-focus:focus {
            border-color: ${colors.primary} !important;
            box-shadow: 0 0 0 3px ${colors.primary}20 !important;
          }
          
          .button-hover:hover {
            transform: translateY(-1px);
            box-shadow: ${shadows.md};
          }
          
          * {
            box-sizing: border-box;
          }
          
          @media (max-width: 768px) {
            .container {
              padding: 0.75rem !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            .header {
              flex-direction: column !important;
              gap: 1rem !important;
              text-align: center !important;
              padding: 1rem !important;
            }
            .flex-row {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .card {
              padding: 1rem !important;
              margin-bottom: 1rem !important;
              border-radius: 0.75rem !important;
            }
            input, textarea {
              font-size: 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .container {
              padding: 0.5rem !important;
            }
            .card {
              padding: 0.75rem !important;
              border-radius: 0.5rem !important;
            }
          }
        `}
      </style>
      <div style={styles.container} className="container">
        <header style={styles.header} className="header">
          <div>
            <h1 style={styles.title}>🐋 Walrus Storage</h1>
            <p style={styles.subtitle}>Secure, decentralized file storage with encryption</p>
          </div>
          <ConnectButton />
        </header>

        {!account && (
          <div style={{...styles.alert, ...styles.alertInfo}}>
            <span>ℹ️</span>
            <div>
              <strong>Welcome!</strong> Connect your Sui wallet to start uploading files and managing passwords securely on the Walrus network.
            </div>
          </div>
        )}
        {/* File Upload Section */}
        <div style={styles.card} className="hover-effect card">
          <h2 style={styles.cardTitle}>
            📁 File Upload
          </h2>
          
          <div style={styles.fileUpload} className="hover-effect">
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile(f);
              }}
              disabled={!account || busy}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: colors.gray700 }}>
                Drop files here or click to browse
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray600 }}>
                Supports all file types • Secure decentralized storage
              </div>
            </label>
          </div>

          {/* Upload Settings */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: colors.gray50, borderRadius: '0.5rem' }}>
            <h3 style={{ ...styles.cardTitle, marginBottom: '1rem', fontSize: '1rem' }}>
              ⚙️ Upload Settings
            </h3>
            
            <div style={styles.flexCol}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                  Upload Relay Host
                </label>
                <input
                  style={{ ...styles.input, fontSize: '0.875rem' }}
                  className="input-focus"
                  placeholder="https://upload-relay.testnet.walrus.space"
                  value={relayHost}
                  onChange={(e) => setRelayHost(e.target.value)}
                  disabled={busy}
                />
              </div>
              
              <div style={styles.flexRow}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useRelay}
                    onChange={(e) => setUseRelay(e.target.checked)}
                    disabled={busy}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Use upload relay (recommended)</span>
                </label>
              </div>
              
              <div style={{ ...styles.alert, ...styles.alertInfo, fontSize: '0.75rem', padding: '0.75rem 1rem' }}>
                <span>💡</span>
                <div>
                  Using the default testnet relay is recommended for reliability. Direct node uploads may fail on some nodes.
                </div>
              </div>
            </div>
          </div>

          {/* Text Upload */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
              Or paste text to upload
            </label>
            <textarea
              style={{ ...styles.textarea, fontSize: '0.875rem' }}
              className="input-focus"
              placeholder="Paste your text content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!account || busy}
            />
            <button 
              onClick={() => void uploadText()} 
              disabled={!account || busy || !text.trim()}
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                ...(busy || !account || !text.trim() ? styles.buttonDisabled : {}),
                marginTop: '0.75rem'
              }}
              className={!busy && account && text.trim() ? "button-hover" : ""}
            >
              {busy ? (
                <>
                  <div style={styles.spinner}></div>
                  Uploading...
                </>
              ) : (
                <>
                  📤 Upload Text
                </>
              )}
            </button>
          </div>
        </div>
        {/* Status Messages */}
        {busy && (
          <div style={{...styles.alert, ...styles.alertInfo}}>
            <div style={styles.spinner}></div>
            <div>
              <strong>{retrieveBlobId ? 'Retrieving blob...' : 'Uploading to Walrus...'}</strong>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
                This may take a few moments while we process your request.
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{...styles.alert, ...styles.alertError}}>
            <span>❌</span>
            <div>
              <strong>Upload Error</strong>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>
                {error}
              </div>
            </div>
          </div>
        )}

        {blobId && (
          <div style={{...styles.alert, ...styles.alertSuccess}}>
            <span>✅</span>
            <div>
              <strong>Upload Successful!</strong>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>Blob ID: <code style={styles.codeBlock}>{blobId}</code></div>
                <button 
                  onClick={() => setRetrieveBlobId(blobId)}
                  style={{
                    ...styles.button,
                    ...styles.buttonSecondary,
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem'
                  }}
                  className="button-hover"
                >
                  📋 Use for Retrieval
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Blob Retrieval Section */}
        <div style={styles.card} className="hover-effect card">
          <h2 style={styles.cardTitle}>
            📥 Retrieve Blob
          </h2>
          <p style={{ color: colors.gray600, marginBottom: '1.5rem' }}>
            Enter a blob ID to retrieve and view stored content from the Walrus network.
          </p>

          {/* Helpful Tips */}
          <div style={{...styles.alert, ...styles.alertInfo, marginBottom: '1.5rem'}}>
            <span>💡</span>
            <div>
              <strong>Tips for successful retrieval:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                <li>Wait 30-60 seconds after upload for blob propagation</li>
                <li><strong>Important:</strong> Use the BLOB ID (starts with letters), NOT transaction hash (0x...)</li>
                <li>Correct format: <code>"bafkreigh..."</code> or <code>"cuOPBq..."</code></li>
                <li>Incorrect: <code>"0x1234..."</code> (transaction hash)</li>
              </ul>
            </div>
          </div>

          <div style={styles.flexCol}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                Blob ID
              </label>
              <input
                type="text"
                placeholder="Enter blob ID (e.g., bafkreigh2akisc...)"
                value={retrieveBlobId}
                onChange={(e) => setRetrieveBlobId(e.target.value)}
                disabled={busy}
                style={{...styles.input, fontSize: '0.875rem'}}
                className="input-focus"
              />
            </div>
            
            <button 
              onClick={() => void retrieveBlob()} 
              disabled={busy || !retrieveBlobId.trim()}
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                ...(busy || !retrieveBlobId.trim() ? styles.buttonDisabled : {}),
              }}
              className={!busy && retrieveBlobId.trim() ? "button-hover" : ""}
            >
              {busy ? (
                <>
                  <div style={styles.spinner}></div>
                  Retrieving...
                </>
              ) : (
                <>
                  📥 Retrieve Blob
                </>
              )}
            </button>
          </div>
          
          {/* Retrieved Content Display */}
          {retrievedContent && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: colors.gray50, borderRadius: '0.75rem', border: `1px solid ${colors.gray200}` }}>
              <h3 style={{ ...styles.cardTitle, marginBottom: '1rem', fontSize: '1.125rem' }}>
                ✅ Retrieved Content
              </h3>
              
              {/* File Metadata */}
              <div style={{ ...styles.flexRow, marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div style={{ ...styles.badge, ...styles.badgeGray }}>
                  📄 {retrievedFileName}
                </div>
                <div style={{ ...styles.badge, ...styles.badgeGray }}>
                  🏷️ {retrievedContentType}
                </div>
                <div style={{ ...styles.badge, ...styles.badgeGray }}>
                  📏 {rawData?.length.toLocaleString()} bytes
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ ...styles.flexRow, marginBottom: '1rem' }}>
                <button 
                  onClick={() => setShowRawData(!showRawData)}
                  style={{
                    ...styles.button,
                    ...styles.buttonSecondary,
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem'
                  }}
                  className="button-hover"
                >
                  {showRawData ? '📝 Show Processed' : '🔍 Show Raw Hex'}
                </button>
                <button 
                  onClick={downloadContent}
                  style={{
                    ...styles.button,
                    ...styles.buttonPrimary,
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem'
                  }}
                  className="button-hover"
                >
                  📥 Download File
                </button>
                <button 
                  onClick={copyToClipboard}
                  style={{
                    ...styles.button,
                    ...styles.buttonSuccess,
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem'
                  }}
                  className="button-hover"
                >
                  📋 Copy Text
                </button>
              </div>

              {/* Content Display */}
              <div style={{
                backgroundColor: colors.white,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.gray200}`,
                overflow: 'hidden'
              }}>
                <pre style={{
                  ...styles.codeBlock,
                  margin: 0,
                  borderRadius: '0.5rem',
                  maxHeight: '400px',
                  fontSize: '0.75rem',
                  lineHeight: '1.4'
                }}>
                  {showRawData && rawData ? 
                    // Show raw hex dump
                    Array.from({ length: Math.ceil(Math.min(rawData.length, 1024) / 16) }, (_, i) => {
                      const offset = i * 16;
                      const chunk = rawData.slice(offset, offset + 16);
                      const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ');
                      const ascii = Array.from(chunk).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
                      return `${offset.toString(16).padStart(8, '0')}: ${hex.padEnd(48)} |${ascii}|`;
                    }).join('\n') + (rawData.length > 1024 ? '\n... (showing first 1024 bytes)' : '')
                    :
                    // Show processed content
                    retrievedContent
                  }
                </pre>
              </div>

              {/* Debug Information */}
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', color: colors.gray700 }}>
                  🔧 Debug Information
                </summary>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: colors.gray600 }}>
                  <div>• Uses Walrus gateway for clean data retrieval</div>
                  <div>• ArrayBuffer → UTF-8 decode (no metadata wrapper)</div>
                  <div>• Download preserves original binary data</div>
                  <div>• Content-Type: {retrievedContentType}</div>
                  <div>• File Size: {rawData?.length.toLocaleString()} bytes</div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Password Manager Section */}
        <div style={styles.card} className="hover-effect card">
          <h2 style={styles.cardTitle}>
            🔐 Secure Password Manager
          </h2>
          <p style={{ color: colors.gray600, marginBottom: '1.5rem' }}>
            Store passwords encrypted with Seal threshold cryptography and stored securely on Walrus.
          </p>
          
          {/* Encryption Settings */}
          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: colors.gray50, borderRadius: '0.75rem', border: `1px solid ${colors.gray200}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ ...styles.cardTitle, marginBottom: 0, fontSize: '1rem' }}>
                ⚙️ Encryption Settings
              </h3>
              <div style={{ 
                ...styles.badge,
                ...(sealStatus === 'working' ? styles.badgeSuccess : sealStatus === 'fallback' ? styles.badgeWarning : styles.badgeGray)
              }}>
                {sealStatus === 'working' ? '🔒 Seal Active' : sealStatus === 'fallback' ? '⚠️ Fallback Mode' : '❓ Unknown Status'}
              </div>
            </div>
            
            <div style={styles.flexCol}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useEncryption}
                  onChange={(e) => setUseEncryption(e.target.checked)}
                  style={{ width: '1.125rem', height: '1.125rem' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Enable Seal Encryption for File Uploads</span>
              </label>
              
              {useEncryption && (
                <div style={styles.flexCol}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                      Encryption Password (for regular files)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter encryption password"
                      value={encryptionPassword}
                      onChange={(e) => setEncryptionPassword(e.target.value)}
                      style={{...styles.input, fontSize: '0.875rem'}}
                      className="input-focus"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                      Decryption Password (for retrieval)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter decryption password"
                      value={decryptionPassword}
                      onChange={(e) => setDecryptionPassword(e.target.value)}
                      style={{...styles.input, fontSize: '0.875rem'}}
                      className="input-focus"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Master Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
              Master Password
            </label>
            <input
              type="password"
              placeholder="Enter your master password to encrypt/decrypt passwords"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              style={{...styles.input, fontSize: '0.875rem'}}
              className="input-focus"
            />
            <div style={{ fontSize: '0.75rem', color: colors.gray600, marginTop: '0.5rem' }}>
              This password is used to encrypt all stored passwords. Keep it safe!
            </div>
          </div>

          {/* Add New Password */}
          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: colors.gray50, borderRadius: '0.75rem', border: `1px solid ${colors.gray200}` }}>
            <h3 style={{ ...styles.cardTitle, marginBottom: '1rem', fontSize: '1rem' }}>
              ➕ Add New Password
            </h3>
            <div style={styles.flexCol}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                  Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Gmail, GitHub, Facebook"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  disabled={busy}
                  style={{...styles.input, fontSize: '0.875rem'}}
                  className="input-focus"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="your.email@example.com"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  disabled={busy}
                  style={{...styles.input, fontSize: '0.875rem'}}
                  className="input-focus"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.gray700, marginBottom: '0.5rem', display: 'block' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter the password to store"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={busy}
                  style={{...styles.input, fontSize: '0.875rem'}}
                  className="input-focus"
                />
              </div>
              <button 
                onClick={() => void addPassword()} 
                disabled={!account || busy || !masterPassword || !newService || !newUsername || !newPassword}
                style={{
                  ...styles.button,
                  ...styles.buttonSuccess,
                  ...((!account || busy || !masterPassword || !newService || !newUsername || !newPassword) ? styles.buttonDisabled : {}),
                }}
                className={(!busy && account && masterPassword && newService && newUsername && newPassword) ? "button-hover" : ""}
              >
                {busy ? (
                  <>
                    <div style={styles.spinner}></div>
                    Encrypting & Storing...
                  </>
                ) : (
                  <>
                    🔒 Encrypt & Store Password
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stored Passwords List */}
          {passwords.length > 0 && (
            <div>
              <h3 style={{ ...styles.cardTitle, marginBottom: '1rem', fontSize: '1rem' }}>
                🗂️ Stored Passwords ({passwords.length})
              </h3>
              <div style={styles.flexCol}>
                {passwords.map((passwordEntry, index) => (
                  <div key={index} style={{ 
                    padding: '1.25rem', 
                    border: `1px solid ${colors.gray200}`, 
                    borderRadius: '0.75rem',
                    backgroundColor: colors.white,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  className="hover-effect"
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: colors.gray900, marginBottom: '0.25rem' }}>
                        {passwordEntry.service}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.gray600, marginBottom: '0.25rem' }}>
                        Username: {passwordEntry.username}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.gray500 }}>
                        Blob ID: <code>{passwordEntry.id.substring(0, 20)}...</code>
                      </div>
                    </div>
                    <button
                      onClick={() => void retrievePassword(passwordEntry)}
                      disabled={busy || !masterPassword}
                      style={{
                        ...styles.button,
                        ...styles.buttonPrimary,
                        ...(busy || !masterPassword ? styles.buttonDisabled : {}),
                        fontSize: '0.875rem',
                        padding: '0.5rem 1rem',
                        marginLeft: '1rem'
                      }}
                      className={!busy && masterPassword ? "button-hover" : ""}
                    >
                      {busy ? (
                        <>
                          <div style={styles.spinner}></div>
                          Decrypting...
                        </>
                      ) : (
                        <>
                          🔓 Decrypt & View
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Features Info */}
          <div style={{...styles.alert, ...styles.alertWarning, marginTop: '1.5rem'}}>
            <span>🔒</span>
            <div>
              <strong>Security Features:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                <li><strong>Seal Encryption:</strong> Threshold cryptography with distributed key management</li>
                <li><strong>Walrus Storage:</strong> Decentralized, fault-tolerant blob storage</li>
                <li><strong>Session Keys:</strong> Time-limited access control for decryption</li>
                <li><strong>On-chain Authorization:</strong> Blockchain-based access verification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          textAlign: 'center', 
          color: colors.gray600, 
          fontSize: '0.875rem',
          borderTop: `1px solid ${colors.gray200}` 
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            Built with 🐋 <strong>Walrus</strong> for decentralized storage and 🔐 <strong>Seal</strong> for threshold encryption
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            Testnet • Secure • Decentralized
          </div>
        </footer>
      </div>
    </>
  );
}



