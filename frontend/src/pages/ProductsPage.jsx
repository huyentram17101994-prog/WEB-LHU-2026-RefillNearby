import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import useFavorite from "../hooks/useFavorite";

function ProductsPage() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState('');

    const navigate = useNavigate();
   const {

    toggleFavorite,
    isFavorite

   

} = useFavorite("products");



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

        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-500 p-6">

            {/* HEADER */}

           
                <div className="relative mb-10">
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

                <h1 className="text-5xl text-center font-extrabold text-center text-green-600 mb-12">

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
                    className="w-full p-4 rounded-3xl border border-gray-100 shadow-lg focus:outline-none focus:ring-3 focus:ring-green-400 text-lg"
                />

            </div>





            {/* PRODUCTS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                {
                    filteredProducts.map((product) => (

                        <div
                            key={product.product_id}
                            className="
bg-white/80
backdrop-blur-lg
rounded-[30px]
overflow-hidden
shadow-xl
hover:shadow-2xl
hover:-translate-y-2
transition
duration-300
w-70
mx-auto
"
                        >




                            {/* IMAGE */}
                            <div className="relative">
                            <img
                                src={`http://localhost:5000${product.image_url}`}
    alt={product.product_name}
                                className="w-full h-64 object-cover"
                            />
                            {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/20"></div>

                                {/* FAVORITE */}

                                <button
    onClick={() => toggleFavorite(product.product_id)}
    
    className="
        absolute
        top-4
        right-4
        bg-white/80
        backdrop-blur-md
        rounded-full
        w-12
        h-12
        text-2xl
        shadow-lg
        hover:scale-125
        active:scale-90
        transition-all
        duration-200
    "
>

    {
        isFavorite(product.product_id)

        ?

        "❤️"

        :

        "🤍"
    }

</button>

                                  </div>

                            {/* CONTENT */}

                            <div className="p-4">
    <h3 className="text-xl font-semibold mb-3 line-clamp-2 min-h-[56px]">
    {product.product_name}
    </h3>

    <p className="text-gray-700 mb-2">
        💰 Giá từ: {Number(product.min_price).toLocaleString()} đ
    </p>

    <p className="text-gray-600 mb-4">
        📍 Có tại: {product.total_stations} trạm refill
    </p>

    <button
    onClick={() =>
        navigate(
            `/products/${encodeURIComponent(product.product_name)}`
        )
    }
        className="
            w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold mt-auto"
                         
    >
        Xem chi tiết
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
    