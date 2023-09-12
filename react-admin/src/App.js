import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Bar from "./scenes/bar";
import Calendar from "./scenes/calendar/calendar";
import Contacts from "./scenes/contacts";
import Dashboard from "./scenes/dashboard";
import FAQ from "./scenes/faq";
import Form from "./scenes/form";
import Geography from "./scenes/geography";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Invoices from "./scenes/invoices";
import Line from "./scenes/line";
import Login from "./scenes/login";
import Pie from "./scenes/pie";
import Team from "./scenes/team";
import { ColorModeContext, useMode } from "./theme";
import { useAppStore } from "./store/appStore";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { token } = useAppStore((state) => state)

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
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
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
