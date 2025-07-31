


// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import styles from './upload.module.css';
// import VideoPlayer from './VideoPlayer';
// import GeoServerMap from './GeoServerMap';
// import Cookies from 'js-cookie';
// import Link from 'next/link';

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function UploadPage() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [srtFile, setSrtFile] = useState(null);
//   const [srtData, setSrtData] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [processedUrl, setProcessedUrl] = useState('');
//   const [videoStatus, setVideoStatus] = useState('idle');
//   const [error, setError] = useState('');
//   const fileInputRef = useRef(null);
//   const srtInputRef = useRef(null);
//   const processedVideoRef = useRef(null);

//   useEffect(() => {
//     // Load state on page load
//     const savedResult = localStorage.getItem('video_result');
//     if (savedResult) {
//       const { processedUrl, srtData } = JSON.parse(savedResult);
//       setProcessedUrl(processedUrl);
//       setSrtData(srtData);
//       setVideoStatus('done');
//       return;
//     }
    
//     const savedJobId = localStorage.getItem('video_job_id');
//     const savedPreviewUrl = localStorage.getItem('video_preview_url');
//     if (savedJobId) {
//       setVideoStatus('processing');
//       setPreviewUrl(savedPreviewUrl || '');
//       pollStatus(savedJobId);
//     }

//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, []);

//   const pollStatus = (jobId) => {
//     const token = Cookies.get('auth_token');
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch(`${API}/video/status/${jobId}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await res.json();
        
//         if (data.status === 'done') {
//           const finalProcessedUrl = `${API}${data.processed_video_url}`;
//           setProcessedUrl(finalProcessedUrl);
//           setVideoStatus('done');
//           const resultToSave = { processedUrl: finalProcessedUrl, srtData: srtData };
//           localStorage.setItem('video_result', JSON.stringify(resultToSave));
//           localStorage.removeItem('video_job_id');
//           localStorage.removeItem('video_preview_url');
//           clearInterval(interval);
//         } else if (['cancelled', 'error', 'not_found'].includes(data.status)) {
//           setError(data.detail || 'Processing failed or was cancelled.');
//           setVideoStatus('preview');
//           localStorage.removeItem('video_job_id');
//           localStorage.removeItem('video_preview_url');
//           clearInterval(interval);
//         }
//       } catch (err) {
//         setError('Connection to server lost during polling.');
//         setVideoStatus('preview');
//         localStorage.removeItem('video_job_id');
//         localStorage.removeItem('video_preview_url');
//         clearInterval(interval);
//       }
//     }, 10000);
//   };

//   const resetState = () => {
//     setSelectedFile(null);
//     setSrtFile(null);
//     setSrtData(null);
//     setPreviewUrl('');
//     setProcessedUrl('');
//     setVideoStatus('idle');
//     setError('');
//     localStorage.removeItem('video_result');
//     localStorage.removeItem('video_job_id');
//     localStorage.removeItem('video_preview_url');
//   };
  
//   const handleCancel = async () => {
//     const jobId = localStorage.getItem('video_job_id');
//     if (!jobId) return;

//     try {
//       const token = Cookies.get('auth_token');
//       await fetch(`${API}/video/cancel/${jobId}`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//     } catch (err) {
//       console.error("Failed to send cancel request, but resetting UI anyway.");
//     } finally {
//       resetState();
//     }
//   };
  
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('video/')) {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//       setSelectedFile(file);
//       setProcessedUrl('');
//       const newPreviewUrl = URL.createObjectURL(file);
//       setPreviewUrl(newPreviewUrl);
//       setVideoStatus('preview');
//       setError('');
//     } else {
//       setError('Please select a valid video file.');
//     }
//   };

//   const handleSrtChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.name.toLowerCase().endsWith('.srt')) {
//       setSrtFile(file);
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         const text = ev.target.result;
//         const parsed = parseSrtCoordinates(text);
//         setSrtData(parsed);
//       };
//       reader.readAsText(file);
//     } else {
//       setError('Please select a valid SRT file.');
//     }
//   };

//   function parseSrtCoordinates(text) {
//     const blocks = text.split(/\n\s*\n/);
//     const result = [];
//     for (const block of blocks) {
//         const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
//         if (lines.length < 2) continue;
//         const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
//         if (!timeMatch) continue;

//         const textContent = lines.slice(2).join(' ');
//         const latMatch = textContent.match(/latitude\s*[:=]?\s*([\d.-]+)/i);
//         const lonMatch = textContent.match(/longtitude\s*[:=]?\s*([\d.-]+)/i);

//         if (latMatch && lonMatch) {
//             result.push({
//                 start: timeMatch[1],
//                 end: timeMatch[2],
//                 lat: parseFloat(latMatch[1]),
//                 lon: parseFloat(lonMatch[1]),
//             });
//         }
//     }
//     return result.length ? result : null;
//   }

//   const handleDropZoneClick = () => fileInputRef.current.click();
//   const handleSrtZoneClick = () => srtInputRef.current.click();
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFileChange({ target: { files: e.dataTransfer.files } });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) return;
//     setVideoStatus('processing');
//     setError('');

//     const token = Cookies.get('auth_token');
//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     localStorage.setItem('video_preview_url', previewUrl);

//     try {
//       const res = await fetch(`${API}/video/upload/`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || 'Upload failed');
      
//       localStorage.setItem('video_job_id', data.job_id);
//       pollStatus(data.job_id);
//     } catch (err) {
//       setError(err.message);
//       setVideoStatus('preview');
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {error && <div className={styles.errorBanner}>{error}<button onClick={() => setError('')}>×</button></div>}
      
//       <h1>Upload & Process Video</h1>
//       <p className={styles.subtitle}>
//         {videoStatus === 'done' ? 'Your video has been processed.' : 'Upload a video to begin.'}
//       </p>

//       {(videoStatus === 'preview' || videoStatus === 'processing') && (
//         <div className={styles.previewContainer}>
//           {previewUrl && (
//             <VideoPlayer src={previewUrl} status={videoStatus} className={styles.videoPlayer} />
//           )}

//           {videoStatus === 'processing' && (
//             <button onClick={handleCancel} className={styles.cancelButton}>
//               Stop Processing
//             </button>
//           )}
//         </div>
//       )}

//       {videoStatus === 'done' ? (
//         <>
//           <div className={styles.resultsGrid}>
//             <div className={styles.card}>
//               <h2>Processed Video</h2>
//              {processedUrl && (
//                 <VideoPlayer src={processedUrl} status="done" ref={processedVideoRef} className={styles.videoPlayer} />
//              )}

//             </div>
//             {srtData && (
//               <div className={styles.card}>
//                 <h2>GeoServer Map</h2>
//                 {/* Apply the new mapContainer style here */}
//                 <div className={styles.mapContainer}>
//                   <GeoServerMap srtData={srtData} videoRef={processedVideoRef} />
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className={styles.actions}>
//             <p>Find this and other videos in your <Link href="/dashboard/history">History</Link>.</p>
//             <button onClick={resetState} className={styles.mainButton}>Upload Another Video</button>
//           </div>
//         </>
//       ) : (
//         <form onSubmit={handleSubmit} className={styles.uploadForm}>
//           <div className={styles.dropZone} onClick={handleDropZoneClick} onDragOver={handleDragOver} onDrop={handleDrop}>
//             <input type="file" ref={fileInputRef} onChange={handleFileChange} className={styles.fileInput} accept="video/*" />
//             <p>{selectedFile ? `Selected: ${selectedFile.name}` : 'Click or drag video here'}</p>
//           </div>
//           <div className={styles.dropZone} style={{marginTop: '1rem'}} onClick={handleSrtZoneClick}>
//             <input type="file" ref={srtInputRef} onChange={handleSrtChange} className={styles.fileInput} accept=".srt" />
//             <p>{srtFile ? `SRT Selected: ${srtFile.name}` : 'Click or drag SRT file (for map sync)'}</p>
//           </div>
//           <button type="submit" className={styles.mainButton} disabled={videoStatus === 'processing' || !selectedFile}>
//             {videoStatus === 'processing' ? 'Processing...' : 'Upload & Process'}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './upload.module.css';
import VideoPlayer from './VideoPlayer';
import GeoServerMap from './GeoServerMap';
import Cookies from 'js-cookie';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;
const VideoIcon = () => (
 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon}>
  <path d="M17 10.5V7C17 6.46957 16.7893 5.96086 16.4142 5.58579C16.0391 5.21071 15.5304 5 15 5H4C3.46957 5 2.96086 5.21071 2.58579 5.58579C2.21071 5.96086 2 6.46957 2 7V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H15C15.5304 19 16.0391 18.7893 16.4142 18.4142C16.7893 18.0391 17 17.5304 17 17V13.5L22 18.5V5.5L17 10.5Z" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);
const FileIcon = () => (
 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon}>
  <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <polyline points="13 2 13 9 20 9" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
 </svg>
);
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export default function UploadPage() {
 const [selectedFile, setSelectedFile] = useState(null);
 const [srtFile, setSrtFile] = useState(null);
 const [srtData, setSrtData] = useState(null);
 const [previewUrl, setPreviewUrl] = useState('');
 const [processedUrl, setProcessedUrl] = useState('');
 const [videoStatus, setVideoStatus] = useState('idle');
 const [error, setError] = useState('');
 const fileInputRef = useRef(null);
 const srtInputRef = useRef(null);
 const processedVideoRef = useRef(null);

 useEffect(() => {
  const savedResult = localStorage.getItem('video_result');
  if (savedResult) {
   const { processedUrl, srtData } = JSON.parse(savedResult);
   setProcessedUrl(processedUrl);
   setSrtData(srtData);
   setVideoStatus('done');
   return;
  }
  const savedJobId = localStorage.getItem('video_job_id');
  const savedPreviewUrl = localStorage.getItem('video_preview_url');
  if (savedJobId) {
   setVideoStatus('processing');
   setPreviewUrl(savedPreviewUrl || '');
   pollStatus(savedJobId);
  }
  return () => {
   if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
 }, []);
  const pollStatus = (jobId) => {
  const token = Cookies.get('auth_token');
  const interval = setInterval(async () => {
   try {
    const res = await fetch(`${API}/video/status/${jobId}`, {
     headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.status === 'done') {
     const finalProcessedUrl = `${API}${data.processed_video_url}`;
     setProcessedUrl(finalProcessedUrl);
     setVideoStatus('done');
     const resultToSave = { processedUrl: finalProcessedUrl, srtData: srtData };
     localStorage.setItem('video_result', JSON.stringify(resultToSave));
     localStorage.removeItem('video_job_id');
     localStorage.removeItem('video_preview_url');
     clearInterval(interval);
    } else if (['cancelled', 'error', 'not_found'].includes(data.status)) {
     setError(data.detail || 'Processing failed or was cancelled.');
     setVideoStatus('preview');
     localStorage.removeItem('video_job_id');
     localStorage.removeItem('video_preview_url');
     clearInterval(interval);
    }
   } catch (err) {
    setError('Connection to server lost during polling.');
    setVideoStatus('preview');
    localStorage.removeItem('video_job_id');
    localStorage.removeItem('video_preview_url');
    clearInterval(interval);
   }
  }, 10000);
 };
 const resetState = () => {
  setSelectedFile(null);
  setSrtFile(null);
  setSrtData(null);
  setPreviewUrl('');
  setProcessedUrl('');
  setVideoStatus('idle');
  setError('');
  localStorage.removeItem('video_result');
  localStorage.removeItem('video_job_id');
  localStorage.removeItem('video_preview_url');
 };
 const handleCancel = async () => {
  const jobId = localStorage.getItem('video_job_id');
  if (!jobId) return;
  try {
   const token = Cookies.get('auth_token');
   await fetch(`${API}/video/cancel/${jobId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
   });
  } catch (err) {
   console.error("Failed to send cancel request, but resetting UI anyway.");
  } finally {
   resetState();
  }
 };
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
   if (previewUrl) URL.revokeObjectURL(previewUrl);
   setSelectedFile(file);
   setProcessedUrl('');
   const newPreviewUrl = URL.createObjectURL(file);
   setPreviewUrl(newPreviewUrl);
   setVideoStatus('preview');
   setError('');
  } else {
      if (file) setError('Please select a valid video file.');
  }
 };
 const handleSrtChange = (e) => {
  const file = e.target.files[0];
  if (file && file.name.toLowerCase().endsWith('.srt')) {
   setSrtFile(file);
   const reader = new FileReader();
   reader.onload = (ev) => {
    const text = ev.target.result;
    const parsed = parseSrtCoordinates(text);
    setSrtData(parsed);
   };
   reader.readAsText(file);
  } else {
      if (file) setError('Please select a valid SRT file.');
  }
 };
 function parseSrtCoordinates(text) {
  const blocks = text.split(/\n\s*\n/);
  const result = [];
  for (const block of blocks) {
    const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;
    const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!timeMatch) continue;

    const textContent = lines.slice(2).join(' ');
    const latMatch = textContent.match(/latitude\s*[:=]?\s*([\d.-]+)/i);
    const lonMatch = textContent.match(/longtitude\s*[:=]?\s*([\d.-]+)/i);
    if (latMatch && lonMatch) {
      result.push({
        start: timeMatch[1],
        end: timeMatch[2],
        lat: parseFloat(latMatch[1]),
        lon: parseFloat(lonMatch[1]),
      });
    }
  }
  return result.length ? result : null;
 }
 const handleVideoDropZoneClick = () => fileInputRef.current.click();
 const handleSrtDropZoneClick = () => srtInputRef.current.click();
 const handleDragOver = (e) => e.preventDefault();
 const handleVideoDrop = (e) => {
  e.preventDefault();
  handleFileChange({ target: { files: e.dataTransfer.files } });
 };
  const handleSrtDrop = (e) => {
  e.preventDefault();
  handleSrtChange({ target: { files: e.dataTransfer.files } });
 };
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedFile) return;
  setVideoStatus('processing');
  setError('');
  const token = Cookies.get('auth_token');
  const formData = new FormData();
  formData.append('file', selectedFile);
  localStorage.setItem('video_preview_url', previewUrl);

  try {
   const res = await fetch(`${API}/video/upload/`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
   });

   const data = await res.json();
   if (!res.ok) throw new Error(data.detail || 'Upload failed');
   
   localStorage.setItem('video_job_id', data.job_id);
   pollStatus(data.job_id);
  } catch (err) {
   setError(err.message);
   setVideoStatus('preview');
  }
 };
  
 return (
    <div className={styles.pageWrapper}>
        <div className={`${styles.container} ${videoStatus === 'done' ? styles.resultsContainer : ''}`}>
         {error && <div className={styles.errorBanner}>{error}<button onClick={() => setError('')}>×</button></div>}

            <div className={styles.header}>
                <p className={styles.breadcrumb}>Video & Processing</p>
             <h1>Upload Your Video</h1>
             <p className={styles.subtitle}>
                  Upload your video file and optional .srt subtitle file to extract and visualize location data
                </p>
            </div>

         {(videoStatus === 'preview' || videoStatus === 'processing') && (
          <div className={styles.previewContainer}>
           {previewUrl && (
            <VideoPlayer src={previewUrl} status={videoStatus} className={styles.videoPlayer} />
           )}

           {videoStatus === 'processing' && (
            <button onClick={handleCancel} className={styles.cancelButton}>
             Stop Processing
            </button>
           )}
          </div>
         )}

         {videoStatus === 'done' ? (
          <>
           <div className={styles.resultsGrid}>
            <div className={styles.resultsCard}>
             <h2>Processed Video</h2>
            {processedUrl && (
              <VideoPlayer src={processedUrl} status="done" ref={processedVideoRef} className={styles.videoPlayer} />
            )}
            </div>
            {srtData && (
             <div className={styles.resultsCard}>
              <h2>GeoServer Map</h2>
              <div className={styles.mapContainer}>
               <GeoServerMap srtData={srtData} videoRef={processedVideoRef} />
              </div>
             </div>
            )}
           </div>
           <div className={styles.actions}>
            <p>Find this and other videos in your <Link href="/dashboard/history">History</Link>.</p>
            <button onClick={resetState} className={`${styles.mainButton} ${styles.fullWidth}`}>Upload Another Video</button>
           </div>
          </>
         ) : (
          <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <div className={styles.uploadCard} onClick={handleVideoDropZoneClick} onDragOver={handleDragOver} onDrop={handleVideoDrop}>
                    <div className={styles.cardHeader}>
                        <p>Video File (Required)</p>
                    </div>
                    <div className={styles.cardBody}>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className={styles.fileInput} accept="video/*" />
                        <VideoIcon />
                        <h3 className={styles.cardTitle}>
                          {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload Video File'}
                        </h3>
                        <p className={styles.cardSubtitle}>Drag & drop your video file here or click to browse</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} className={styles.chooseFileButton}>
                            Choose File
                        </button>
                    </div>
                </div>

                <div className={styles.uploadCard} onClick={handleSrtDropZoneClick} onDragOver={handleDragOver} onDrop={handleSrtDrop}>
                    <div className={styles.cardHeader}>
                        <p>Subtitle File (Optional)</p>
                    </div>
                    <div className={styles.cardBody}>
                        <input type="file" ref={srtInputRef} onChange={handleSrtChange} className={styles.fileInput} accept=".srt" />
                        <FileIcon />
                        <h3 className={styles.cardTitle}>
                          {srtFile ? `SRT Selected: ${srtFile.name}` : 'Upload .srt Subtitle File'}
                        </h3>
                        <p className={styles.cardSubtitle}>Optional: Upload subtitle file containing location data (Optional)</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); srtInputRef.current.click(); }} className={styles.chooseFileButton}>
                            Choose File
                        </button>
                    </div>
                </div>
                
           <button type="submit" className={`${styles.mainButton} ${styles.fullWidth}`} disabled={videoStatus === 'processing' || !selectedFile}>
            <PlusIcon />
                  {videoStatus === 'processing' ? 'Processing...' : 'Process Video'}
           </button>
          </form>
         )}
        </div>
    </div>
 );
}
