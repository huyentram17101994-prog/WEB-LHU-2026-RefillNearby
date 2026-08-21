"use client";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-info">
          <p className="footer-title gradient-text font-bold">Huỳnh Thị Huyền Trâm</p>
          <p className="footer-subtitle">Sinh viên CNTT - Lớp 25CT712 | MSSV: 725000001</p>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Profile Portal. Built with Next.js & App Router.</p>
        </div>
      </div>

      <style jsx>{`
        .footer-wrapper {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(11, 15, 25, 0.85);
          padding: 32px 0;
          margin-top: 60px;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }

        .footer-title {
          font-size: 1.1rem;
        }

        .footer-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-top: 4px;
        }

        .footer-copyright {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 8px;
        }
      `}</style>
    </footer>
  );
}
