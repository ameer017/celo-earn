import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";
import contract from "../contract";

const AddReward = () => {
  const [description, setDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addReward = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.addReward(
        description,
        parseInt(pointsRequired)
      );
      await tx.wait();
      setMessage("Reward added successfully!");
      navigate("/reward-page");
    } catch (error) {
      setLoading(false);
      console.error(error);
      setMessage("Failed to add reward");
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
          <h2 className="text-2xl font-bold mb-4">Add New Reward.</h2>
          <form
            onSubmit={addReward}
            className="flex flex-col w-[300px] md:w-[500px] "
          >
            <textarea
              placeholder="Reward Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Points Required"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {loading ? "Adding reward" : "Add Reward"}
            </button>

            <p>{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReward;
