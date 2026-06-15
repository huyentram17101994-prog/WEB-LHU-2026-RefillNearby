import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function AdminRefillHistoryPage() {

    const navigate = useNavigate();

    const [refills, setRefills] = useState([]);

    const [search, setSearch] = useState('');

    useEffect(() => {

        loadRefills();

    }, []);

    const loadRefills = async () => {

        try {

            const res =
                await api.get('/admin/refills');

            setRefills(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const filteredRefills = refills.filter(refill =>

        refill.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        refill.station_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        refill.product_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center gap-2
                        mb-8
                        px-5 py-3
                        bg-white
                        rounded-full
                        shadow-md
                        hover:shadow-lg
                        hover:bg-gray-50
                        transition
                        text-gray-700
                        font-semibold
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>

                <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                    ♻️ Quản lý lượt refill

                </h1>

                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="🔍 Tìm người dùng, trạm hoặc sản phẩm..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
                        "
                    />

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-50 text-green-700">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Người dùng
                                </th>

                                <th className="p-4 text-left">
                                    Trạm refill
                                </th>

                                <th className="p-4 text-left">
                                    Sản phẩm
                                </th>

                                <th className="p-4 text-center">
                                    Số lượng
                                </th>

                                <th className="p-4 text-left">
                                    Ngày refill
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredRefills.map(refill => (

                                <tr
                                    key={refill.refill_id}
                                    className="
                                        border-b
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    <td className="p-4">
                                        {refill.refill_id}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {refill.full_name}
                                    </td>

                                    <td className="p-4">
                                        {refill.station_name}
                                    </td>

                                    <td className="p-4">
                                        {refill.product_name}
                                    </td>

                                    <td className="p-4 text-center">

                                        <span className="
                                            px-3 py-1
                                            rounded-full
                                            bg-cyan-100
                                            text-cyan-700
                                            font-semibold
                                        ">
                                            {refill.quantity} L
                                        </span>

                                    </td>

                                    <td className="p-4">

                                        {
                                            new Date(
                                                refill.refill_date
                                            ).toLocaleDateString(
                                                'vi-VN'
                                            )
                                        }

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminRefillHistoryPage;