import { ethers } from "ethers";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import contract from "../contract";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.addProduct(
        name,
        description,
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      setMessage("Product added successfully!");

      const defaultRewardDescription = `Reward for purchasing ${name}`;
      const defaultPointsRequired = 5;
      const rewardTx = await contract.addReward(
        defaultRewardDescription,
        defaultPointsRequired
      );
      await rewardTx.wait();
      setMessage("Reward added successfully!");
      navigate("/product-page");
    } catch (error) {
      setLoading(false);
      console.error(error);
      setMessage("Failed to add product or reward");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col items-center border justify-center flex-1 relative">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded absolute left-0 top-1 md:hidden"
        >
          {sidebarOpen ? "" : <FaOpenid />}
        </button>
        <div className="p-4 flex flex-col items-center h-[80vh] justify-center">
          <h2 className="text-2xl font-bold mb-4">Add New Product.</h2>
          <form
            onSubmit={addProduct}
            className="flex flex-col w-[300px] md:w-[500px] "
          >
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              id="list-button"
            >
              {loading ? "Adding product" : "Add Product"}
            </button>

            <p>{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
