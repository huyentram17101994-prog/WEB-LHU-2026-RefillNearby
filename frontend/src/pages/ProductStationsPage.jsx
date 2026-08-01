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

       

            <div className="
    grid
    grid-cols-1
    md:grid-cols-[300px_1fr]
gap-2
    items-center
">

                {/* IMAGE */}

               <div className="flex justify-center">

                    <img
                        src={
                            stations[0].image_url.startsWith('/uploads')
                            ? `http://localhost:5000${stations[0].image_url}`
                            : stations[0].image_url
                        }
                        alt={stations[0].product_name}
                        className="
                            w-48
                            h-48
                            object-cover
                            rounded-3xl
                            shadow-lg
                            border
                            border-green-500  
                           
                        "
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="
    bg-white/80
    backdrop-blur-sm
    border
    border-white                 
    rounded-2xl
    p-2
    mb-2
">

                    <h2 className="
                        text-2xl
                        font-bold
                        text-gray-800
                        mb-3
                    ">
                        📝 Giới thiệu sản phẩm
                    </h2>

                    <p className="
                        text-gray-700
                        text-lg
                        leading-8
                    ">
                        {stations[0].description ||
                            'Chưa có thông tin mô tả cho sản phẩm này.'}
                    </p>

                    <div className="
                        mt-3
                        flex
                        items-center
                        gap-3
                        text-green-600
                        font-semibold
                    ">
                        ♻️
                        <span>
                            Sản phẩm có thể refill
                        </span>
                    </div>

                </div>

            </div>

    )
}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {stations.map((item) => (

    <div
        key={item.station_id}
        className="
           bg-white/30
        backdrop-blur-lg
        rounded-3xl
        shadow-lg
        p-5
        hover:shadow-xl
        hover:-translate-y-1
        transition
        flex
        flex-col
        h-full
        border
        border-white
        "
    >

        {/* TOP */}
        <div className="flex justify-between items-center">
             
            <h2 className="
    text-xl
    font-bold
    text-gray-800
    mb-1

">
    🏪 {item.station_name}
</h2>
</div>
        {/* ADDRESS */}
        <p className="
    text-gray-600
    mb-2

">
    📍 {item.address}
</p>


       <div className="
    flex
    flex-wrap
    items-center
    gap-2
    mb-3
">

    {/* PRICE */}
    <span className="text-red-600 font-semibold">
        💰 {Number(item.price).toLocaleString()} đ
    </span>

    {/* STOCK */}
    {item.stock_status ? (

        <span className="text-green-600 font-bold">
            🟢 Còn hàng
        </span>

    ) : (

        <span className="text-red-600 font-bold">
            🔴 Hết hàng
        </span>

    )}

    {/* DISTANCE */}
    {userLocation && (

        <span className="text-gray-600">
            📏{' '}
            {calculateDistance(
                userLocation[0],
                userLocation[1],
                item.latitude,
                item.longitude
            ).toFixed(1)}
            km
        </span>

    )}

</div>
{/* BUTTONS */}

<div className="flex justify-center gap-2">

    {/* HẾT HÀNG */}
    {!item.stock_status && (

        <button
            onClick={() =>
                registerNotification(
                    item.station_id,
                    item.product_id
                )
            }
            className="
                flex-1
                h-9
                bg-orange-500
                hover:bg-orange-600
                text-white
                rounded-xl
                font-semibold
                transition
            "
        >
            🔔 Nhận thông báo có hàng
        </button>

    )}

    {/* XEM TRẠM */}
    <button
        onClick={() =>
            navigate(`/stations/${item.station_id}`)
        }
        className={`
            h-9
            bg-green-500
            hover:bg-green-600
            text-white
            rounded-xl
            font-semibold
            transition
            ${
                !item.stock_status
                    ? 'flex-1'
                    : 'w-56'
            }
        `}
    >
        Xem trạm
    </button>

</div>
    </div>

))}
</div>
            </div>

        </div>

    );

}

export default ProductStationsPage;