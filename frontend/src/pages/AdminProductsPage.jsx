import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const res =
                await api.get('/admin/products');

            setProducts(res.data);

        } catch (error) {

            console.log(error);

        }

    };
const filteredProducts = products.filter(product => {

    const matchSearch =

        product.product_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        product.brand
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        product.station_name
            ?.toLowerCase()
            .includes(search.toLowerCase());

    const matchStatus =

        statusFilter === ''

        ||

        String(product.stock_status)
            === statusFilter;

    return matchSearch && matchStatus;

});
const deleteProduct = async (id) => {

    if (!window.confirm('Xóa sản phẩm này?')) {

        return;

    }

    try {

        await api.delete(
            `/admin/products/${id}`
        );

        loadProducts();

    } catch (error) {

        console.log(error);

    }

};
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
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>

            <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                📦 Quản lý sản phẩm

            </h1>

            <div className="flex gap-4 mb-6">

                <input
                    type="text"
                    placeholder="🔍 Tìm sản phẩm, thương hiệu hoặc trạm..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        flex-1
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

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="
                        text-center
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        px-4
                        py-3
                        shadow-sm
                        appearance-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-400
                         min-w-[120px]
                    "
                >
                    <option value="">
                        Tất cả
                    </option>

                    <option value="true">
                        Còn hàng
                    </option>

                    <option value="false">
                        Hết hàng
                    </option>

                </select>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="bg-green-50 text-green-700">

                            <th className="p-4 text-left">ID</th>

                            <th className="p-4 text-left">
                                Hình ảnh
                            </th>

                            <th className="p-4 text-left">
                                Sản phẩm
                            </th>

                            <th className="p-4 text-left">
                                Thương hiệu
                            </th>

                            <th className="p-4 text-left">
                                Giá
                            </th>

                            <th className="p-4 text-left">
                                Trạm
                            </th>

                            <th className="p-4 text-left">
                                Trạng thái
                            </th>

                            <th className="p-4 text-left">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredProducts.map(product => (

                            <tr
                                key={product.product_id}
                                className="
                                    border-b
                                    hover:bg-green-50
                                    transition
                                "
                            >

                                <td className="p-4">
                                    {product.product_id}
                                </td>

                                <td className="p-4">

                                    <img
                                        src={`http://localhost:5000${product.image_url}`}
                                        alt={product.product_name}
                                        className="
                                            w-16
                                            h-16
                                            rounded-xl
                                            object-cover
                                        "
                                    />

                                </td>

                                <td className="p-4 font-semibold">

                                    {product.product_name}

                                </td>

                                <td className="p-4">

                                    {product.brand}

                                </td>

                                <td className="p-4 font-semibold text-green-600">

                                    {Number(
                                        product.price
                                    ).toLocaleString('vi-VN')} VNĐ

                                </td>

                                <td className="p-4">

                                    {product.station_name}

                                </td>

                                <td className="p-4">

                                    {product.stock_status ? (

                                        <span className="
                                            px-3 py-1
                                            rounded-full
                                            bg-green-100
                                            text-green-700
                                            font-semibold
                                            text-sm
                                        ">
                                            🟢 Còn hàng
                                        </span>

                                    ) : (

                                        <span className="
                                            px-3 py-1
                                            rounded-full
                                            bg-red-100
                                            text-red-700
                                            font-semibold
                                            text-sm
                                        ">
                                            🔴 Hết hàng
                                        </span>

                                    )}

                                </td>

                                <td className="p-4">

                                    <button
                                        onClick={() =>
                                            deleteProduct(
                                                product.product_id
                                            )
                                        }
                                        className="
                                            bg-red-500
                                            hover:bg-red-600
                                            text-white
                                            px-4 py-2
                                            rounded-xl
                                            font-semibold
                                        "
                                    >
                                        🗑 Xóa
                                    </button>

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

export default AdminProductsPage;