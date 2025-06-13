import { Download, FileImage, Printer } from "lucide-react";

export const DownloadProxiesPage = () => {
  const recentProxies = [
    {
      id: 1,
      name: "Modern Deck Proxies",
      cards: 75,
      date: "2025-06-10",
      status: "Ready",
    },
    {
      id: 2,
      name: "Commander Deck",
      cards: 100,
      date: "2025-06-09",
      status: "Processing",
    },
    {
      id: 3,
      name: "Vintage Collection",
      cards: 60,
      date: "2025-06-08",
      status: "Ready",
    },
  ];

  return (
    <div className="page">
      <h1>Download Proxies</h1>
      <p>
        Download your generated proxy cards in various formats for printing.
      </p>

      <div className="download-content">
        <div className="recent-proxies">
          <h3>Recent Proxy Sets</h3>
          <div className="proxy-list">
            {recentProxies.map((proxy) => (
              <div key={proxy.id} className="proxy-card">
                <div className="proxy-info">
                  <h4>{proxy.name}</h4>
                  <p>
                    {proxy.cards} cards • {proxy.date}
                  </p>
                  <span className={`status ${proxy.status.toLowerCase()}`}>
                    {proxy.status}
                  </span>
                </div>

                {proxy.status === "Ready" && (
                  <div className="download-options">
                    <button className="btn btn-primary">
                      <Download size={16} />
                      PDF
                    </button>
                    <button className="btn btn-secondary">
                      <FileImage size={16} />
                      Images
                    </button>
                    <button className="btn btn-secondary">
                      <Printer size={16} />
                      Print
                    </button>
                  </div>
                )}

                {proxy.status === "Processing" && (
                  <div className="processing-indicator">
                    <div className="spinner"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="download-formats">
          <h3>Available Formats</h3>
          <div className="format-grid">
            <div className="format-card">
              <FileImage size={24} />
              <h4>High-Res Images</h4>
              <p>Individual PNG files for each card</p>
            </div>

            <div className="format-card">
              <Download size={24} />
              <h4>Print-Ready PDF</h4>
              <p>Optimized for home and professional printing</p>
            </div>

            <div className="format-card">
              <Printer size={24} />
              <h4>MPC Format</h4>
              <p>Ready for MakePlayingCards.com upload</p>
            </div>
          </div>
        </div>

        <div className="print-instructions">
          <h3>Printing Instructions</h3>
          <div className="instructions-content">
            <ol>
              <li>Download the PDF format for best printing results</li>
              <li>Use high-quality cardstock (300gsm recommended)</li>
              <li>Print at 100% scale (no scaling)</li>
              <li>Use a paper cutter for clean edges</li>
              <li>Consider using card sleeves for protection</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
