import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { IoChevronBack } from "react-icons/io5";

function NotificationPage() {

    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();

    // =============================
    // Lấy danh sách thông báo
    // =============================

    const fetchNotifications = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get(

                "/notifications",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setNotifications(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // =============================
    // Đánh dấu đã đọc
    // =============================

    const markNotificationAsRead = async (notificationId) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(

                `/notifications/${notificationId}/read`,

                {},

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            // cập nhật badge ngoài Home

            const countRes = await api.get(

                "/notifications/unread-count",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            localStorage.setItem(

                "unreadNotification",

                countRes.data.unread_count

            );

            fetchNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchNotifications();

    }, []);

    return (

        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 p-6">

            {/* BACK */}

            <button

                onClick={() => navigate(-1)}

                className="
                    flex
                    items-center
                    gap-2
                    bg-white
                    rounded-full
                    shadow-md
                    px-5
                    py-3
                    hover:bg-gray-100
                    transition
                    mb-8
                "

            >

                <IoChevronBack size={22} />

                Quay lại

            </button>

            {/* TITLE */}

            <div className="flex items-center justify-center gap-3 mb-10">

                <span className="text-5xl">

                    🔔

                </span>

                <h1 className="text-5xl font-bold text-red-500">

                    Thông báo

                </h1>

            </div>

            {

                notifications.length === 0 ?

                (

                    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-16 text-center">

                        <h2 className="text-3xl font-bold text-gray-700 mb-4">

                            Bạn chưa có thông báo nào

                        </h2>

                        <p className="text-gray-500 text-lg">

                            Khi sản phẩm có hàng trở lại,

                            thông báo sẽ xuất hiện tại đây.

                        </p>

                    </div>

                )

                :

                (

                    <div className="max-w-5xl mx-auto space-y-5">

                        {

                            notifications.map(item => (

                                <div

                                    key={item.notification_id}

                                    onClick={() =>
                                        markNotificationAsRead(
                                            item.notification_id
                                        )
                                    }

                                    className={`
                                        rounded-3xl
                                        shadow-lg
                                        p-6
                                        cursor-pointer
                                        transition-all
                                        duration-300
                                        hover:shadow-2xl
                                        hover:-translate-y-1

                                        ${

                                            item.is_read

                                            ?

                                            "bg-white"

                                            :

                                            "bg-green-100 border-l-8 border-green-500"

                                        }

                                    `}

                                >

                                    {/* HEADER */}

                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-2xl font-bold text-red-500">

                                            {item.title}

                                        </h2>

                                        <span className="text-sm text-gray-500">

                                            {item.created_at}

                                        </span>


                                        

                                    </div>

                                

                                    {/* BODY */}

                                    <div className="flex gap-5 items-center">

                                        {/* IMAGE */}

                                        <img

                                            src={`http://localhost:5000${item.image_url}`}

                                            alt={item.product_name}

                                            className="
                                                w-32
                                                h-32
                                                rounded-2xl
                                                object-cover
                                                shadow-md
                                                border
                                                flex-shrink-0
                                            "

                                        />

                                        {/* INFO */}

                                        <div className="flex-1 flex flex-col justify-center">

                                            <p className="text-xl font-bold text-green-700 mb-2">

                                         {item.product_name}

                                            </p>

                                            <p className="text-gray-700 font-bold mb-2 text-xl">

                                            🏪 {item.station_name}

                                            </p>
                                            <p className="text-gray-700 mb-2 text-xl">

                                            - Địa chỉ: {item.station_address}

                                            </p>

                                        <button
    onClick={(e) => {
        e.stopPropagation();
        markNotificationAsRead(item.notification_id);
        navigate(`/stations/${item.station_id}`);
    }}
    className="
        ml-auto
        bg-green-500
        hover:bg-green-600
        text-white
        px-6
        py-2
        rounded-xl
        font-semibold
        shadow-md
        hover:shadow-lg
        transition
        whitespace-nowrap
    "
>
    Xem trạm
</button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default NotificationPage;