import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { createContext } from "react";

const columnsForFollow = [
  {
    field: "customer",
    headerName: "Khách hàng",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "driver",
    headerName: "Tài xế",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "carType",
    headerName: "Loại xe",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  { field: "address", headerName: "Điểm đón", flex: 3, headerAlign: "center" },
  {
    field: "status",
    headerName: "Tình trạng",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "time",
    headerName: "Thời gian đã đi (phút)",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "note",
    headerName: "Ghi chú",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

const rows2 = [
  {
    id: 1,
    address: "20-22 Ngô Quyền, Phường 5, Quận 10",
    customer: "Nguyễn Văn A",
    driver: "Nguyễn Văn C",
    carType: 4,
    status: "In progress",
    time: "120",
  },
  {
    id: 2,
    address: "123 Đường Trần Hưng Đạo, Quận 1",
    customer: "Trần Thị B",
    phone: "0912345678",
    latitude: 10.776879,
    longitude: 106.696525,
  },
  {
    id: 3,
    address: "456 Đường Lê Lai, Quận 3",
    customer: "Lê Văn C",
    phone: "0909876543",
    latitude: 10.780132,
    longitude: 106.691717,
  },
  {
    id: 4,
    address: "789 Đường Nam Kỳ Khởi Nghĩa, Quận 3",
    customer: "Phạm Thị D",
    phone: "0976543210",
    latitude: 10.784935,
    longitude: 106.68696,
  },
  {
    id: 5,
    address: "1010 Đường Lê Duẩn, Quận 1",
    customer: "Võ Văn E",
    phone: "0965432109",
    latitude: 10.772147,
    longitude: 106.698822,
  },
  {
    id: 6,
    address: "222 Đường Nguyễn Đình Chính, Quận Phú Nhuận",
    customer: "Hoàng Thị F",
    phone: "0954321098",
    latitude: 10.794734,
    longitude: 106.68446,
  },
  {
    id: 7,
    address: "333 Đường Nguyễn Văn Trỗi, Quận Gò Vấp",
    customer: "Nguyễn Văn G",
    phone: "0943210987",
    latitude: 10.837193,
    longitude: 106.686271,
  },
  {
    id: 8,
    address: "444 Đường Lê Văn Sỹ, Quận Tân Bình",
    customer: "Trương Thị H",
    phone: "0932109876",
    latitude: 10.79897,
    longitude: 106.664776,
  },
  {
    id: 9,
    address: "555 Đường Hồ Bieu Chanh, Quận Phú Nhuận",
    customer: "Lý Văn I",
    phone: "0921098765",
    latitude: 10.80075,
    longitude: 106.674387,
  },
  {
    id: 10,
    address: "789 Đường Nguyễn Du, Quận 1",
    customer: "Phan Văn J",
    phone: "0912345678",
    latitude: 10.775309,
    longitude: 106.703733,
  },
  {
    id: 11,
    address: "999 Đường Bạch Đằng, Quận 4",
    customer: "Mai Thị K",
    phone: "0987654321",
    latitude: 10.764831,
    longitude: 106.693987,
  },
  {
    id: 12,
    address: "321 Đường Cách Mạng Tháng Tám, Quận 5",
    customer: "Lê Văn L",
    phone: "0909876543",
    latitude: 10.754197,
    longitude: 106.668298,
  },
  {
    id: 13,
    address: "123 Đường Phan Xích Long, Quận Phú Nhuận",
    customer: "Nguyễn Thị M",
    phone: "0976543210",
    latitude: 10.798219,
    longitude: 106.685903,
  },
  {
    id: 14,
    address: "456 Đường Trường Sa, Quận 3",
    customer: "Võ Văn N",
    phone: "0965432109",
    latitude: 10.787576,
    longitude: 106.713854,
  },
  {
    id: 15,
    address: "111 Đường Võ Thị Sáu, Quận 1",
    customer: "Trần Văn P",
    phone: "0954321098",
    latitude: 10.771349,
    longitude: 106.702016,
  },
  {
    id: 16,
    address: "888 Đường Lê Hồng Phong, Quận 10",
    customer: "Phạm Thị Q",
    phone: "0943210987",
    latitude: 10.770903,
    longitude: 106.662808,
  },
  {
    id: 17,
    address: "777 Đường Bến Vân Đồn, Quận 4",
    customer: "Lê Văn R",
    phone: "0932109876",
    latitude: 10.757692,
    longitude: 106.704516,
  },
  {
    id: 18,
    address: "222 Đường Lý Tự Trọng, Quận 1",
    customer: "Nguyễn Văn S",
    phone: "0921098765",
    latitude: 10.773998,
    longitude: 106.69899,
  },
  {
    id: 19,
    address: "444 Đường Nguyễn Trãi, Quận 5",
    customer: "Trương Thị T",
    phone: "0987654321",
    latitude: 10.755901,
    longitude: 106.674618,
  },
  {
    id: 20,
    address: "666 Đường Hùng Vương, Quận 5",
    customer: "Lý Văn U",
    phone: "0912345678",
    latitude: 10.759425,
    longitude: 106.659889,
  },
  {
    id: 21,
    address: "999 Đường Võ Văn Kiệt, Quận 6",
    customer: "Nguyễn Thị A",
    phone: "0987654321",
    latitude: 10.746483,
    longitude: 106.647477,
  },
  {
    id: 22,
    address: "123 Đường Hồ Bieu Chanh, Quận Phú Nhuận",
    customer: "Trần Văn B",
    phone: "0912345678",
    latitude: 10.804497,
    longitude: 106.674839,
  },
  {
    id: 23,
    address: "789 Đường Phan Xích Long, Quận Phú Nhuận",
    customer: "Lê Thị C",
    phone: "0909876543",
    latitude: 10.797969,
    longitude: 106.688264,
  },
];

const rows1 = [];

const STATUS = ["In progress", "Complete"];

const vietnameseNames = [
  "Nguyễn Văn Nam",
  "Trần Thị Hiếu",
  "Lê Văn Cường",
  "Phạm Thị Lan",
  "Võ Văn Anh",
  "Hoàng Thị Mai",
  "Nguyễn Văn Tâm",
  "Trương Thị Thu",
  "Lý Văn Hòa",
  "Phan Thị Thảo",
  "Mai Văn Tú",
  "Lê Thị Ngọc",
  "Nguyễn Thanh Hải",
  "Võ Thị Dung",
  "Trần Văn Thắng",
  "Phạm Văn Hoàng",
  "Lê Thị Hoài",
  "Nguyễn Thị Hà",
  "Trương Văn Đạt",
  "Lý Thị Hương",
  "Nguyễn Thanh Tùng",
  "Trần Văn Quang",
  "Lê Thị Phượng",
];

for (let id = 1; id <= 20; id++) {
  const newRow = { ...rows2[id] }; // Clone the first row's data

  // Update properties for the new row
  newRow.id = id;
  newRow.customer =
    vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
  newRow.driver =
    Math.random() < 0.5
      ? null
      : vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
  newRow.status =
    newRow.driver === null
      ? "Waiting"
      : STATUS[Math.floor(Math.random() * STATUS.length)];
  newRow.time =
    newRow.driver === null
      ? Math.floor(Math.random() * 5)
      : Math.floor(Math.random() * 60);
  newRow.carType = Math.random() < 0.5 ? 4 : 7;

  rows1.push(newRow); // Add the new row to the array
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
  },
  "& .MuiDataGrid-row:hover": {
    cursor: "pointer",
  },
  ".MuiDataGrid-cell:focus": {
    outline: "none",
  },
}));

export const SecondPageContext = createContext(null);

export default function SecondPage() {
  return (
    <SecondPageContext.Provider value={{}}>
      <div className="px-32 pt-16 bg-orange-200">
        <div className="pt-2 pb-32 border bg-white">
          <div className="text-center text-xl font-semibold text-orange-500 mb-2">
            Theo dõi tình trạng chuyến xe
          </div>
          <div className="px-8 mb-4 flex gap-8 items-center">
            <TextField
              size="small"
              className="w-2/5"
              label="Tên khách hàng"
              variant="outlined"
            />
            <Button size="small" variant="contained" endIcon={<SearchIcon />}>
              Search
            </Button>
          </div>
          <div className="px-8">
            <StripedDataGrid
              rows={rows1}
              columns={columnsForFollow}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
            />
          </div>
        </div>
      </div>
    </SecondPageContext.Provider>
  );
}
