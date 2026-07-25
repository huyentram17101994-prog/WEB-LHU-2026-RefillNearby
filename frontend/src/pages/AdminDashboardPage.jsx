import { useEffect, useState } from 'react';

import api from '../services/api';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import {

ResponsiveContainer,

BarChart,
Bar,

PieChart,
Pie,
Cell,

CartesianGrid,

XAxis,
YAxis,

Tooltip,

Legend

} from "recharts";
const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
];
function AdminDashboardPage() {


    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [statistics, setStatistics] = useState({
    topProducts: [],
    refillByMonth: []
});
const [ratingStatistics, setRatingStatistics] = useState([]);
const [topProducts, setTopProducts] = useState([]);
const [topStations, setTopStations] = useState([]);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
    const fetchDashboard = async () => {

        try {

            const response = await api.get(
                '/admin/dashboard'
            );

            setDashboard(response.data);

        } catch (error) {

            console.log(error);

        }

    };
const loadStatistics = async () => {
    try {

        const res = await api.get("/admin/refill-statistics");

        console.log("API:", res.data);
         console.log(res.data);   // kiểm tra
        setStatistics(res.data);

    } catch (err) {
        console.log(err);
    }
};
const loadRatingStatistics = async () => {

    try {

        const res = await api.get(
            "/admin/rating-statistics"
        );

        setRatingStatistics(res.data);

    } catch (err) {

        console.log(err);

    }

};
const loadTopProducts = async () => {

    try {

        const res = await api.get(
            "/admin/refill-statistics/top-products"
        );

        setTopProducts(res.data);

    } catch (err) {

        console.log(err);

    }

};
const loadTopStations = async () => {

    try {

        const res = await api.get(
            "/admin/refill-statistics/top-stations"
        );

        setTopStations(res.data);

    } catch (err) {

        console.log(err);

    }

};
const loadDashboardFilter = async () => {

    if (!fromDate || !toDate) {

        alert("Vui lòng chọn khoảng thời gian.");

        return;

    }

    try {

    const [dashboardRes, ratingRes] = await Promise.all([

        api.get(
            "/admin/dashboard-statistics/filter",
            {
                params: {
                    fromDate,
                    toDate
                }
            }
        ),

        api.get(
            "/admin/rating-statistics/filter",
            {
                params: {
                    fromDate,
                    toDate
                }
            }
        )

    ]);

    setStatistics((prev) => ({
        ...prev,
        totalQuantity: dashboardRes.data.totalQuantity,
        refillByMonth: dashboardRes.data.refillByMonth
    }));

    setTopProducts(dashboardRes.data.topProducts);

    setTopStations(dashboardRes.data.topStations);

    setRatingStatistics(ratingRes.data);

} catch (err) {

    console.log(err);

}

};
const loadRatingFilter = async () => {

    try {

        const res = await api.get(
            "/admin/rating-statistics/filter",
            {
                params: {
                    fromDate,
                    toDate
                }
            }
        );

        setRatingStatistics(res.data);

    } catch (err) {

        console.log(err);

    }

};
const clearFilter = async () => {

    setFromDate("");
    setToDate("");

    await loadStatistics();

    await loadRatingStatistics();

    await loadTopProducts();

    await loadTopStations();

};
    useEffect(() => {
       
        fetchDashboard();
        loadStatistics();
        loadRatingStatistics();
        loadTopProducts();
        loadTopStations();
}, []);


    if (!dashboard) {

        return (

            <div className="text-center mt-20 text-3xl">

                Loading...

            </div>

        );

    }
const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login');

    };
const DashboardCard = ({
    icon,
    title,
    value,
    unit,
    color,
    onClick
}) => (
    <div
        onClick={onClick}
        className="
            h-43
            bg-white
            rounded-2xl
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            cursor-pointer
            border border-gray-100
            p-6
        "
    >
        <div className="flex items-center gap-3 mb-4">

            <div className="text-3xl">

                {icon}

            </div>

            <div>

                <h3 className="font-semibold text-lg">

                    {title}

                </h3>

            </div>

        </div>

        <div className={`text-5xl font-bold ${color}`}>

            {value}

            {unit && (
                <span className="text-xl ml-2">
                    {unit}
                </span>
            )}

        </div>

        <p className="text-gray-400 mt-3 text-sm">

            Nhấn để xem chi tiết

        </p>

    </div>
);
const RatingTooltip = ({ active, payload }) => {

    if (!active || !payload || !payload.length)
        return null;

    const data = payload[0].payload;

    const total = ratingStatistics.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const percent = (
        (data.total / total) * 100
    ).toFixed(1);

    return (

        <div className="bg-white shadow-xl rounded-xl p-4 border">

            <p className="font-bold text-lg">
                ⭐ {data.rating} sao
            </p>

            <p>
                Số lượt đánh giá:
                <b> {data.total}</b>
            </p>

            <p>
                Tỷ lệ:
                <b> {percent}%</b>
            </p>

        </div>

    );

};
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">

             <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>

    <h1 className="text-5xl font-bold text-green-700">

        📊 Báo cáo & Thống kê hệ thống

    </h1>

    <p className="text-gray-600 mt-2">

        Theo dõi tình hình hoạt động của hệ thống RefillNearby

    </p>

</div>
<button
    onClick={logout}
    className="
        flex items-center gap-2
        px-4 py-2
        bg-red-500
        hover:bg-red-600
        text-white
        rounded-lg
        text-base
        font-medium
        self-start
    "
>
    <RiLogoutCircleRLine size={18} />
    Đăng xuất
</button>
                    </div>
              
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <DashboardCard
    icon="👤"
    title="Người dùng"
    value={dashboard.totalUsers}
    color="text-blue-500"
    onClick={() => navigate("/admin/users")}
/>
    
    <DashboardCard
    icon="🏪"
    title="Trạm refill"
    value={dashboard.totalStations}
    color="text-green-500"
    onClick={() => navigate("/admin/stations")}
/>

   <DashboardCard
    icon="📦"
    title="Sản phẩm"
    value={dashboard.totalProducts}
    color="text-orange-500"
    onClick={() => navigate("/admin/products")}
/>              
    <DashboardCard
    icon="♻️"
    title="Lượt refill"
    value={dashboard.totalRefills}
    color="text-emerald-500"
    onClick={() => navigate("/admin/refills")}
/>
      <DashboardCard
    icon="💧"
    title="Tổng lượng refill"
    value={dashboard.totalQuantity}
    unit="L"
    color="text-cyan-500"
    onClick={() =>
        navigate("/admin/refills/statistics")
    }
/>
                
  <DashboardCard
    icon="❤️"
    title="Yêu thích"
    value={dashboard.totalFavorites}
    color="text-red-500"
    onClick={() => navigate("/admin/favorites")}
/>
    <DashboardCard
    icon="⭐"
    title="Đánh giá"
    value={dashboard.totalReviews}
    color="text-yellow-500"
    onClick={() => navigate("/admin/reviews")}
/>
                     </div>
                     <hr className="my-10 border-gray-500" />
                     {/* ================= BÁO CÁO THỐNG KÊ ================= */}

<div className="mt-12 bg-white rounded-3xl shadow-lg p-8">

    <div className="flex items-center justify-between mb-6">

        <div>

            <h2 className="text-3xl font-bold text-green-700">
                📈 Báo cáo thống kê
            </h2>

            <p className="text-gray-500">
                Thống kê hoạt động của hệ thống RefillNearby
            </p>
  </div>

    </div>
<div className="flex gap-4 items-end flex-wrap mb-8">

    <div>
        <label className="block text-sm font-medium mb-1">
            Từ ngày
        </label>

        <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="border rounded-xl px-4 py-2"
/>
    </div>

    <div>
        <label className="block text-sm font-medium mb-1">
            Đến ngày
        </label>

       <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="border rounded-xl px-4 py-2"
/>
    </div>

    <button
    onClick={loadDashboardFilter}
    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl"
>
    Lọc
</button>
{(fromDate || toDate) && (

    <button
        onClick={clearFilter}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl ml-3"
    >
        Xóa bộ lọc
    </button>

)}    
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

    <div className="bg-white rounded-3xl shadow-lg p-6 ">

        <h3 className="text-xl font-bold mb-6">
            📈 Lượng refill theo tháng
        </h3>

        <ResponsiveContainer
            width="100%"
            height={420}
        >

            <BarChart
                data={statistics.refillByMonth}
            >

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis
    dataKey="month"
    tickFormatter={(value) => `Tháng ${value}`}
/>

                <YAxis
    label={{
        value: "(Lít)",
        angle: 0,
        position: "insideLeft"
    }}
/>
                <Tooltip
    formatter={(value) => [`${value} lít`, "Đã refill"]}
    labelFormatter={(label) => `Tháng ${label}`}
/>

                <Bar
                    dataKey="totalQuantity"
                    fill="#22c55e"
                    radius={[10,10,0,0]}
                />

            </BarChart>

        </ResponsiveContainer>

    </div>

<div className="bg-white rounded-3xl shadow-lg p-6 ">

   

    <h3 className="text-xl font-bold mb-6">
        ⭐ Phân bố đánh giá
    </h3>

    <ResponsiveContainer
        width="100%"
        height={420}
    >

        <PieChart>

            <Pie
                data={ratingStatistics}
                dataKey="total"
                nameKey="rating"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ rating, percent }) =>
                    `${rating}⭐ (${(percent * 100).toFixed(0)}%)`
                }
            >

                {
                    ratingStatistics.map((entry, index) => (

                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />

                    ))
                }

            </Pie>

           <Tooltip content={<RatingTooltip />} />
            <Legend />

        </PieChart>

    </ResponsiveContainer>

</div>
  </div>
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
  <div className="bg-white rounded-3xl shadow-lg p-6">

    <h3 className="text-2xl font-bold mb-6">
        🏆 Top 5 sản phẩm được refill nhiều nhất
    </h3>

    {(() => {

        const totalRefill = topProducts.reduce(
            (sum, item) => sum + item.total_quantity,
            0
        );

        const colors = [
            "bg-yellow-400",
            "bg-green-400",
            "bg-blue-400",
            "bg-purple-500",
            "bg-gray-500"
        ];

        return (

            <div className="space-y-6">

                {topProducts.map((item, index) => {

                    const maxValue =
                        topProducts[0]?.total_quantity || 1;

                    const width =
                        (item.total_quantity / maxValue) * 100;

                    const percent =
                        (
                            item.total_quantity /
                            totalRefill *
                            100
                        ).toFixed(1);

                    return (

                        <div key={index}>

                            <div className="flex justify-between items-center mb-2">

                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">

                                        {index === 0 && "🥇"}
                                        {index === 1 && "🥈"}
                                        {index === 2 && "🥉"}
                                        {index > 2 && `#${index + 1}`}

                                    </span>

                                    <div>

                                        <div className="font-semibold">

                                            {item.product_name}

                                        </div>

                                        <div className="text-xs text-gray-500">

                                            Chiếm {percent}% tổng lượng refill

                                        </div>

                                    </div>

                                </div>

                                <span className="font-bold text-green-700">

                                    {item.total_quantity} lít

                                </span>

                            </div>

                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                <div
                                    className={`${colors[index]} h-full transition-all duration-700`}
                                    style={{
                                        width: `${width}%`
                                    }}
                                />

                            </div>

                        </div>

                    );

                })}

            </div>

        );

    })()}

</div>
<div className="bg-white rounded-3xl shadow-lg p-6">

    <h3 className="text-2xl font-bold mb-6">
        🏪 Top 5 trạm refill nhiều nhất
    </h3>

    {(() => {

        const totalQuantity = topStations.reduce(
            (sum, item) => sum + item.totalQuantity,
            0
        );

        const colors = [
            "bg-yellow-400",
            "bg-green-400",
            "bg-blue-400",
            "bg-purple-500",
            "bg-gray-500"
        ];

        return (

            <div className="space-y-6">

                {topStations.map((item, index) => {

                    const maxValue =
                        topStations[0]?.totalQuantity || 1;

                    const width =
                        (item.totalQuantity / maxValue) * 100;

                    const percent =
                        (
                            item.totalQuantity /
                            totalQuantity *
                            100
                        ).toFixed(1);

                    return (

                        <div key={index}>

                            <div className="flex justify-between items-center mb-2">

                                <div className="flex items-center gap-3">

                                    <span className="text-2xl">

                                        {index === 0 && "🥇"}
                                        {index === 1 && "🥈"}
                                        {index === 2 && "🥉"}
                                        {index > 2 && `#${index + 1}`}

                                    </span>

                                    <div>

                                        <div className="font-semibold">

                                            {item.station_name}

                                        </div>

                                        <div className="text-xs text-gray-500">

                                            Chiếm {percent}% tổng lượng refill

                                        </div>

                                    </div>

                                </div>

                                <span className="font-bold text-green-700">

                                    {item.totalQuantity} lít

                                </span>

                            </div>

                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                <div
                                    className={`${colors[index]} h-full transition-all duration-700`}
                                    style={{
                                        width: `${width}%`
                                    }}
                                />

                            </div>

                        </div>

                    );

                })}

            </div>

        );

    })()}

</div>
</div>

</div>
        </div>

    </div>

    );

}

export default AdminDashboardPage;
       