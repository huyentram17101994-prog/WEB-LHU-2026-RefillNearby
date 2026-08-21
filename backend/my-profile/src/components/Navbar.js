"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-content">
        <Link href="/" className="nav-logo">
          <div className="logo-icon">HT</div>
          <div className="logo-text">
            <span className="gradient-text font-bold">Huyền Trâm</span>
            <span className="logo-sub">Profile Portal</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link 
            href="/" 
            className={`nav-item ${pathname === "/" ? "active" : ""}`}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Trang chủ
          </Link>
          <Link 
            href="/details" 
            className={`nav-item ${pathname === "/details" ? "active" : ""}`}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Chi tiết Cá nhân
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(11, 15, 25, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 0;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #fff;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-sub {
          font-size: 0.75rem;
          color: #9ca3af;
          letter-spacing: 0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          padding: 6px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 50px;
          color: #9ca3af;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-item.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        @media (max-width: 640px) {
          .logo-sub {
            display: none;
          }
          .nav-item {
            padding: 8px 14px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </header>
  );
}
