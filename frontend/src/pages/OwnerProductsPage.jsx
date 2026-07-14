import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function OwnerProductsPage() {
    const [searchProduct, setSearchProduct] =useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [previewImage, setPreviewImage] =useState('');

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [editingProductId, setEditingProductId] =
        useState(null);

    const [productImageFile, setProductImageFile] =
        useState(null);
    const [stations, setStations] = useState([]);
const [categories, setCategories] = useState([]);
    const [productForm, setProductForm] = useState({
        station_id: '',
        category_id: '',
        product_name: '',
        brand: '',
        price: '',
        stock_status: '',
        description: '',
        image_url: ''
    });

    useEffect(() => {
        loadData();
    }, []);

const loadData = async () => {

    try {

        console.log('load products');
        const productRes =
            await api.get('/owner/products');

        console.log('load stations');
        const stationRes =
            await api.get('/owner/my-stations');

        console.log('load categories');
        const categoryRes =
            await api.get('/owner/categories');

        console.log(categoryRes.data);

        setProducts(productRes.data);
        setStations(stationRes.data);
        setCategories(categoryRes.data);

    } 
catch (error) {

        console.log('ERROR API');
        console.log(error.response?.config?.url);
        console.log(error.response?.status);
        console.log(error);

    }
};
    const createProduct = async () => {

        try {

            let imageUrl = '';

            if (productImageFile) {

                const formData =
                    new FormData();

                formData.append(
                    'image',
                    productImageFile
                );

                const uploadRes =
                    await api.post(
                        '/owner/upload-product-image',
                        formData
                    );

                imageUrl =
                    uploadRes.data.image_url;

            }

            await api.post(
                '/owner/products',
                {
                    ...productForm,
                    image_url: imageUrl
                }
            );

            alert(
                'Thêm sản phẩm thành công'
            );

            setProductForm({
                station_id: '',
                category_id: '',
                product_name: '',
                brand: '',
                price: '',
                stock_status: '',
                description: '',
                image_url: ''
            });

            setProductImageFile(null);
            setPreviewImage('');
            loadData();

        } catch (error) {

            console.log(error);

        }

    };

    const deleteProduct = async (id) => {

        if (
            !window.confirm(
                'Bạn có chắc muốn xóa sản phẩm này?'
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/owner/products/${id}`
            );

            loadData();

        } catch (error) {

            console.log(error);

        }

    };

    const editProduct = (product) => {

        setProductImageFile(null);
        setPreviewImage(
    `http://localhost:5000${product.image_url}`
);
        setProductForm({
            station_id: product.station_id,
            category_id: product.category_id,
            product_name: product.product_name,
            brand: product.brand,
            price: product.price,
            stock_status: product.stock_status,
            description: product.description,
            image_url: product.image_url
        });

        setEditingProductId(
            product.product_id
        );

    };

    const updateProduct = async () => {

        try {

            let imageUrl =
                productForm.image_url;

            if (productImageFile) {

                const formData =
                    new FormData();

                formData.append(
                    'image',
                    productImageFile
                );

                const uploadRes =
                    await api.post(
                        '/owner/upload-product-image',
                        formData
                    );

                imageUrl =
                    uploadRes.data.image_url;

            }

            await api.put(
                `/owner/products/${editingProductId}`,
                {
                    ...productForm,
                    image_url: imageUrl
                }
            );

            alert(
                'Cập nhật thành công'
            );

            setEditingProductId(null);

            setProductImageFile(null);
            setPreviewImage('');
            setProductForm({
                station_id: '',
                category_id: '',
                product_name: '',
                brand: '',
                price: '',
                stock_status: '',
                description: '',
                image_url: ''
            });

            loadData();

        } catch (error) {

            console.log(error);

        }

    };

    const toggleProductStatus = async (
        productId
    ) => {

        try {

            await api.put(
                `/owner/products/${productId}/toggle-status`
            );

            loadData();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
             
            

                 {/* BACK BUTTON */}
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
<div className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-green-700 mb-8">
                    📦 Quản lý sản phẩm
                </h1>

     

            <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="text-2xl font-bold mb-4">

                    {editingProductId
                        ? 'Cập nhật sản phẩm'
                        : 'Thêm sản phẩm'}

                </h2>

                <select
    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
    value={productForm.station_id}
    onChange={(e) =>
        setProductForm({
            ...productForm,
            station_id: e.target.value
        })
    }
>

    <option value="">
        Chọn trạm
    </option>

    {stations.map((station) => (

        <option
            key={station.station_id}
            value={station.station_id}
        >
            {station.station_name}
        </option>

    ))}

</select>

                <select
    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
    value={productForm.category_id}
    onChange={(e) =>
        setProductForm({
            ...productForm,
            category_id: e.target.value
        })
    }
>

    <option value="">
        Chọn danh mục
    </option>

    {categories.map((category) => (

        <option
            key={category.category_id}
            value={category.category_id}
        >
            {category.category_name}
        </option>

    ))}

</select>
                <input
                    placeholder="Tên sản phẩm"
                    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                    value={productForm.product_name}
                    onChange={(e) =>
                        setProductForm({
                            ...productForm,
                            product_name:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Thương hiệu"
                    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                    value={productForm.brand}
                    onChange={(e) =>
                        setProductForm({
                            ...productForm,
                            brand:
                                e.target.value
                        })
                    }
                />

                <input
                    placeholder="Giá"
                    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                    value={productForm.price}
                    onChange={(e) =>
                        setProductForm({
                            ...productForm,
                            price:
                                e.target.value
                        })
                    }
                />
    <select
    className="bw-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
    value={productForm.stock_status}
    onChange={(e) =>
        setProductForm({
            ...productForm,
            stock_status: e.target.value
        })
    }
>

    <option value="">
        Chọn trạng thái
    </option>

    <option value="1">
        Còn hàng
    </option>

    <option value="0">
        Hết hàng
    </option>

</select>
                <textarea
                    placeholder="Mô tả"
                    className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                    value={productForm.description}
                    onChange={(e) =>
                        setProductForm({
                            ...productForm,
                            description:
                                e.target.value
                        })
                    }
                />

                        <div className="mb-4">

    <label className="block font-semibold mb-2">
        Hình ảnh sản phẩm
    </label>

    <input
    type="file"
    accept="image/*"
    className="
        w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
    "
    onChange={(e) => {

        const file =
            e.target.files[0];

        setProductImageFile(file);

        if (file) {

            setPreviewImage(
                URL.createObjectURL(file)
            );

        }

    }}
/>


    {
    previewImage && (

        <div className="mt-3">

            <img
                src={previewImage}
                alt="preview"
                className="
                    w-30
                    h-30
                    object-cover
                    rounded-xl
                    border
                "
            />

        </div>

    )
}

{
    productImageFile && (
        <p className="mt-2 text-sm text-green-600">
            📷 {productImageFile.name}
        </p>
    )
}
</div>
                {editingProductId ? (

                    <div className="flex gap-2">

                        <button
                            onClick={updateProduct}
                            className="
                                bg-yellow-500
                                text-white
                                px-4 py-2
                                rounded
                            "
                        >
                            Cập nhật
                        </button>

                        <button
                            onClick={() => {

                                setEditingProductId(
                                    null
                                );
                                setPreviewImage('');
                                setProductForm({
                                    station_id: '',
                                    category_id: '',
                                    product_name: '',
                                    brand: '',
                                    price: '',
                                    stock_status: '',
                                    description: '',
                                    image_url: ''
                                });

                            }}
                            className="
                                bg-gray-500
                                text-white
                                px-4 py-2
                                rounded
                            "
                        >
                            Hủy
                        </button>

                    </div>

                ) : (

               <button
                        onClick={createProduct}
                        className="
                            bg-green-500
                            text-white
                            px-4 py-2
                            rounded
                        "
                    >
                        Thêm sản phẩm
                    </button>

                )}

            </div>
  <div className="bg-white p-6 rounded-xl shadow mb-8">
           <div className="flex gap-3 mb-4">
                <input
    type="text"
    placeholder="🔍 Tìm theo tên sản phẩm/tên trạm..."
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
    value={searchProduct}
    onChange={(e) =>
        setSearchProduct(
            e.target.value
        )
    }
/>


    <select
        className="text-center
        bg-white
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        text-gray-700
        appearance-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-400
        focus:border-green-400
        min-w-[110px]"
        value={stockFilter}
        onChange={(e) =>
            setStockFilter(e.target.value)
        }
    >
        <option value="all">
            Tất cả
        </option>

        <option value="1">
            Còn hàng
        </option>

        <option value="0">
            Hết hàng
        </option>

    </select>

</div>

                <h2 className="text-2xl font-bold mb-5">

                    📦 Danh sách sản phẩm

                </h2>

                <div className="space-y-4">
                    {
products
.filter((product) => {

    const keyword =
        searchProduct.toLowerCase();

    const matchSearch =
        product.product_name
            ?.toLowerCase()
            .includes(keyword)

        ||

        product.station_name
            ?.toLowerCase()
            .includes(keyword);

    const matchStock =
    stockFilter === "all"
        ? true
        : stockFilter === "1"
            ? product.stock_status === true
            : product.stock_status === false;
    return matchSearch && matchStock;

})
.map(product => (

                        <div
                            key={product.product_id}
                            className="
                                bg-green-50
                                p-4
                                rounded-xl
                            "
                        >

                            <img
                                src={`http://localhost:5000${product.image_url}`}
                                alt={product.product_name}
                                className="
                                    w-40
                                    h-40
                                    object-cover
                                    rounded-lg
                                    mb-3
                                "
                            />

                            <h3 className="font-bold text-lg">

                                {product.product_name}

                            </h3>

                            <p>

                                💰 {
                                    Number(
                                        product.price
                                    ).toLocaleString(
                                        'vi-VN'
                                    )
                                } VNĐ

                            </p>
                                <button
    onClick={() =>
        toggleProductStatus(
            product.product_id
        )
    }
    className={`
        px-4 py-2 rounded-lg mt-2 text-white font-semibold

        ${
            product.stock_status
                ? 'bg-green-500'
                : 'bg-red-500'
        }
    `}
>

    {
        product.stock_status
            ? '🟢 Còn hàng'
            : '🔴 Hết hàng'
    }

</button>
                            <p>

                                🏪 {product.station_name}

                            </p>

                            <div className="mt-3 flex gap-2">

                                <button
                                    onClick={() =>
                                        editProduct(
                                            product
                                        )
                                    }
                                    className="
                                        bg-yellow-500
                                        text-white
                                        px-3 py-1
                                        rounded
                                    "
                                >
                                    Sửa
                                </button>

                                <button
                                    onClick={() =>
                                        deleteProduct(
                                            product.product_id
                                        )
                                    }
                                    className="
                                        bg-red-500
                                        text-white
                                        px-3 py-1
                                        rounded
                                    "
                                >
                                    Xóa
                                </button>

                               
                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
   </div>
    );

}

export default OwnerProductsPage;