import { ExternalLink, Wand2, Palette, Star } from "lucide-react";

export const CustomProxiesPage = () => {
  const handleCardConjurerClick = () => {
    // In a Tauri app, we'll need to use the Tauri API to open external links
    window.open("https://cardconjurer.app/", "_blank");
  };

  return (
    <div className="page">
      <h1>Custom Proxies</h1>
      <div className="coming-soon-content">
        <div className="coming-soon-header">
          <Wand2 size={48} className="coming-soon-icon" />
          <h2>Coming Soon!</h2>
          <p>Custom proxy creation tools are currently in development.</p>
        </div>

        <div className="features-preview">
          <h3>Planned Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <Palette size={24} />
              <h4>Custom Card Designer</h4>
              <p>Create your own card layouts and designs from scratch</p>
            </div>

            <div className="feature-card">
              <Star size={24} />
              <h4>Template Library</h4>
              <p>Access a collection of pre-made templates and styles</p>
            </div>

            <div className="feature-card">
              <ExternalLink size={24} />
              <h4>Import/Export</h4>
              <p>
                Import designs from other tools and export to various formats
              </p>
            </div>
          </div>
        </div>

        <div className="external-recommendation">
          <h3>In the Meantime...</h3>
          <div className="recommendation-card">
            <div className="recommendation-content">
              <h4>CardConjurer</h4>
              <p>
                For advanced custom card creation, we recommend CardConjurer - a
                powerful web-based tool for designing custom Magic cards.
              </p>
              <button
                className="btn btn-primary external-link-btn"
                onClick={handleCardConjurerClick}
              >
                Visit CardConjurer
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="newsletter-signup">
          <h3>Stay Updated</h3>
          <p>Be the first to know when custom proxy tools are available!</p>
          <div className="signup-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="input"
            />
            <button className="btn btn-primary">Notify Me</button>
          </div>
        </div>
      </div>
    </div>
  );
};
