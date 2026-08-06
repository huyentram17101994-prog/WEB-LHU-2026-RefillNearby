import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import FloatingPrintButton from "../components/FloatingPrintButton";

function OCRPage() {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("ocr_result");
        if (saved) {
            try {
                setResult(JSON.parse(saved));
            } catch (e) {
                console.error("Lỗi parse ocr_result:", e);
            }
        }
    }, []);

    const analyzeInvoice = async () => {
        if (!image) {
            alert("Vui lòng chụp hoặc chọn hóa đơn trước khi phân tích!");
            return;
        }

        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("image", image);

            const response = await api.post("/ocr/analyze", formData);
            setResult(response.data);
            localStorage.setItem("ocr_result", JSON.stringify(response.data));
        } catch (err) {
            console.error("Lỗi phân tích hóa đơn:", err);
            alert("Không thể phân tích hóa đơn. Vui lòng thử lại với hình ảnh rõ nét hơn.");
        } finally {
            setAnalyzing(false);
        }
    };

    const clearResult = () => {
        setImage(null);
        setResult(null);
        localStorage.removeItem("ocr_result");
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 p-4 md:p-8 relative">
            <FloatingPrintButton title="In kết quả phân tích hóa đơn" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* NÚT QUAY LẠI CHUẨN */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700 print:hidden cursor-pointer"
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>

                {/* TIÊU ĐỀ CĂN GIỮA */}
                <div className="flex items-center justify-center gap-3 my-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
                        🧾 Phân tích Hóa đơn
                    </h1>
                </div>

                {/* ẨN INPUT ĐỂ KÍCH HOẠT CAMERA VÀ THƯ VIỆN ẢNH */}
                {/* Input 1: CHỤP TRỰC TIẾP TRÊN ĐIỆN THOẠI HỖ TRỢ CAPTURE ENVIRONMENT */}
                <input
                    id="mobileCameraInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageChange}
                />

                {/* Input 2: CHỌN ẢNH TỪ THƯ VIỆN TẢI LÊN */}
                <input
                    id="galleryFileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />

                {/* THANH THAO TÁC CÁC NÚT BẤM KHÔNG BỌC KHUNG CARD */}
                <div className="flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap my-4">
                    {/* NÚT 1: CHỤP HÓA ĐƠN TRÊN ĐIỆN THOẠI */}
                    <button
                        type="button"
                        onClick={() => document.getElementById("mobileCameraInput")?.click()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                        📸 Chụp ảnh
                    </button>

                    {/* NÚT 2: CHỌN ẢNH CÓ SẴN TỪ BỘ NHỚ */}
                    <button
                        type="button"
                        onClick={() => document.getElementById("galleryFileInput")?.click()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                        Tải ảnh lên
                    </button>

                    {/* NÚT 3: PHÂN TÍCH HÓA ĐƠN AI */}
                    <button
                        type="button"
                        onClick={analyzeInvoice}
                        disabled={analyzing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                        {analyzing ? "⏳ Đang quét..." : "🔍 Phân tích"}
                    </button>

                    {/* NÚT 4: XÓA KẾT QUẢ */}
                    {(image || result) && (
                        <button
                            type="button"
                            onClick={clearResult}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                        >
                            Xóa kết quả
                        </button>
                    )}
                </div>

                {/* XEM TRƯỚC HÌNH ẢNH HÓA ĐƠN ĐÃ CHỤP / CHỌN */}
                {image && (
                    <div className="flex justify-center mt-4">
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-green-100 max-w-sm text-center">
                            <h3 className="font-extrabold text-green-700 text-xs mb-2">
                                📸 Hóa đơn chuẩn bị phân tích:
                            </h3>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Hóa đơn đã chọn"
                                className="max-h-[320px] w-auto mx-auto object-contain rounded-2xl shadow-sm border border-gray-100"
                            />
                            <p className="mt-2 font-semibold text-xs text-gray-600 truncate px-2">
                                📄 Tên file: {image.name}
                            </p>
                        </div>
                    </div>
                )}

                {/* TRẠNG THÁI ĐANG PHÂN TÍCH */}
                {analyzing && (
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-green-100 text-center max-w-md mx-auto space-y-2">
                        <div className="text-3xl animate-bounce">🤖</div>
                        <h3 className="text-lg font-extrabold text-green-700">
                            Trí tuệ nhân tạo đang quét hóa đơn...
                        </h3>
                        <p className="text-xs text-gray-500">
                            Vui lòng chờ trong giây lát để trích xuất các sản phẩm có thể refill gần bạn.
                        </p>
                    </div>
                )}

                {/* HIỂN THỊ KẾT QUẢ SẢN PHẨM GỢI Ý KHI CÓ KẾT QUẢ */}
                {result && result.detected_products && (
                    <div className="mt-8 space-y-6">
                        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-md border border-green-100 text-center max-w-xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                                📦 Sản phẩm gợi ý:{" "}
                                <span className="text-green-600 font-extrabold">
                                    {result.detected_products.length}
                                </span>{" "}
                                sản phẩm
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Các sản phẩm tìm thấy trong hóa đơn của bạn có thể nạp lại tại các trạm refill lân cận
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {result.detected_products.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-5 border border-green-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
                                >
                                    <img
                                        src={
                                            product.image_url?.startsWith("/uploads")
                                                ? `http://localhost:5000${product.image_url}`
                                                : product.image_url
                                        }
                                        alt={product.product_name}
                                        className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-100 shrink-0 group-hover:scale-105 transition duration-300"
                                    />

                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        <h3 className="text-base font-extrabold text-gray-800 truncate" title={product.product_name}>
                                            {product.product_name}
                                        </h3>

                                        <p className="text-xs text-gray-600">
                                            Có tại <b className="text-green-600 font-extrabold">{product.total_stations}</b> trạm refill
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(`/products/${encodeURIComponent(product.product_name)}`)
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
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