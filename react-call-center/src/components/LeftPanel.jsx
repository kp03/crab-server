import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { MainPageContext } from "./Page/MainPage";
import axiosClient from "../config/axiosClient";

export const LeftPanel = () => {
  const [carType, setCarType] = useState(4);
  const [name, setName] = useState("");
  const { address, setAddress } = useContext(MainPageContext);
  const [phone, setPhone] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const handleChange = (event) => {
    setCarType(event.target.value);
  };
  const onSubmit = async () => {
    setIsSubmit(true);
    console.log({ name, phone, address, carType });
    if (name.length > 0 && phone.length > 0 && address.address.length > 0) {
      await axiosClient
        .post(`customer`, {
          phone: phone,
          name: name,
          address_id: address.id,
          // driver_id: "",
          seat_number: carType,
        })
        .then(toast.success("Điều phối thành công!"))
        .catch((err) => toast.error(err.message));

      setName("");
      setPhone("");
      setAddress({ address: "", id: "" });
      setIsSubmit(false);
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
    }
  };
  return (
    <div className="pt-4 w-[30%] h-full border bg-white">
      <FormControl fullWidth>
        <div className="text-center text-xl font-semibold text-orange-500">
          Thông tin khách hàng
        </div>
        <div className="px-8 my-2">
          <TextField
            error={name.length < 1 && isSubmit}
            required
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={() => setIsSubmit(false)}
            label="Tên khách hàng"
            variant="outlined"
          />
        </div>
        <div className="px-8 my-2">
          <TextField
            error={phone.length < 1 && isSubmit}
            required
            fullWidth
            type="number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            onFocus={() => setIsSubmit(false)}
            label="Số điện thoại"
            variant="outlined"
          />
        </div>
        <div className="px-8 my-2">
          <TextField
            error={address.address.length < 1 && isSubmit}
            required
            fullWidth
            value={address.address}
            InputProps={{
              readOnly: true,
            }}
            onFocus={() => setIsSubmit(false)}
            label="Địa chỉ"
            variant="outlined"
          />
        </div>
        <div className="px-8 my-2">
          <Select value={carType} onChange={handleChange}>
            <MenuItem value={4}>Xe 4 chỗ</MenuItem>
            <MenuItem value={7}>Xe 7 chỗ</MenuItem>
          </Select>
        </div>
        <div className="flex justify-center my-4">
          <Button onClick={onSubmit} variant="contained" endIcon={<SendIcon />}>
            Điều phối
          </Button>
        </div>
      </FormControl>
    </div>
  );
};
