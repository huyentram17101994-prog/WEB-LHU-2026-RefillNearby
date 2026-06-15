import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";

function ProductsPage() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState('');

    const navigate = useNavigate();





    // ================= FETCH PRODUCTS =================

    const fetchProducts = async () => {

        try {

            const response = await api.get('/products');

            setProducts(response.data);

        } catch (error) {

            console.log(error);

        }

    };





    // ================= SEARCH =================

    const filteredProducts = products.filter((product) =>

        product.product_name
            .toLowerCase()
            .includes(search.toLowerCase())

    );





    // ================= USE EFFECT =================

    useEffect(() => {

        fetchProducts();

    }, []);





    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">



            {/* HEADER */}

            <div className="flex items-center gap-5 mb-10">
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

                <h1 className="text-5xl text center font-extrabold text-center text-green-600 mb-12">

                            📦 Sản phẩm Refill

                </h1>

            </div>





            {/* SEARCH */}

            <div className="mb-10">

                <input
                    type="text"
                    placeholder="🔍 Tìm sản phẩm refill..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full p-5 rounded-3xl border border-gray-200 shadow-lg focus:outline-none focus:ring-3 focus:ring-green-400 text-lg"
                />

            </div>





            {/* PRODUCTS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {
                    filteredProducts.map((product) => (

                        <div
                            key={product.product_id}
                            className="bg-white rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                        >




                            {/* IMAGE */}

                            <img
                                src={`http://localhost:5000${product.image_url}`}
    alt={product.product_name}
                                className="w-full h-64 object-cover"
                            />





                            {/* CONTENT */}

                            <div className="p-6">

                                <h2 className="text-3xl font-bold text-gray-800 mb-4">

                                    {product.product_name}

                                </h2>





                                <p className="text-2xl text-green-600 font-bold mb-4">

                                    {Number(product.price).toLocaleString('vi-VN')}
                                    {' '}
                                    VNĐ

                                </p>





                                <p className="text-lg text-gray-600 mb-6">

                                    {product.description}

                                </p>





                                <button
                                    onClick={() =>
                                        navigate(`/stations/${product.station_id}`)
                                    }
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold transition"
                                >

                                    Xem trạm bán

                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default ProductsPage;