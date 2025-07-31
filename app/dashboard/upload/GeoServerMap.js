'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Helper function to convert "HH:MM:SS,mmm" to seconds
function timeToSeconds(timeStr) {
  const parts = timeStr.split(/[:,]/);
  return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]) + (+parts[3] / 1000);
}

export default function GeoServerMap({ srtData, videoRef }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current) return;

    const initialCoords = srtData?.[0] ? [srtData[0].lat, srtData[0].lon] : [20.5937, 78.9629];
    const map = L.map('geoserver-map-container', {
      center: initialCoords,
      zoom: srtData?.[0] ? 19 : 5,
      maxZoom: 19
    });

    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }).addTo(map);

    L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
      layers: 'YOUR_WORKSPACE:YOUR_LAYER',
      format: 'image/png',
      transparent: true,
    }).addTo(map);

    mapRef.current = map;
  }, [srtData]);

  // ❗️ START OF ADDED CODE: This new useEffect hook fixes the sizing issue.
  useEffect(() => {
    if (mapRef.current) {
      // Use a timeout to ensure the container has finished rendering
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [srtData]); // Rerunning when srtData is available ensures it runs when the map is shown.
  // ❗️ END OF ADDED CODE

  // Sync video time with the map marker
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !mapRef.current || !srtData) return;

    const onTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      const segment = srtData.find(s => currentTime >= timeToSeconds(s.start) && currentTime <= timeToSeconds(s.end));

      if (segment) {
        const position = [segment.lat, segment.lon];
        if (!markerRef.current) {
          const icon = L.icon({ iconUrl: '/marker1.png', iconSize: [32, 32], iconAnchor: [16, 32] });
          markerRef.current = L.marker(position, { icon }).addTo(mapRef.current);
        } 

        // Add or update the click event to display latitude and longitude
        markerRef.current.off('click'); // Remove any existing click event to avoid duplicates
        markerRef.current.on('click', () => {
          L.popup()
            .setLatLng(position)
            .setContent(`Latitude: ${segment.lat}, Longitude: ${segment.lon}`)
            .openOn(mapRef.current);
        });

        markerRef.current.setLatLng(position);
        mapRef.current.panTo(position);
      }
    };

    videoElement.addEventListener('timeupdate', onTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', onTimeUpdate);
  }, [srtData, videoRef]);

  return <div id="geoserver-map-container" style={{ height: '100%', width: '100%', borderRadius: '8px' }} />;
}
