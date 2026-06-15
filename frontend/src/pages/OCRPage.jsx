import { useState } from 'react';

import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
 

function OCRPage() {

    
    const [image, setImage] = useState(null);

    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const analyzeInvoice = async () => {

        try {

            const formData = new FormData();

            formData.append('image', image);

            const response = await api.post(
                '/ocr/analyze',
                formData
            );

            setResult(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">
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
            <div className="max-w-6xl mx-auto bg-white rounded-3xl p-8 shadow-lg">

                <h1 className="text-4xl text-center font-bold mb-8 text-green-700">

                    🧾 Phân tích hóa đơn

                </h1>

                <div className="mb-6">

    <label
        className="
            inline-block
            bg-green-500
            hover:bg-green-600
            text-white
            px-6 py-4
            rounded-2xl
            cursor-pointer
            font-bold
            transition
            shadow-md
        "
    >

        📷 Chọn ảnh hóa đơn

        <input
            type="file"
            onChange={(e) =>
                setImage(e.target.files[0])
            }
            className="hidden"
        />

    </label>





    {
        image && (

            <p className="mt-4 text-gray-700 font-semibold">

                ✅ {image.name}

            </p>

        )
    }

</div>

                <button
                    onClick={analyzeInvoice}
                    className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold"
                >

                    Phân tích hóa đơn

                </button>

                {
    result && (

        <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">

                📦 Sản phẩm phát hiện

            </h2>

            <ul className="space-y-3">

                {
                    result.detected_products.map(
                        (item, index) => (

                            <li
                                key={index}
                                className="bg-green-100 p-4 rounded-2xl"
                            >

                                {item}

                            </li>

                        )
                    )
                }

            </ul>





            {/* GỢI Ý REFILL */}

            {
                result.suggestions?.length > 0 && (

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-5">

                            ♻️ Gợi ý refill phù hợp

                        </h2>

                        <div className="space-y-4">

                            {
                                result.suggestions.map(
                                    (item, index) => (

                                        <div
                                            key={index}
                                            className="bg-green-100 p-5 rounded-2xl"
                                        >

                                            <h3 className="text-xl font-bold">

                                                {item.product_name}

                                            </h3>

                                            <p>

                                                📍 {item.station_name}

                                            </p>

                                            <p>

                                                💰 {Number(item.price).toLocaleString('vi-VN')} vnđ/lít

                                            </p>
                                            <button
    onClick={() =>
        navigate(`/stations/${item.station_id}`)
    }
    className="mt-3 bg-green-500 text-white px-4 py-2 rounded-xl"
>
    Xem trạm refill
</button>
                                        </div>

                                    )
                                )
                            }

                        </div>

                    </div>

                )
            }

        </div>

    )
}


            </div>

        </div>

    );

}

export default OCRPage;