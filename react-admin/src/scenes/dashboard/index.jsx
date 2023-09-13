import DriverIcon from "@mui/icons-material/DriveEta";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Typography, useTheme } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import axiosClient from "../../config/axiosClient";
import { mockTransactions } from "../../data/mockData";
import { tokens } from "../../theme";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [drivers, setNumDrivers] = useState(0);
  const [riders, setNumRiders] = useState(0);
  const [trips, setNumTrips] = useState(0);
  const [viewType, setViewType] = useState("month");
  const [revenue, setRevenue] = useState(0);

  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (dates) => {
    console.log(dates);
    setDateRange(dates);
  };

  const handleChange = (event) => {
    setViewType(event.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const numDrivers = await axiosClient.get(`/admin/total/drivers`);
        setNumDrivers(numDrivers.data.totalDrivers);
        const numRiders = await axiosClient.get(`/admin/total/riders`);
        setNumRiders(numRiders.data.totalRiders);
        const numTrips = await axiosClient.get(`/admin/total/trips`);
        setNumTrips(numTrips.data.totalTrips);
        const resRevenue = await axiosClient.get(`/admin/total/revenue`);
        setRevenue(resRevenue.data.totalRevenue);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [viewType]);

  return (
    <Box m="0px 32px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome" />
      </Box>
      <Box m="20px">
        <Box mb="8px">
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Report by
          </InputLabel>
        </Box>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={viewType}
          label=""
          onChange={handleChange}
          variant="outlined"
        >
          <MenuItem value={"week"}>Weeks</MenuItem>
          <MenuItem value={"month"}>Months</MenuItem>
          <MenuItem value={"year"}>Years</MenuItem>
        </Select>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={drivers}
            subtitle="New Drivers"
            progress="0"
            increase="+14%"
            icon={
              <DriverIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={riders}
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={trips}
            subtitle="Trips"
            progress="0.50"
            increase="+21%"
            icon={
              <NoCrashIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Total Revenue
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${revenue}
              </Typography>
            </Box>
            <Box>
              <RangePicker
                format="YYYY-MM-DD"
                onChange={handleDateChange}
                value={dateRange}
                picker={viewType}
              />
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart
              isDashboard={true}
              viewType={viewType}
              start={dayjs(dateRange[0]).format()}
              end={dayjs(dateRange[1]).format()}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
