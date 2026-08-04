/**
 * Chuyển đổi định dạng giờ từ ISO Date (vd: 1970-01-01T07:30:00.000Z) 
 * hoặc chuỗi HH:mm:ss sang dạng hiển thị đẹp (vd: 7h30 hoặc 8h00)
 */
export const formatTimeDisplay = (timeVal) => {
    if (!timeVal) return '';

    try {
        // Trọng trường hợp dạng chuỗi ISO (1970-01-01T07:30:00.000Z)
        if (typeof timeVal === 'string' && timeVal.includes('T')) {
            const d = new Date(timeVal);
            if (!isNaN(d.getTime())) {
                const h = d.getUTCHours();
                const m = d.getUTCMinutes().toString().padStart(2, '0');
                return `${h}h${m}`;
            }
        }

        // Trường hợp dạng chuỗi (07:30:00, 07:30)
        if (typeof timeVal === 'string') {
            const parts = timeVal.split(':');
            if (parts.length >= 2) {
                const h = parseInt(parts[0], 10);
                const m = parts[1].padStart(2, '0');
                return `${h}h${m}`;
            }
        }
    } catch (e) {
        console.error("Lỗi format time:", e);
    }

    return timeVal;
};

/**
 * Chuyển đổi định dạng giờ sang định dạng HH:mm dùng cho HTML input type="time"
 */
export const formatTimeInput = (timeVal) => {
    if (!timeVal) return '08:00';

    try {
        if (typeof timeVal === 'string' && timeVal.includes('T')) {
            const d = new Date(timeVal);
            if (!isNaN(d.getTime())) {
                const h = d.getUTCHours().toString().padStart(2, '0');
                const m = d.getUTCMinutes().toString().padStart(2, '0');
                return `${h}:${m}`;
            }
        }

        if (typeof timeVal === 'string') {
            const parts = timeVal.split(':');
            if (parts.length >= 2) {
                const h = parts[0].padStart(2, '0');
                const m = parts[1].padStart(2, '0');
                return `${h}:${m}`;
            }
        }
    } catch (e) {
        console.error("Lỗi format time input:", e);
    }

    return timeVal;
};
