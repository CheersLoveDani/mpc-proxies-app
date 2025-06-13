export const SettingsPage = () => {
  return (
    <div className="page">
      <h1>Settings</h1>
      <p>Configure your application preferences.</p>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>General</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Enable auto-save
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Dark mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Proxy Generation</h3>
          <div className="setting-item">
            <label>
              Default DPI:
              <select>
                <option value="300">300 DPI</option>
                <option value="600">600 DPI</option>
                <option value="1200">1200 DPI</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
