
'use client';

 import { useContext } from 'react';
 import Link from 'next/link';
 import styles from './dashboard.module.css';
 import { AuthContext } from '../AuthProvider';

 // SVG Icons for Main Content
 const VideoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><path d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" /></svg>;
 const ClockIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
 const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8a6 6 0 0 0-6.4 0l-6.3 6.3" /><path d="M14 16h6v-6" /></svg>;
 const UploadCloudIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /><polyline points="16 16 12 12 8 16" /></svg>;
 const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
 const NoVideoIcon = () => <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;


 const DashboardPage = () => {
   const { user } = useContext(AuthContext);

   const stats = {
     totalVideos: 0,
     processing: 0,
     totalDuration: '0m',
   };

   const getUserName = () => {
     if (!user || !user.email) {
       return 'User';
     }
     const namePart = user.email.split('@')[0];
     return namePart.charAt(0).toUpperCase() + namePart.slice(1);
   };

   return (
     <>
       {/* --- WELCOME HEADER --- */}
       <div className={styles.pageHeader}>
         <div>
           <h1>Welcome back, {getUserName()}!</h1>
           <p className={styles.subtitle}>Ready to process and visualize your video locations?</p>
         </div>
         {/* ✅ REMOVED HeaderIcon HERE */}
       </div>

       {/* --- STATS GRID --- */}
       <div className={styles.statsGrid}>
         <div className={styles.statCard}>
           <VideoIcon />
           <div className={styles.statContent}>
             <p>{stats.totalVideos}</p>
             <h3>Total Videos</h3>
             <span>Videos processed with geolocation</span>
           </div>
         </div>
         <div className={styles.statCard}>
           <ClockIcon />
           <div className={styles.statContent}>
             <p>{stats.processing}</p>
             <h3>Processing</h3>
             <span>Videos currently being processed</span>
           </div>
         </div>
         <div className={styles.statCard}>
           <ChartIcon />
           <div className={styles.statContent}>
             <p>{stats.totalDuration}</p>
             <h3>Total Duration</h3>
             <span>Minutes of video content</span>
           </div>
         </div>
       </div>

       {/* --- MAIN ACTION GRID --- */}
       <div className={styles.mainGrid}>
         <div className={styles.mainCard}>
             <div className={styles.cardHeader}>
                 <UploadCloudIcon />
                 <h3>Upload New Video</h3>
             </div>
             <p>Upload your video files with optional .srt subtitle files to extract and visualize location data on an interactive map.</p>
             <Link href="/dashboard/upload" className={styles.primaryButton}>
                 Start Upload
             </Link>
         </div>

         <div className={styles.mainCard}>
             <div className={styles.cardHeader}>
                 <PlayIcon />
                 <h3>Recent Videos</h3>
             </div>
             <div className={styles.emptyState}>
                 <NoVideoIcon />
                 <p>No videos uploaded yet</p>
                 <Link href="/dashboard/upload" className={styles.secondaryButton}>
                     Upload Your First Video
                 </Link>
             </div>
         </div>
       </div>
     </>
   );
 }

 export default DashboardPage;