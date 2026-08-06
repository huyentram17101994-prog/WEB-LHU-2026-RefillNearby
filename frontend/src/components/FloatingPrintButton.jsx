import React from 'react';
import { FaPrint } from 'react-icons/fa';

const FloatingPrintButton = ({ title = "In / Xuất PDF" }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            title={title}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/75 hover:bg-white/95 text-gray-700 hover:text-blue-600 rounded-full shadow-lg hover:shadow-xl border border-gray-200/80 backdrop-blur-md transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer print:hidden"
        >
            <FaPrint size={15} className="text-blue-600" />
            <span className="text-xs md:text-sm font-bold tracking-wide">In / Xuất PDF</span>
        </button>
    );
};

export default FloatingPrintButton;
