import React from 'react';
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

// Advanced design system with professional color palette and effects
const colors = {
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primaryDark: '#1D4ED8',
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
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
  // Advanced gradient colors
  purple: '#8B5CF6',
  indigo: '#6366F1',
  cyan: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
};

const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
  glow: '0 0 20px 0 rgb(59 130 246 / 0.3)',
  glowLarge: '0 0 40px 0 rgb(59 130 246 / 0.2)',
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: '1rem 0',
    background: `
      radial-gradient(circle at 20% 80%, ${colors.purple}15 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${colors.cyan}15 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${colors.indigo}10 0%, transparent 50%),
      linear-gradient(135deg, ${colors.gray900} 0%, ${colors.gray800} 50%, ${colors.gray900} 100%)
    `,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(${colors.gray700}20 1px, transparent 1px),
      linear-gradient(90deg, ${colors.gray700}20 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.3,
    zIndex: 0,
  },
  floatingOrbs: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.6,
    animation: 'float 6s ease-in-out infinite',
    zIndex: 1,
  },
  orb1: {
    background: `linear-gradient(45deg, ${colors.purple}, ${colors.indigo})`,
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  orb2: {
    background: `linear-gradient(45deg, ${colors.cyan}, ${colors.emerald})`,
    top: '60%',
    right: '10%',
    animationDelay: '2s',
  },
  orb3: {
    background: `linear-gradient(45deg, ${colors.rose}, ${colors.amber})`,
    bottom: '20%',
    left: '20%',
    animationDelay: '4s',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10,
    padding: '0 1rem',
  },
  titleContainer: {
    position: 'relative',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '900',
    background: `linear-gradient(135deg, 
      ${colors.white} 0%, 
      ${colors.cyan} 25%, 
      ${colors.indigo} 50%, 
      ${colors.purple} 75%, 
      ${colors.white} 100%
    )`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 8s ease infinite',
    marginBottom: '1rem',
    lineHeight: '1.1',
    textShadow: `0 0 30px ${colors.primary}40`,
    letterSpacing: '-0.02em',
  },
  titleGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background: `radial-gradient(ellipse, ${colors.primary}20 0%, transparent 70%)`,
    filter: 'blur(20px)',
    zIndex: -1,
  },
  tagline: {
    fontSize: '1.5rem',
    color: colors.gray300,
    fontWeight: '500',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
    textShadow: `0 2px 4px ${colors.black}50`,
  },
  description: {
    fontSize: '1.125rem',
    color: colors.gray400,
    lineHeight: '1.6',
    marginBottom: '2rem',
    maxWidth: '700px',
    margin: '0 auto 2rem auto',
    textShadow: `0 1px 2px ${colors.black}30`,
  },
  connectButtonContainer: {
    marginBottom: '3rem',
    position: 'relative',
  },
  connectButton: {
    padding: '1.25rem 2.5rem',
    fontSize: '1.375rem',
    fontWeight: '700',
    borderRadius: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    outline: 'none',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.indigo} 50%, ${colors.purple} 100%)`,
    color: colors.white,
    boxShadow: `
      ${shadows.xl}, 
      0 0 30px ${colors.primary}40,
      inset 0 1px 0 ${colors.white}20
    `,
    transform: 'translateY(0) scale(1)',
    position: 'relative',
    overflow: 'hidden',
  },
  connectButtonGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.purple}, ${colors.cyan}, ${colors.primary})`,
    animation: 'rotate 4s linear infinite',
    zIndex: -1,
  },
  connectButtonInner: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    right: '2px',
    bottom: '2px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.indigo} 50%, ${colors.purple} 100%)`,
    borderRadius: '0.875rem',
    zIndex: 1,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1000px',
    width: '100%',
    marginTop: '2rem',
    position: 'relative',
    zIndex: 10,
  },
  featureCard: {
    padding: '2.5rem',
    background: `linear-gradient(135deg, ${colors.gray800}95 0%, ${colors.gray700}95 100%)`,
    borderRadius: '1.5rem',
    boxShadow: `
      ${shadows['2xl']}, 
      inset 0 1px 0 ${colors.white}10,
      0 0 20px ${colors.black}20
    `,
    border: `1px solid ${colors.gray600}50`,
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  featureCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.purple}20 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: '1.5rem',
  },
  featureIcon: {
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
    filter: `drop-shadow(0 4px 8px ${colors.black}30)`,
    position: 'relative',
    zIndex: 2,
  },
  featureTitle: {
    fontSize: '1.375rem',
    fontWeight: '700',
    color: colors.white,
    marginBottom: '1rem',
    textShadow: `0 2px 4px ${colors.black}50`,
    position: 'relative',
    zIndex: 2,
  },
  featureDescription: {
    fontSize: '1rem',
    color: colors.gray300,
    lineHeight: '1.6',
    textShadow: `0 1px 2px ${colors.black}30`,
    position: 'relative',
    zIndex: 2,
  },
  footer: {
    marginTop: '3rem',
    padding: '2rem',
    textAlign: 'center',
    color: colors.gray400,
    fontSize: '0.95rem',
    borderTop: `1px solid ${colors.gray700}50`,
    width: '100%',
    maxWidth: '900px',
    position: 'relative',
    zIndex: 10,
    background: `linear-gradient(135deg, ${colors.gray800}20 0%, ${colors.gray900}20 100%)`,
    borderRadius: '1rem 1rem 0 0',
    backdropFilter: 'blur(10px)',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '3rem',
    position: 'relative',
    zIndex: 10,
  },
  statItem: {
    textAlign: 'center',
    padding: '1.5rem',
    background: `linear-gradient(135deg, ${colors.gray800}80 0%, ${colors.gray700}80 100%)`,
    borderRadius: '1rem',
    border: `1px solid ${colors.gray600}30`,
    backdropFilter: 'blur(10px)',
    minWidth: '120px',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    background: `linear-gradient(135deg, ${colors.cyan}, ${colors.indigo})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: colors.gray400,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};

export default function HomePage({ onEnterApp }) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [validationState, setValidationState] = React.useState('idle'); // 'idle', 'validating', 'authorized', 'denied'
  const [validationError, setValidationError] = React.useState('');

  // Validate wallet address when account is connected
  React.useEffect(() => {
    if (account && validationState === 'idle') {
      validateWalletAddress(account.address);
    }
  }, [account, validationState]);

  // Navigate to main app when validation is successful
  React.useEffect(() => {
    if (validationState === 'authorized' && onEnterApp) {
      // Small delay to show the validation success before navigating
      const timer = setTimeout(() => {
        onEnterApp();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [validationState, onEnterApp]);

  const validateWalletAddress = async (address) => {
    setValidationState('validating');
    setValidationError('');

    try {
      const response = await fetch(`http://localhost:3001/api/validate-wallet/${address}`);
      const data = await response.json();

      if (data.authorized) {
        setValidationState('authorized');
      } else {
        setValidationState('denied');
        setValidationError('Access denied — your wallet is not authorized');
      }
    } catch (error) {
      console.error('Wallet validation error:', error);
      setValidationState('denied');
      setValidationError('Unable to validate wallet address. Please try again.');
    }
  };

  // Reset validation state when wallet is disconnected
  React.useEffect(() => {
    if (!account) {
      setValidationState('idle');
      setValidationError('');
    }
  }, [account]);

  // Function to reset validation state and allow trying again
  const handleTryAgain = () => {
    setValidationState('idle');
    setValidationError('');
    // Disconnect current wallet to allow connecting a different one
    if (account) {
      disconnect();
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
          }
          
          #root {
            width: 100vw;
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(10px) rotate(-1deg); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.8; }
          }
          
          .feature-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: ${shadows['2xl']}, 0 0 40px ${colors.primary}30;
          }
          
          .feature-card:hover .feature-card-glow {
            opacity: 1;
          }
          
          .connect-button:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: ${shadows['2xl']}, 0 0 50px ${colors.primary}60 !important;
          }
          
          .stat-item:hover {
            transform: translateY(-2px);
            box-shadow: ${shadows.lg};
          }
          
          @media (max-width: 768px) {
            html, body {
              overflow-x: hidden !important;
              overflow-y: auto !important;
            }
            
            .hero-title {
              font-size: 2.5rem !important;
              margin-bottom: 0.75rem !important;
            }
            .hero-tagline {
              font-size: 1.25rem !important;
              margin-bottom: 1rem !important;
            }
            .hero-description {
              font-size: 1rem !important;
              margin-bottom: 1.5rem !important;
            }
            .features-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
              margin-top: 1.5rem !important;
            }
            .stats-container {
              flex-direction: row !important;
              gap: 1rem !important;
              margin-bottom: 2rem !important;
            }
            .container {
              padding: 0.5rem !important;
            }
            .floating-orb {
              display: none !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero-title {
              font-size: 2rem !important;
            }
            .hero-tagline {
              font-size: 1.125rem !important;
            }
            .hero-description {
              font-size: 0.95rem !important;
            }
            .stats-container {
              flex-direction: column !important;
              gap: 0.75rem !important;
            }
          }
        `}
      </style>
      <div style={styles.container} className="container">
        {/* Background grid pattern */}
        <div style={styles.backgroundGrid}></div>
        
        {/* Floating orbs */}
        <div style={{...styles.floatingOrbs, ...styles.orb1}} className="floating-orb"></div>
        <div style={{...styles.floatingOrbs, ...styles.orb2}} className="floating-orb"></div>
        <div style={{...styles.floatingOrbs, ...styles.orb3}} className="floating-orb"></div>
        
        <div style={styles.hero}>
          <div style={styles.titleContainer}>
            <div style={styles.titleGlow}></div>
            <h1 style={styles.title} className="hero-title">
              Decentralized Multi-Sig Secrets Vault
            </h1>
          </div>
          
          <p style={styles.tagline} className="hero-tagline">
            Store & share sensitive credentials with zero trust, powered by Walrus + Seal
          </p>
          
          <p style={styles.description} className="hero-description">
            Experience the future of secure data storage with our decentralized vault. 
            Utilizing threshold cryptography and distributed storage, your sensitive information 
            remains protected while being accessible from anywhere. No single point of failure, 
            no central authority, complete privacy by design.
          </p>
          
          {/* Statistics */}
          <div style={styles.statsContainer} className="stats-container">
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber}>99.9%</div>
              <div style={styles.statLabel}>Uptime</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber}>256</div>
              <div style={styles.statLabel}>Bit Encryption</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber}>∞</div>
              <div style={styles.statLabel}>Scalability</div>
            </div>
          </div>
          
          <div style={styles.connectButtonContainer}>
            {!account ? (
              <div style={styles.connectButton} className="connect-button">
                <div style={styles.connectButtonGlow}></div>
                <div style={styles.connectButtonInner}></div>
                <ConnectButton 
                  connectText="🔐 Connect Wallet"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.white,
                    fontSize: '1.375rem',
                    fontWeight: '700',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              </div>
            ) : validationState === 'validating' ? (
              <div style={{
                ...styles.connectButton,
                background: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.amber} 100%)`,
                cursor: 'default',
              }}>
                <div style={styles.connectButtonInner}></div>
                <span style={{ position: 'relative', zIndex: 2 }}>
                  🔍 Validating Wallet Access...
                </span>
              </div>
            ) : validationState === 'authorized' ? (
              <div style={{
                ...styles.connectButton,
                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.emerald} 100%)`,
                cursor: 'default',
              }}>
                <div style={styles.connectButtonInner}></div>
                <span style={{ position: 'relative', zIndex: 2 }}>
                  ✅ Wallet Authorized - Entering App...
                </span>
              </div>
            ) : validationState === 'denied' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  ...styles.connectButton,
                  background: `linear-gradient(135deg, ${colors.danger} 0%, ${colors.rose} 100%)`,
                  cursor: 'default',
                }}>
                  <div style={styles.connectButtonInner}></div>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    ❌ Access Denied
                  </span>
                </div>
                <button
                  onClick={handleTryAgain}
                  style={{
                    ...styles.connectButton,
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.gray600} 100%)`,
                    fontSize: '1.125rem',
                    padding: '0.875rem 1.5rem',
                    cursor: 'pointer',
                  }}
                  className="connect-button"
                >
                  <div style={styles.connectButtonInner}></div>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    🔄 Try Different Wallet
                  </span>
                </button>
              </div>
            ) : null}
          </div>
          
          {/* Show validation error message */}
          {validationError && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem 1.5rem',
              backgroundColor: `${colors.danger}20`,
              borderRadius: '0.75rem',
              border: `2px solid ${colors.danger}`,
              color: colors.white,
              textAlign: 'center',
              maxWidth: '500px',
              margin: '1rem auto 0 auto',
              fontSize: '1.125rem',
              fontWeight: '500',
              boxShadow: `0 0 20px ${colors.danger}30`,
              position: 'relative',
              zIndex: 10,
            }}>
              {validationError}
              {validationState === 'denied' && (
                <div style={{ 
                  fontSize: '0.95rem', 
                  marginTop: '0.5rem', 
                  opacity: 0.9,
                  fontWeight: '400' 
                }}>
                  Please try connecting with an authorized wallet address.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.features} className="features-grid">
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureCardGlow} className="feature-card-glow"></div>
            <div style={styles.featureIcon}>🔐</div>
            <h3 style={styles.featureTitle}>Threshold Encryption</h3>
            <p style={styles.featureDescription}>
              Powered by Seal's distributed key management. Your data is encrypted across multiple servers with no single point of failure.
            </p>
          </div>
          
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureCardGlow} className="feature-card-glow"></div>
            <div style={styles.featureIcon}>🐋</div>
            <h3 style={styles.featureTitle}>Decentralized Storage</h3>
            <p style={styles.featureDescription}>
              Built on Walrus network for fault-tolerant, censorship-resistant storage that scales globally.
            </p>
          </div>
          
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureCardGlow} className="feature-card-glow"></div>
            <div style={styles.featureIcon}>⛓️</div>
            <h3 style={styles.featureTitle}>Blockchain Security</h3>
            <p style={styles.featureDescription}>
              Sui blockchain integration ensures transparent, verifiable access control and session management.
            </p>
          </div>
        </div>

        <footer style={styles.footer}>
          <div style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
            Built with 🐋 <strong style={{ color: colors.cyan }}>Walrus</strong> for decentralized storage and 🔐 <strong style={{ color: colors.purple }}>Seal</strong> for threshold encryption
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, letterSpacing: '0.05em' }}>
            TESTNET • SECURE • DECENTRALIZED • ZERO TRUST
          </div>
        </footer>
      </div>
    </>
  );
}
