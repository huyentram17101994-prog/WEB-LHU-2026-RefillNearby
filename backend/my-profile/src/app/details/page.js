"use client";

import { useState } from "react";
import Link from "next/link";

export default function DetailsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="details-container container">
      {/* Page Header */}
      <section className="page-header text-center">
        <span className="badge badge-cyan">Trang cấp 2</span>
        <h1 className="header-title">
          Chi tiết Cá nhân & <span className="gradient-text">Hồ sơ Năng lực</span>
        </h1>
        <p className="header-subtitle">
          Tổng hợp thông tin quá trình học tập, các kỹ năng lập trình, dự án tiêu biểu và thông tin liên hệ của <strong>Huỳnh Thị Huyền Trâm</strong>.
        </p>
      </section>

      {/* Section 1: Detailed Bio & Academic Info */}
      <section className="details-section">
        <div className="glass-panel section-card">
          <div className="section-header">
            <span className="section-badge">01</span>
            <h2>Thông tin Học tập & Quá trình Đào tạo</h2>
          </div>
          <div className="bio-timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">2025 - Hiện tại</span>
                <h3>Sinh viên Ngành Công nghệ Thông tin</h3>
                <p className="timeline-school">Đại học Lạc Hồng (LHU)</p>
                <p className="timeline-desc">
                  Theo học chuyên ngành CNTT, tập trung nghiên cứu công nghệ web hiện đại, kiến trúc phần mềm và trải nghiệm người dùng (UX/UI).
                </p>
                <div className="timeline-tags">
                  <span className="tag">Lớp: 25CT712</span>
                  <span className="tag">MSSV: 725000001</span>
                  <span className="tag">Họ tên: Huỳnh Thị Huyền Trâm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Tech Stack & Skills */}
      <section className="details-section">
        <div className="glass-panel section-card">
          <div className="section-header">
            <span className="section-badge">02</span>
            <h2>Kỹ năng Lập trình & Công nghệ</h2>
          </div>

          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend Development</h3>
              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>React.js / Next.js</span>
                  <span>90%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-purple" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>JavaScript (ES6+) / HTML5 / CSS3</span>
                  <span>95%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-cyan" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>Responsive & Glassmorphism UI</span>
                  <span>88%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-pink" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>

            <div className="skill-category">
              <h3>Backend & Tools</h3>
              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>Node.js / Express</span>
                  <span>80%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-emerald" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>RESTful API Integration</span>
                  <span>85%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-purple" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="skill-bar-group">
                <div className="skill-info">
                  <span>Git / GitHub / VS Code</span>
                  <span>92%</span>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill fill-cyan" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Projects */}
      <section className="details-section">
        <div className="glass-panel section-card">
          <div className="section-header">
            <span className="section-badge">03</span>
            <h2>Dự án Tiêu biểu</h2>
          </div>

          <div className="projects-grid">
            <div className="project-card">
              <div className="project-banner banner-1">
                <span className="project-category">Fullstack Web</span>
              </div>
              <div className="project-body">
                <h3>RefillNearby Project</h3>
                <p>Nền tảng tìm kiếm và bản đồ các điểm nạp lại sản phẩm thân thiện với môi trường, hỗ trợ người dùng giảm rác thải nhựa.</p>
                <div className="project-tech">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Express</span>
                  <span>MongoDB</span>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-banner banner-2">
                <span className="project-category">Next.js App</span>
              </div>
              <div className="project-body">
                <h3>My-Profile Portal</h3>
                <p>Trang thông tin cá nhân và hồ sơ sinh viên thiết kế hiện đại chuẩn Glassmorphism UI, hiển thị tối ưu thông tin mã sinh viên và lớp.</p>
                <div className="project-tech">
                  <span>Next.js 14</span>
                  <span>App Router</span>
                  <span>Vanilla CSS</span>
                  <span>JavaScript</span>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-banner banner-3">
                <span className="project-category">Utility App</span>
              </div>
              <div className="project-body">
                <h3>Student Study Tracker</h3>
                <p>Ứng dụng quản lý lịch học, danh sách bài tập và mục tiêu học tập hàng tuần dành cho sinh viên CNTT.</p>
                <div className="project-tech">
                  <span>JavaScript</span>
                  <span>Local Storage</span>
                  <span>CSS Modules</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Hobbies & Aspirations */}
      <section className="details-section">
        <div className="glass-panel section-card">
          <div className="section-header">
            <span className="section-badge">04</span>
            <h2>Sở thích & Định hướng Tương lai</h2>
          </div>

          <div className="hobbies-grid">
            <div className="hobby-box">
              <div className="hobby-icon">🎨</div>
              <h4>Thiết kế Giao diện UI/UX</h4>
              <p>Yêu thích sáng tạo các giao diện người dùng đẹp mắt, tinh tế và dễ tương tác.</p>
            </div>

            <div className="hobby-icon-box hobby-box">
              <div className="hobby-icon">📚</div>
              <h4>Đọc tài liệu Công nghệ</h4>
              <p>Thường xuyên tìm hiểu các công nghệ web mới, thư viện UI và xu hướng AI hỗ trợ lập trình.</p>
            </div>

            <div className="hobby-box">
              <div className="hobby-icon">🎯</div>
              <h4>Mục tiêu 2026</h4>
              <p>Hoàn thành xuất sắc các học phần CNTT, nâng cao kỹ năng Lập trình Web Fullstack chuyên nghiệp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Contact Card Form */}
      <section className="details-section" id="contact">
        <div className="glass-panel section-card">
          <div className="section-header">
            <span className="section-badge">05</span>
            <h2>Liên hệ & Gửi lời nhắn</h2>
          </div>

          {submitted ? (
            <div className="success-message text-center">
              <div className="success-icon">🎉</div>
              <h3>Cảm ơn bạn đã gửi lời nhắn!</h3>
              <p>Tin nhắn của bạn đã được gửi thành công đến Huỳnh Thị Huyền Trâm (Lớp 25CT712).</p>
              <button 
                className="btn-secondary"
                onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", message: "" }); }}
                style={{ marginTop: "16px" }}
              >
                Gửi lời nhắn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên của bạn</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Nhập họ tên..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email liên hệ</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung tin nhắn</label>
                <textarea
                  id="message"
                  rows="4"
                  required
                  placeholder="Nhập lời nhắn hoặc câu hỏi dành cho Huyền Trâm..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Gửi tin nhắn ngay
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Return to Home Link */}
      <div className="text-center" style={{ marginTop: "40px" }}>
        <Link href="/" className="btn-secondary">
          ← Quay lại Trang chủ Thông tin cá nhân
        </Link>
      </div>

      <style jsx>{`
        .details-container {
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .page-header {
          margin-bottom: 50px;
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .header-subtitle {
          color: #9ca3af;
          font-size: 1.05rem;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .details-section {
          margin-bottom: 40px;
        }

        .section-card {
          padding: 36px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3));
          color: #818cf8;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        /* Timeline */
        .bio-timeline {
          padding-left: 10px;
        }

        .timeline-item {
          position: relative;
          padding-left: 30px;
          border-left: 2px solid rgba(99, 102, 241, 0.3);
        }

        .timeline-dot {
          position: absolute;
          left: -7px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #a855f7;
          box-shadow: 0 0 12px #a855f7;
        }

        .timeline-date {
          font-size: 0.85rem;
          color: #22d3ee;
          font-weight: 600;
        }

        .timeline-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 4px;
        }

        .timeline-school {
          color: #9ca3af;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .timeline-desc {
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .timeline-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tag {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #e5e7eb;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .skill-category h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #818cf8;
          margin-bottom: 20px;
        }

        .skill-bar-group {
          margin-bottom: 18px;
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 6px;
          color: #e5e7eb;
          font-weight: 500;
        }

        .skill-progress-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50px;
          overflow: hidden;
        }

        .skill-progress-fill {
          height: 100%;
          border-radius: 50px;
          transition: width 1s ease-in-out;
        }
        .fill-purple { background: linear-gradient(90deg, #6366f1, #a855f7); }
        .fill-cyan { background: linear-gradient(90deg, #06b6d4, #3b82f6); }
        .fill-pink { background: linear-gradient(90deg, #ec4899, #a855f7); }
        .fill-emerald { background: linear-gradient(90deg, #10b981, #06b6d4); }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .project-banner {
          height: 120px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }
        .banner-1 { background: linear-gradient(135deg, #311042, #1e1b4b); }
        .banner-2 { background: linear-gradient(135deg, #0c4a6e, #1e1b4b); }
        .banner-3 { background: linear-gradient(135deg, #064e3b, #111827); }

        .project-category {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .project-body {
          padding: 20px;
        }

        .project-body h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .project-body p {
          font-size: 0.88rem;
          color: #9ca3af;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .project-tech {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .project-tech span {
          background: rgba(99, 102, 241, 0.12);
          color: #a5b4fc;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* Hobbies */
        .hobbies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .hobby-box {
          background: rgba(255, 255, 255, 0.03);
          padding: 24px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hobby-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .hobby-box h4 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .hobby-box p {
          font-size: 0.88rem;
          color: #9ca3af;
          line-height: 1.5;
        }

        /* Contact Form */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #d1d5db;
        }

        .form-group input,
        .form-group textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #fff;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.25s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #818cf8;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }

        .success-message {
          padding: 40px 20px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .success-message h3 {
          font-size: 1.4rem;
          color: #34d399;
          margin-bottom: 8px;
        }

        .success-message p {
          color: #d1d5db;
        }

        @media (max-width: 768px) {
          .header-title {
            font-size: 2rem;
          }
          .section-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
