import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contract from "../contract";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [buyingProduct, setBuyingProduct] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await contract.getAllProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const purchaseProduct = async (productId, price) => {
    try {
      setBuyingProduct(true);
      const tx = await contract.purchaseProduct(productId, { value: price });
      await tx.wait();
      setMessage("Product purchased successfully!");
      const updatedProducts = await contract.getAllProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to purchase product:", error);
      setMessage("Failed to purchase product");
    } finally {
      setBuyingProduct(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col items-center flex-1 relative">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded absolute left-0 top-1 md:hidden"
        >
          {sidebarOpen ? "" : <FaOpenid />}
        </button>
        <h1 className="text-3xl my-4 font-bold">Market Place</h1>

        {message && <p>{message}</p>}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {products.map((product, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="text-2xl mb-2">{product.name}</h3>
                <p className="text-[15px] font-normal">{product.description}</p>
                <p className="font-bold my-2">
                  {ethers.utils.formatEther(product.price)} ETH
                </p>

                <button
                  onClick={() => purchaseProduct(product.id, product.price)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  disabled={product.isSold || buyingProduct}
                >
                  {product.isSold ? "Bought" : "Buy Product"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No product found! Add new product instead{" "}
            <Link
              to="/add-product"
              className="bg-blue-600 p-2 rounded text-white"
            >
              Add Product
            </Link>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
