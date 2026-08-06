import { useEffect, useState } from 'react';
import VietnamSovereigntyLayer from "./VietnamSovereigntyLayer";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// FIX DEFAULT LEAFLET ICON
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// ICON ĐÁNH DẤU VỊ TRÍ NGUỜI DÙNG: GIỐNG HỆT ICON TRẠM NHƯNG ĐỔI THÀNH MÀU ĐỎ (LEAFLET MARKER HUE-ROTATE)
const userRedPinIcon = L.divIcon({
    className: 'user-leaflet-red-marker',
    html: `
        <div style="position: relative; width: 25px; height: 41px;">
            <img 
                src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" 
                style="width: 25px; height: 41px; filter: hue-rotate(145deg) saturate(350%) brightness(90%); cursor: pointer;" 
                alt="Vị trí của bạn"
            />
            <img 
                src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png" 
                style="position: absolute; top: 0; left: 0; width: 41px; height: 41px; z-index: -1; pointer-events: none; max-width: none;" 
                alt=""
            />
        </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// COMPONENT ĐỊNH VỊ VÀ TỰ ĐỘNG BAY TỚI VỊ TRÍ CỦA TÔI KHI CÓ DỮ LIỆU
function RecenterMap({ location }) {
    const map = useMap();
    useEffect(() => {
        if (location && Array.isArray(location) && location.length === 2 && location[0] && location[1]) {
            map.flyTo(location, 13, { animate: true, duration: 1.2 });
        }
    }, [location, map]);
    return null;
}

// CÔNG THỨC TÍNH KHOẢNG CÁCH KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

function MapView({ stations = [], userLocation: propUserLocation }) {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(propUserLocation || null);

    // 1. Cập nhật state khi propUserLocation từ HomePage thay đổi
    useEffect(() => {
        if (propUserLocation && Array.isArray(propUserLocation) && propUserLocation.length === 2 && propUserLocation[0] && propUserLocation[1]) {
            setUserLocation(propUserLocation);
        } else if (!propUserLocation) {
            const isGranted = localStorage.getItem("locationPermission") === "granted";
            if (!isGranted) {
                setUserLocation(null);
            }
        }
    }, [propUserLocation]);

    // 2. Chỉ tự động lấy vị trí từ localStorage NẾU ĐÃ ĐƯỢC CHO PHÉP (granted)
    useEffect(() => {
        const isGranted = localStorage.getItem("locationPermission") === "granted";
        const lat = Number(localStorage.getItem("latitude"));
        const lng = Number(localStorage.getItem("longitude"));

        if (isGranted && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            setUserLocation([lat, lng]);
        } else {
            setUserLocation(null);
        }
    }, []);

    const defaultCenter = userLocation || [10.9804, 108.2615];

    return (
        <div className="rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100">
            <MapContainer
                center={defaultCenter}
                zoom={userLocation ? 13 : 6}
                minZoom={5}
                maxZoom={18}
                maxBounds={[
                    [6.5, 101],
                    [24.5, 118]
                ]}
                maxBoundsViscosity={1.0}
                style={{ height: "550px", width: "100%" }}
            >
                <RecenterMap location={userLocation} />

                {/* TILE MAP */}
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                />

                <VietnamSovereigntyLayer />

                {/* ICON VỊ TRÍ CỦA TÔI */}
                {userLocation && userLocation[0] && userLocation[1] && (
                    <Marker position={userLocation} icon={userRedPinIcon} zIndexOffset={1000}>
                        <Popup minWidth={190} maxWidth={190}>
                            <div className="p-1 text-center font-sans">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full font-extrabold text-xs border border-red-200 shadow-xs">
                                    📍 Vị trí của bạn
                                </span>
                                <p className="text-[11px] text-gray-500 font-semibold mt-2">
                                    Tọa độ: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* DANH SÁCH TRẠM */}
                {stations.map((station) => {
                    const distance = userLocation
                        ? calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            station.latitude,
                            station.longitude
                        ).toFixed(1)
                        : null;

                    return (
                        <Marker
                            key={station.station_id}
                            position={[station.latitude, station.longitude]}
                        >
                            <Popup minWidth={230} maxWidth={230}>
                                <div className="w-52 space-y-2 p-1 font-sans">
                                    {/* TIÊU ĐỀ TRẠM */}
                                    <h2 className="font-extrabold text-sm text-gray-900 truncate pb-1 border-b border-gray-100" title={station.station_name}>
                                        🏪 {station.station_name}
                                    </h2>

                                    {/* ĐỊA CHỈ TRẠM */}
                                    <p className="text-xs text-gray-600 truncate flex items-center gap-1" title={station.address}>
                                        <span className="text-red-500 shrink-0">📍</span>
                                        <span className="truncate">{station.address}</span>
                                    </p>

                                    {/* KHOẢNG CÁCH */}
                                    <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                                        <span className="shrink-0">📏</span>
                                        <span>{distance ? `${distance} km từ vị trí của bạn` : 'Đang tính khoảng cách...'}</span>
                                    </p>

                                    {/* CÁC NÚT THAO TÁC */}
                                    <div className="flex flex-col gap-1.5 pt-1.5">
                                        <button
                                            onClick={() => navigate(`/stations/${station.station_id}`)}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            Xem chi tiết
                                        </button>

                                        <button
                                            onClick={() => {
                                                window.open(
                                                    `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}&travelmode=driving`,
                                                    '_blank'
                                                );
                                            }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            🧭 Chỉ đường
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

export default MapView;