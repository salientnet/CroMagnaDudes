import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Home from "./views/Home";
import NFTList from "./views/NFTList";

import "./App.css";

// const Home = lazy(() => import("./views/Home"));
// const NFTList = lazy(() => import("./views/NFTList"));
// const NotFound = lazy(() => import("./views/NotFound"));

function App() {
  return (
    <div className="app">
      <Header />
      <Container
        sx={{ flexGrow: 1, paddingTop: "40px", paddingBottom: "40px" }}
      >
        {/* <Suspense fallback={<Loading />}> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nftlist" element={<NFTList />} />
          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
        {/* </Suspense> */}
      </Container>
    </div>
  );
}

export default App;
