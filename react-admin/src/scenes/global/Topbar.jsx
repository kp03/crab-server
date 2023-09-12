import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppStore } from "../../store/appStore";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token, setToken } = useAppStore((state) => state);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="row-reverse"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      {/* SEARCH BAR */}
      {/* ICONS */}
      <Box display="flex" gap={`8px`}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {token && (
          <>
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setToken("");
                navigate("/login");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </>
        )}
      </Box>
      {!token && (
        <Box>
          <Header title="Crab - Admin" />
        </Box>
      )}
    </Box>
  );
};

export default Topbar;
