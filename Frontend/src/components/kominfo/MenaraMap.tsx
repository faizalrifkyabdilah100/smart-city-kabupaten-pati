import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MenaraData } from '../../services/menaraApi';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon using CDN to avoid local resolution issues in Vite
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Tower Icon
const TowerIcon = L.divIcon({
    html: `<div style="font-size: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🗼</div>`,
    className: 'custom-tower-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

interface MenaraMapProps {
    data: MenaraData[];
    center: [number, number];
    zoom: number;
    onMarkerClick?: (menara: MenaraData) => void;
}

// Component to handle map view updates
const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Memoize the entire component to prevent re-renders when parent's other states (traffic/server) update
export const MenaraMap = React.memo<MenaraMapProps>(({ data, center, zoom, onMarkerClick }) => {
    // Use Google Maps Roadmap tiles for the familiar "Google Maps" look requested
    const tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    // Memoize the markers list so we don't re-calculate/re-render 400+ items unless "data" changes
    const markers = useMemo(() => {
        if (!Array.isArray(data)) return null;

        return data.map((menara) => {
            const lat = typeof menara.lat === 'string' ? parseFloat(menara.lat) : menara.lat;
            const lng = typeof menara.longitude === 'string' ? parseFloat(menara.longitude) : menara.longitude;

            if (!isNaN(lat) && !isNaN(lng)) {
                return (
                    <Marker
                        key={`${menara.id}-${menara.id_menara}`}
                        position={[lat, lng]}
                        icon={TowerIcon}
                        eventHandlers={{
                            click: () => onMarkerClick?.(menara),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 flex items-center gap-2">
                                    <span>🗼</span> {menara.nama_menara}
                                </h3>
                                <div className="text-[11px] text-slate-600 space-y-1.5">
                                    <div className="flex justify-between border-b border-slate-100 pb-1">
                                        <span className="font-semibold">ID Menara:</span>
                                        <span>{menara.id_menara}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">📍 Alamat:</p>
                                        <p>{menara.alamat || '-'}, {menara.desa}, {menara.kecamatan}</p>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-100 pt-1">
                                        <span className="font-semibold">Tinggi:</span>
                                        <span>{menara.tinggi_menara}m ({menara.struktur})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Tipe:</span>
                                        <span className="text-blue-600 font-medium uppercase text-[9px]">{menara.tipe_site}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-100 pt-1">
                                        <span className="font-semibold">Tahun:</span>
                                        <span>{menara.tahun_pembuatan}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            }
            return null;
        });
    }, [data, onMarkerClick]);

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                preferCanvas={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution={attribution}
                    url={tileUrl}
                />

                <MapViewUpdater center={center} zoom={zoom} />

                {markers}
            </MapContainer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-container {
                    background: #f8fafc !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(8px);
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
                    padding: 0;
                }
                .custom-popup .leaflet-popup-content {
                    margin: 12px;
                    width: auto !important;
                }
                .custom-popup .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.98);
                }
                .custom-tower-icon {
                    transition: transform 0.2s ease;
                }
                .custom-tower-icon:hover {
                    transform: scale(1.2) translateY(-5px);
                }
            `}} />
        </div>
    );
});
