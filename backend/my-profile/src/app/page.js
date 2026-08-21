"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="home-container container">
      {/* Background Decorative Glowing Elements */}
      <div className="glow-circle glow-1 pulse-glow"></div>
      <div className="glow-circle glow-2 pulse-glow"></div>

      {/* Hero Header Section */}
      <section className="hero-section text-center">
        <div className="avatar-wrapper animate-float">
          <div className="avatar-ring"></div>
          <div className="avatar-box">
            <span className="avatar-initials">HT</span>
          </div>
          <div className="verified-badge" title="Sinh viên chính thức">✓</div>
        </div>

        <div className="hero-badges">
          <span className="badge badge-cyan">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Sinh viên CNTT
          </span>
          <span className="badge">Lạc Hồng University</span>
        </div>

        <h1 className="hero-title">
          Xin chào, Tôi là <br />
          <span className="gradient-text">Huỳnh Thị Huyền Trâm</span>
        </h1>
        <p className="hero-description">
          Chào mừng bạn đến với trang thông tin cá nhân chính thức. Nơi lưu trữ thông tin sinh viên, hồ sơ học tập và các dự án công nghệ nổi bật.
        </p>
      </section>

      {/* Primary Personal Info Card (Mandatory Info Requirement) */}
      <section className="info-card-section">
        <div className="glass-panel main-info-card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">📌</span>
              <h2>Thông tin cá nhân cơ bản</h2>
            </div>
            <span className="badge badge-pink">Thông tin chính thức</span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon-wrapper icon-purple">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Họ và tên</span>
                <span className="info-value highlight-name">Huỳnh Thị Huyền Trâm</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-wrapper icon-cyan">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Mã số sinh viên (MSSV)</span>
                <span className="info-value code-font">725000001</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-wrapper icon-pink">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M15 16h.01M15 12h.01M9 8h.01M15 8h.01" />
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Lớp sinh hoạt</span>
                <span className="info-value badge-class">25CT712</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-wrapper icon-emerald">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Chuyên ngành học</span>
                <span className="info-value">Công nghệ Thông tin (IT)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="highlights-grid">
        <div className="glass-panel mini-card">
          <div className="mini-icon">🚀</div>
          <h3>Định hướng phát triển</h3>
          <p>Lập trình viên Web Fullstack với trọng tâm vào trải nghiệm người dùng hiện đại và hiệu năng cao.</p>
        </div>

        <div className="glass-panel mini-card">
          <div className="mini-icon">💻</div>
          <h3>Công nghệ sở trường</h3>
          <p>React.js, Next.js App Router, JavaScript, HTML5/CSS3 Modules và RESTful APIs.</p>
        </div>

        <div className="glass-panel mini-card">
          <div className="mini-icon">⭐</div>
          <h3>Mục tiêu cá nhân</h3>
          <p>Tạo ra những ứng dụng số có tính thực tiễn cao, đóng góp giá trị cho cộng đồng và doanh nghiệp.</p>
        </div>
      </section>

      {/* Call to Action to Subpage */}
      <section className="cta-section text-center">
        <div className="glass-panel cta-card">
          <h2>Khám phá thêm về Hồ sơ & Kỹ năng</h2>
          <p>Ghé thăm trang cấp 2 để xem chi tiết các dự án tiêu biểu, lộ trình học tập và thông tin liên hệ.</p>
          <div className="cta-actions">
            <Link href="/details" className="btn-primary">
              Xem Chi tiết Cá nhân
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/details#contact" className="btn-secondary">
              Gửi lời nhắn
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          position: relative;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .glow-circle {
          position: absolute;
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
        }
        .glow-1 {
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
        }
        .glow-2 {
          bottom: 100px;
          right: -50px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, transparent 70%);
        }

        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 50px;
        }

        .avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 24px;
        }

        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          filter: blur(8px);
          opacity: 0.8;
        }

        .avatar-box {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e1b4b, #311042);
          border: 3px solid #0b0f19;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-initials {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .verified-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          font-size: 0.85rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0b0f19;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .hero-badges {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #9ca3af;
          max-width: 640px;
          line-height: 1.6;
        }

        /* Main Info Card */
        .info-card-section {
          margin-bottom: 50px;
        }

        .main-info-card {
          padding: 36px;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 12px;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-icon {
          font-size: 1.5rem;
        }

        .card-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.25s ease;
        }

        .info-item:hover {
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .info-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-purple {
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
        }
        .icon-cyan {
          background: rgba(6, 182, 212, 0.2);
          color: #22d3ee;
        }
        .icon-pink {
          background: rgba(236, 72, 153, 0.2);
          color: #f472b6;
        }
        .icon-emerald {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .info-content {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f3f4f6;
        }

        .highlight-name {
          color: #a855f7;
        }

        .code-font {
          font-family: monospace;
          color: #38bdf8;
          letter-spacing: 1px;
        }

        .badge-class {
          color: #f472b6;
        }

        /* Highlights Grid */
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .mini-card {
          padding: 28px;
        }

        .mini-icon {
          font-size: 2rem;
          margin-bottom: 14px;
        }

        .mini-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #f9fafb;
        }

        .mini-card p {
          font-size: 0.95rem;
          color: #9ca3af;
          line-height: 1.5;
        }

        /* CTA Section */
        .cta-card {
          padding: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .cta-card h2 {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .cta-card p {
          color: #9ca3af;
          max-width: 550px;
        }

        .cta-actions {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .main-info-card {
            padding: 24px;
          }
          .cta-card {
            padding: 32px 20px;
          }
        }
      `}</style>
    </div>
  );
}
