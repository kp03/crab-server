import { Box, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axiosClient";

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { setToken } = useAppStore(state => state)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            phone: data.get("phone"),
            password: data.get("password"),
        });

        const res = await axiosClient.post('/login')
        if (res.token) {
            setToken(res.token)
            navigate("/");
        }

    };
    return (
        <Box>
            {/* GRID & CHARTS */}
            <Box component="form" onSubmit={handleSubmit} noValidate display="flex" justifyContent="center" alignItems="center">
                <Box display="flex" flexDirection='column' height='550px' width='600px' backgroundColor={colors.greenAccent[700]} borderRadius='8px'
                >
                    <Box paddingTop='0.5rem' display="flex" justifyContent="center" alignItems="center">
                        <Header title="Login" />
                    </Box>
                    <Box padding='0.5rem 2rem'>
                        <TextField
                            type='number'
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
