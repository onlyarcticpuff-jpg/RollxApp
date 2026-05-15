'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/games', label: 'Games', icon: '🎮' },
  { href: '/wallet', label: 'Wallet', icon: '💰' },
  { href: '/rewards', label: 'Rewards', icon: '🎁' },
  { href: '/profile', label: 'Profile', icon: '👤' }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={styles.nav}>
      {items.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...styles.item,
              ...(active ? styles.active : {})
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    left: 12,
    right: 12,
    bottom: 12,
    height: 68,
    background: 'rgba(10, 18, 28, 0.94)',
    border: '1px solid #24384d',
    borderRadius: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'center',
    zIndex: 50,
    backdropFilter: 'blur(14px)',
    boxShadow: '0 18px 50px rgba(0,0,0,0.35)'
  },
  item: {
    color: '#7f96aa',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    fontWeight: 800
  },
  active: {
    color: '#ffffff'
  },
  icon: {
    fontSize: 20
  },
  label: {
    fontSize: 10
  }
};
