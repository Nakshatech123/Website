
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { AuthContext } from '../AuthProvider';

// SVG Icons for Navigation
const GeoVideoLogo = () => (
    <div className={styles.logoContainer}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#4f46e5"/>
            <path d="M16.5 12L9 16.3301V7.66987L16.5 12Z" fill="white"/>
        </svg>
        <h4>GeoVideo</h4>
    </div>
);
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const AboutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const UploadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const HistoryIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;


export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);

  const getUserName = () => {
    if (!user || !user.email) return 'User';
    const namePart = user.email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.sidebar}>
        <div>
            <GeoVideoLogo />
            <h4 className={styles.navHeader}>NAVIGATION</h4>
            <div className={styles.sidebarNav}>
                <Link href="/dashboard" className={styles.navLink}><DashboardIcon /> Dashboard</Link>
                <Link href="/dashboard/about" className={styles.navLink}><AboutIcon /> About</Link>
                <Link href="/dashboard/upload" className={styles.navLink}><UploadIcon /> Upload Video</Link>
                <Link href="/dashboard/history" className={styles.navLink}><HistoryIcon /> History</Link>
            </div>
        </div>
        
        <div className={styles.userProfile}>
            <UserIcon />
            <div className={styles.userInfo}>
                <span>{getUserName()}</span>
                <small>Video Processing Expert</small>
            </div>
        </div>
      </nav>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}