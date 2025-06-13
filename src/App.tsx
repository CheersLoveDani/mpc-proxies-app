import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { CreateProxiesPage } from "./pages/CreateProxiesPage";
import { DownloadProxiesPage } from "./pages/DownloadProxiesPage";
import { CustomProxiesPage } from "./pages/CustomProxiesPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="create-proxies" element={<CreateProxiesPage />} />
          <Route path="download-proxies" element={<DownloadProxiesPage />} />
          <Route path="custom-proxies" element={<CustomProxiesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
