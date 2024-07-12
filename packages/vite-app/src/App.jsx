import ProductList from "./components/ProductList";
import HeroSection from "./components/Home";
import AddProduct from "./components/AddProduct";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserInfo from "./components/UserInfo";
import Reward from "./components/Reward";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HeroSection />
            </Layout>
          }
        />
        <Route
          path="/product-page"
          element={
            <Layout>
              <ProductList />
            </Layout>
          }
        />
        <Route
          path="/add-product"
          element={
            <Layout>
              <AddProduct />
            </Layout>
          }
        />
        <Route
          path="/user-info"
          element={
            <Layout>
              <UserInfo />
            </Layout>
          }
        />

        <Route
          path="/claim-reward"
          element={
            <Layout>
              <Reward />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
