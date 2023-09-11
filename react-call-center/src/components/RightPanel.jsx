import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { MainPageContext } from "./Page/MainPage";
import axiosClient from "../config/axiosClient";

const columnsForHistory = [
  { field: "address", headerName: "Địa chỉ", flex: 3, headerAlign: "center" },
  {
    field: "customer",
    headerName: "Khách hàng",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "phone",
    headerName: "Số điện thoại",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

const columnsForGGSearch = [
  { field: "address", headerName: "Địa chỉ", flex: 3, headerAlign: "center" },
];

const rows1 = [
  {
    id: 24,
    address: "1010 Đường Lý Thường Kiệt, Quận 1",
    customer: "Phạm Văn D",
    phone: "0976543210",
    latitude: 10.768229,
    longitude: 106.698872,
  },
  {
    id: 25,
    address: "111 Đường Nguyễn Đình Chính, Quận Phú Nhuận",
    customer: "Võ Thị E",
    phone: "0965432109",
    latitude: 10.795915,
    longitude: 106.686032,
  },
  {
    id: 26,
    address: "444 Đường Nam Kỳ Khởi Nghĩa, Quận 3",
    customer: "Nguyễn Văn F",
    phone: "0954321098",
    latitude: 10.789551,
    longitude: 106.692564,
  },
  {
    id: 27,
    address: "555 Đường Điện Biên Phủ, Quận Bình Thạnh",
    customer: "Trần Thị G",
    phone: "0943210987",
    latitude: 10.791235,
    longitude: 106.712453,
  },
  {
    id: 28,
    address: "666 Đường Văn Cao, Quận Ba Đình",
    customer: "Lê Văn H",
    phone: "0932109876",
    latitude: 10.810496,
    longitude: 106.679354,
  },
  {
    id: 29,
    address: "777 Đường Phan Đăng Lưu, Quận Phú Nhuận",
    customer: "Phạm Văn I",
    phone: "0921098765",
    latitude: 10.800126,
    longitude: 106.682076,
  },
  {
    id: 30,
    address: "888 Đường Trần Khắc Chân, Quận 1",
    customer: "Võ Thị J",
    phone: "0987654321",
    latitude: 10.771518,
    longitude: 106.695245,
  },
  {
    id: 31,
    address: "999 Đường Văn Kỳ, Quận Tân Bình",
    customer: "Nguyễn Văn K",
    phone: "0912345678",
    latitude: 10.808994,
    longitude: 106.669426,
  },
  {
    id: 32,
    address: "123 Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh",
    customer: "Trần Thị L",
    phone: "0909876543",
    latitude: 10.801198,
    longitude: 106.723456,
  },
  {
    id: 33,
    address: "456 Đường Lý Thường Kiệt, Quận 10",
    customer: "Lê Văn M",
    phone: "0976543210",
    latitude: 10.776761,
    longitude: 106.688348,
  },
  {
    id: 34,
    address: "789 Đường Nguyễn Văn Cừ, Quận 5",
    customer: "Phạm Thị N",
    phone: "0965432109",
    latitude: 10.756398,
    longitude: 106.694715,
  },
  {
    id: 35,
    address: "1010 Đường Lê Hồng Phong, Quận 10",
    customer: "Võ Thị O",
    phone: "0954321098",
    latitude: 10.772457,
    longitude: 106.676358,
  },
  {
    id: 36,
    address: "111 Đường Cách Mạng Tháng Tám, Quận 1",
    customer: "Nguyễn Văn P",
    phone: "0943210987",
    latitude: 10.770529,
    longitude: 106.684079,
  },
  {
    id: 37,
    address: "444 Đường Võ Thị Sáu, Quận 3",
    customer: "Trần Thị Q",
    phone: "0932109876",
    latitude: 10.776672,
    longitude: 106.700546,
  },
  {
    id: 38,
    address: "555 Đường Võ Văn Kiệt, Quận 6",
    customer: "Lê Văn R",
    phone: "0921098765",
    latitude: 10.746483,
    longitude: 106.647477,
  },
  {
    id: 39,
    address: "666 Đường Phan Xích Long, Quận Phú Nhuận",
    customer: "Phạm Thị S",
    phone: "0987654321",
    latitude: 10.804497,
    longitude: 106.674839,
  },
  {
    id: 40,
    address: "777 Đường Lê Thị Hồng Gấm, Quận Tân Bình",
    customer: "Võ Văn T",
    phone: "0912345678",
    latitude: 10.797969,
    longitude: 106.688264,
  },
];

const rows2 = [
  {
    id: 1,
    address: "20-22 Ngô Quyền, Phường 5, Quận 10",
    customer: "Nguyễn Văn A",
    phone: "0987654321",
    latitude: 10.776897,
    longitude: 106.693283,
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

export const RightPanel = () => {
  const { setAddress } = useContext(MainPageContext);
  const [historyText, setHistoryText] = useState("");
  const [serviceText, setServiceText] = useState("");

  const [historyData, setHistoryData] = useState([]);
  const [ggMapData, setGGMapData] = useState([]);

  const handleSelectAddress = (params) => {
    console.log(params);
    toast.success("Chọn địa chỉ thành công!");
    setAddress({
      address : params.row.address,
      id : params.row.id
    });
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleHistoryText = (e) => {
    setHistoryText(e.target.value);
  };
  const handleServiceText = (e) => {
    setServiceText(e.target.value);
  };

  const handleSearchHistory = async (event) => {
    console.log("click");
    console.log(historyText);
    if(!historyText){
      
      return
    }

    console.log("here");

    const result = await axiosClient.get(`/location/search?address=${historyText}`, {
      //body
    });
    //result co dang giong bien rows2

    if(result.data.length <=0 ){
      toast.error("Không tìm thấy dữ liệu")
    }

    setHistoryData(result.data);
  };

  const handleSearchGGMap = async (event) => {
    
    if(!serviceText){
      return;
    }

    console.log(axiosClient.getUri());

    const result = await axiosClient.get(`/location/search-api?address=${serviceText}`, {
      //body
    });
    //result co dang giong bien rows1

    console.log(result.data)

    setGGMapData(result.data);
  };

  return (
    <div className="pt-2 w-[70%] h-full border bg-white overflow-auto">
      <FormControl fullWidth>
        <div className="text-center text-xl font-semibold text-orange-500 mb-2">
          Lịch sử địa chỉ
        </div>
        <div className="px-8 mb-4 flex gap-8 items-center">
          <TextField
            size="small"
            className="w-2/5"
            label="Địa chỉ"
            variant="outlined"
            value={historyText}
            onChange={handleHistoryText}
          />
          <Button
            onClick={handleSearchHistory}
            size="small"
            variant="contained"
            endIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => setIsOpen(true)}
            endIcon={<SearchIcon />}
          >
            Tìm bằng Google map
          </Button>
          <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                minWidth: 600,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose
                variant="outlined"
                sx={{
                  top: "calc(-1/4 * var(--IconButton-size))",
                  right: "calc(-1/4 * var(--IconButton-size))",
                  boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                  borderRadius: "50%",
                  bgcolor: "background.surface",
                }}
              />
              <Typography
                component="h2"
                id="modal-title"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
                mb={1}
              >
                Tìm kiếm địa chỉ từ Google
              </Typography>
              <Typography id="modal-desc" textColor="text.tertiary">
                <div className="mb-4 flex gap-8 items-center">
                  <TextField
                    size="small"
                    className="w-2/5"
                    label="Địa chỉ"
                    variant="outlined"
                    value={serviceText}
                    onChange={handleServiceText}
                  />
                  <Button
                    onClick={handleSearchGGMap}
                    size="small"
                    variant="contained"
                    endIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                </div>
                <StripedDataGrid
                  rows={ggMapData}
                  columns={columnsForGGSearch}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5]}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                  }
                  onRowClick={handleSelectAddress}
                />
              </Typography>
            </Sheet>
          </Modal>
        </div>
        <div className="px-8">
          <StripedDataGrid
            rows={historyData}
            columns={columnsForHistory}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            onRowClick={handleSelectAddress}
          />
        </div>
      </FormControl>
    </div>
  );
};
