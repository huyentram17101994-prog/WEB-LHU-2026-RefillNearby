import { useEffect, useState } from 'react';

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet';

import L from 'leaflet';

import { useNavigate } from 'react-router-dom';




// FIX ICON

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

});




// ================= DISTANCE FUNCTION =================

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};




function MapView({ stations }) {

    const navigate = useNavigate();

    const [userLocation, setUserLocation] =
        useState(null);




    // ================= GET USER LOCATION =================

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation([
                    position.coords.latitude,
                    position.coords.longitude
                ]);

            },

            (error) => {

                console.log(error);

            }

        );

    }, []);




    return (

        <div className="rounded-3xl overflow-hidden shadow-2xl">

            <MapContainer
                center={
                    userLocation || [10.9804, 108.2615]
                }
                zoom={13}
                scrollWheelZoom={true}
                className="h-[500px] w-full"
                style={{ zIndex: 1 }}
            >

                {/* MAP TILE */}

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />




                {/* USER MARKER */}

                {
                    userLocation && (

                        <Marker
                            position={userLocation}
                        >

                            <Popup>

                                📍 Bạn đang ở đây

                            </Popup>

                        </Marker>

                    )
                }




                {/* STATIONS */}

                {
                    stations.map((station) => (

                        <Marker
                            key={station.station_id}
                            position={[
                                station.latitude,
                                station.longitude
                            ]}
                        >

                            <Popup>

                                <div className="space-y-2">

                                    <h2 className="font-bold text-lg">

                                        {station.station_name}

                                    </h2>





                                    <p>

                                        📍 {station.address}

                                    </p>





                                    <p className="text-green-600 font-semibold">

                                        📏 {
                                            userLocation
                                                ? calculateDistance(
                                                    userLocation[0],
                                                    userLocation[1],
                                                    station.latitude,
                                                    station.longitude
                                                ).toFixed(1)
                                                : '...'
                                        }
                                        km

                                    </p>





                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/stations/${station.station_id}`
                                            )
                                        }
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
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
                                     className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                                    >

                                        🧭 Chỉ đường

                                    </button>                  
                                </div>

                            </Popup>


                        </Marker>

                    ))
                }

            </MapContainer>

        </div>

    );

}

export default MapView;