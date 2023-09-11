import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/Page/MainPage";
import SecondPage from "./components/Page/SecondPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={-52}
        toastOptions={{
          className: "mt-16",
          duration: 3000,
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="follow" element={<SecondPage />} />
      </Routes>
    </BrowserRouter>
  );
}
