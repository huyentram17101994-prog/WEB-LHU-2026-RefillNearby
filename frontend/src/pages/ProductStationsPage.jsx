import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
function ProductStationsPage() {
     const navigate = useNavigate();

    const { productName } = useParams();

    const [stations, setStations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

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
useEffect(() => {

    if(userLocation){

        fetchData();

    }

}, [userLocation]);
    const fetchData = async () => {

        try {

            const response =
                await api.get(
                    `/products/stations/${productName}`
                );

           let data = response.data;

           
if(userLocation){

    data.sort(

        (a,b) =>

        calculateDistance(

            userLocation[0],
            userLocation[1],

            a.latitude,
            a.longitude

        )

        -

        calculateDistance(

            userLocation[0],
            userLocation[1],

            b.latitude,
            b.longitude

        )

    );

}
setStations(data);
        } catch (error) {

            console.log(error);

        }

    };
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
//========hàm đk nhận thông báo=======
const registerNotification = async (stationId, productId) => {

    try {

        const token = localStorage.getItem("token");

        await api.post(
            "/product-notifications/register",
            {
                station_id: stationId,
                product_id: productId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("✅ Đã đăng ký nhận thông báo khi có hàng.");

    } catch (error) {

        console.log(error);

        alert(error.response?.data?.message || "Đăng ký thất bại.");

    }

};
    return (

        <div className="min-h-screen p-6 bg-gradient-to-br from-green-300 via-white to-green-500">
 <button
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center gap-2
                        mb-8
                        ml-2
                        px-5 py-3
                        bg-white
                        rounded-full
                        shadow-md
                        hover:shadow-lg
                        hover:bg-gray-50
                        transition-all
                        duration-200
                        text-base
                        font-semibold
                        text-gray-700
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>
                 <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-5xl text-green-600 text-center font-bold mb-6">

                 {productName}

            </h1>
{
    stations.length > 0 && (

        <img
            src={
                stations[0].image_url.startsWith('/uploads')
                ? `http://localhost:5000${stations[0].image_url}`
                : stations[0].image_url
            }
            alt={stations[0].product_name}
            className="
                w-72
                h-72
                object-cover
                rounded-2xl
                mx-auto
            "
        />
    )
}
            <div className="space-y-4 p-5">

                {

                    stations.map((item) => (

                        <div className="flex justify-between items-center  bg-white/80
                                p-5
                                rounded-3xl
                                shadow
">

                        <div>
                            <h2 className="text-2xl font-bold">

                                {item.station_name}

                            </h2>

                            <p>

                                📍Địa chỉ: {item.address}

                            </p>

                            <p className="text-red-600 font-semibold">

                                💰 {Number(item.price)
                                    .toLocaleString()}
                                đ

                            </p>
                     {
item.stock_status ?

<span
className="
text-green-600
font-bold
"
>
🟢 Còn hàng
</span>

:

<span
className="
text-red-600
font-bold
"
>
🔴 Hết hàng
</span>
}

{
userLocation && (

<p
className="
text-blue-600
font-semibold
"
>

📏 Khoảng cách:   

 {

calculateDistance(

userLocation[0],

userLocation[1],

item.latitude,

item.longitude

)

.toFixed(1)

}

km

</p>

)
}
</div>
<div className="mt-5 flex justify-center">
{
    !item.stock_status && (

        <button
            onClick={() =>
                registerNotification(
                    item.station_id,
                    item.product_id
                )
            }
            className="
                bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
                
            "
        >
            🔔 Thông báo khi có hàng
        </button>

    )
}
    <button
        onClick={() =>
            navigate(`/stations/${item.station_id}`)
        }
        className="
            bg-green-500
            hover:bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
        "
    >
         Xem trạm
    </button>

</div>

                        </div>

                    ))

                }
  </div>
            </div>

        </div>

    );

}

export default ProductStationsPage;