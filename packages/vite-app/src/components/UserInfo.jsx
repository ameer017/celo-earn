// src/components/UserInfo.js
import React, { useEffect, useState } from "react";
import contract from "../contract";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";
import { ethers } from "ethers";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const address = await contract.signer.getAddress();
      const userInfo = await contract.getUser(address);

      // Create a new object with converted properties
      const formattedUser = {
        points: ethers.BigNumber.from(userInfo.points).toString(),
        purchasedProducts: userInfo.purchasedProducts.map((p) =>
          ethers.BigNumber.from(p).toString()
        ),
        claimedRewards: userInfo.claimedRewards.map((r) =>
          ethers.BigNumber.from(r).toString()
        ),
      };

      setUser(formattedUser);
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) return <div>Loading...</div>;

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

        <div className="p-2">
          <h2 className="text-2xl my-2 font-bold">User Information</h2>
          <p className="text-xl">Points: {user.points}</p>
          <p className="text-xl">Purchased Products: {user.purchasedProducts.join(", ")}</p>
          <p className="text-xl">Claimed Rewards: {user.claimedRewards.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
