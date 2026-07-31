import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

function OCRPage() {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("ocr_result");

        if (saved) {
            setResult(JSON.parse(saved));
        }
    }, []);

    const analyzeInvoice = async () => {
        if (!image) {
            alert("Vui lòng chọn hóa đơn");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", image);

            const response = await api.post(
                "/ocr/analyze",
                formData
            );

            setResult(response.data);

            localStorage.setItem(
                "ocr_result",
                JSON.stringify(response.data)
            );

        } catch (err) {
            console.log(err);
        }
    };

    const clearResult = () => {

        setImage(null);
        setResult(null);
        localStorage.removeItem("ocr_result");
    };

    return (
        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
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

                

                <h1 className="text-center text-5xl font-bold text-green-700 mt-6">
                    🧾 Phân tích hóa đơn
                </h1>

                {/* Preview */}

                {image && (

                    <div className="flex justify-center mt-10">

                        <div className="bg-white p-5 rounded-3xl shadow-xl">

                            <img
                                src={URL.createObjectURL(image)}
                                alt="invoice"
                                className="w-70 max-h-[400px] object-contain rounded-2xl"
                            />

                            <p className="mt-4 font-semibold text-center">
                                📄 {image.name}
                            </p>

                        </div>

                    </div>

                )}

                {/* Buttons */}

                <div className="flex justify-center gap-5 mt-10 flex-wrap">

                    {/* 📷 Chụp trực tiếp bằng camera */}
<label className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl cursor-pointer font-bold">

    📷 Chụp hóa đơn

    <input
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
            }
        }}
    />

</label>

{/* 🖼️ Chọn ảnh có sẵn */}
<label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl cursor-pointer font-bold">

    🖼️ Chọn ảnh

    <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
            }
        }}
    />

</label>

                    <button
                        onClick={analyzeInvoice}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold"
                    >
                        🔍 Phân tích
                    </button>

                    <button
                        onClick={clearResult}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold"
                    >
                         Xóa kết quả
                    </button>

                </div>

                {/* RESULT */}

                {result && (

                    <div className="mt-16">

                        <h2 className="text-3xl font-bold text-center mb-10">

                            📦 Sản phẩm gợi ý: 

                            <span className="text-green-600 ml-2">

                                {result.detected_products.length}

                            </span>

                            {" "}sản phẩm

                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {result.detected_products.map(product => (

                                <div
                                    key={product.product_id}
                                    className="flex items-center gap-6 bg-white/30 rounded-3xl shadow-lg p-6  hover:shadow-xl
                                    hover:-translate-y-1
                                    transition
                                    border
                            border-white   "
                                >

                                    <img
                                        src={`http://localhost:5000${product.image_url}`}
                                        alt={product.product_name}
                                        className="w-24 h-24 rounded-2xl object-cover"
                                    />

                                    <div className="flex-1">

                                        <h3 className="text-xl font-bold">
                                            {product.product_name}
                                        </h3>

                                        <p className="mt-2 text-gray-600">
                                            Có tại

                                            <span className="font-bold text-green-600 mx-1">
                                                {product.total_stations}
                                            </span>

                                            trạm refill
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/products/${encodeURIComponent(product.product_name)}`
                                                )
                                            }
                                            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl"
                                        >
                                            Xem chi tiết
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default OCRPage;