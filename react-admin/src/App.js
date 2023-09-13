import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";
import Team from "./scenes/team";
import { useAppStore } from "./store/appStore";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { token } = useAppStore((state) => state)

  useEffect(() => {
    document.title = 'Crab - Admin';
  }, []);

  if (!token) {
    return <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Login />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider >
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <>
            {token && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/driver" element={<Team />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}

export default App;
