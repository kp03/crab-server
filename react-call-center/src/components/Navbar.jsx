import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navlinks: {
    display: "flex",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "#1664C0",
    },
  },
}));

function Navbar() {
  const classes = useStyles();

  return (
    <AppBar position="fixed">
      <CssBaseline />
      <Toolbar className="bg-orange-400">
        <Typography variant="h5" className={classes.logo}>
          Crab Call Center
        </Typography>
        <div className={classes.navlinks}>
          <NavLink
            to="/"
            className={classes.link}
            activeClassName={classes.activeLink}
          >
            Tiếp tân
          </NavLink>
          <NavLink
            to="/follow"
            className={classes.link}
            activeClassName={classes.activeLink}
          >
            Theo dõi
          </NavLink>
        </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
