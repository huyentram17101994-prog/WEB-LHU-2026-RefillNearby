import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "Huỳnh Thị Huyền Trâm - Trang cá nhân | MSSV 725000001",
  description: "Trang thông tin cá nhân và hồ sơ học tập của Huỳnh Thị Huyền Trâm, Lớp 25CT712, MSSV 725000001.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
