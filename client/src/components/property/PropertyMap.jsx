import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PropertyMap = ({ location }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default center (Lahore, Pakistan)
  const defaultCenter = { lat: 31.5204, lng: 74.3587 };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Set a timeout to hide loading spinner
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
        },
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: 12,
        attributionControl: true
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        clearTimeout(loadingTimeout);
        setLoading(false);
        console.log('Map loaded successfully');
      });

      map.current.on('error', (e) => {
        clearTimeout(loadingTimeout);
        console.error('Map error:', e);
        setLoading(false);
      });

      // Debug: Log when tiles load
      map.current.on('data', (e) => {
        if (e.dataType === 'source' && e.isSourceLoaded) {
          console.log('Source loaded:', e.sourceId);
        }
      });

    } catch (err) {
      clearTimeout(loadingTimeout);
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const updateMapLocation = async () => {
      if (!map.current) return;

      // Wait a bit for map to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      let coordinates = null;

      // 1. Try to use provided coordinates
      if (location?.coordinates?.lat && location?.coordinates?.lng) {
        coordinates = {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng
        };
      }
      // 2. Geocode address if coordinates missing
      else if (location?.area || location?.city) {
        try {
          const query = `${location.area || ''}, ${location.city || ''}, Pakistan`.trim();
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            {
              headers: {
                'User-Agent': 'PropertyListingApp/1.0'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              coordinates = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
              };
            }
          }
        } catch (err) {
          console.error('Geocoding error:', err);
        }
      }

      // Update map and marker if coordinates found
      if (coordinates && map.current) {
        try {
          map.current.flyTo({
            center: [coordinates.lng, coordinates.lat],
            zoom: 15,
            duration: 1500
          });

          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }

          // Add new marker
          marker.current = new maplibregl.Marker({ color: '#2563eb' })
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map.current);

        } catch (err) {
          console.error('Error updating map:', err);
        }
      }
    };

    if (!loading) {
      updateMapLocation();
    }
  }, [location, loading]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        Map Location
      </h2>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
        <div ref={mapContainer} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <div className="text-center px-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-red-600 font-medium mb-2">{error}</p>
              <p className="text-sm text-gray-500">Map could not be loaded</p>
            </div>
          </div>
        )}
      </div>

      {location && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-sm text-gray-700">
              {location.address && <p className="font-medium mb-1">{location.address}</p>}
              <p>{location.area && `${location.area}, `}{location.city}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
