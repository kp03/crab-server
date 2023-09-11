import { LeftPanel } from "../LeftPanel";
import { RightPanel } from "../RightPanel";
import { createContext, useState } from "react";

export const MainPageContext = createContext(null);

export default function MainPage() {
  const [address, setAddress] = useState({
    address : "",
    id : ""
  });

  return (
    <MainPageContext.Provider value={{ address, setAddress }}>
      <div className="px-32 pt-16 flex justify-center items-center h-screen bg-orange-200">
        <LeftPanel />
        <RightPanel />
      </div>
    </MainPageContext.Provider>
  );
}
