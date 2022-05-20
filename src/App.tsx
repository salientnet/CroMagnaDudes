import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import Header from "./components/Header";
import Home from "./views/Home";
import NFTList from "./views/NFTList";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <Container
        sx={{ flexGrow: 1, paddingTop: "80px", paddingBottom: "120px" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<NFTList />} />
          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
      </Container>
    </div>
  );
}

export default App;
