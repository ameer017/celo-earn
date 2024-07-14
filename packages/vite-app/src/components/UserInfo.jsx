import React, { useEffect, useState } from "react";
import contract from "../contract";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";
import { ethers } from "ethers";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const address = await contract.signer.getAddress();
      const userInfo = await contract.getUser(address);
      setAccount(address);

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

      const productDetails = await Promise.all(
        formattedUser.purchasedProducts.map((productId) =>
          contract.getProduct(productId)
        )
      );

      const formattedProducts = productDetails.map((product) => ({
        ...product,
        price: ethers.BigNumber.from(product.price).toString(),
      }));

      setProducts(formattedProducts);

      const rewardDetails = await Promise.all(
        formattedUser.claimedRewards.map((rewardId) =>
          contract.getReward(rewardId)
        )
      );

      const formattedRewards = rewardDetails.map((reward) => ({
        ...reward,
        pointsRequired: ethers.BigNumber.from(reward.pointsRequired).toString(),
      }));

      setRewards(formattedRewards);
    };

    fetchUserData();
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

        <div className="p-2 flex flex-col items-left w-[360px] md:w-[600px] border">
          <h2 className="text-2xl my-2 font-bold text-center">User Information</h2>
          <p className="text-xl">Account: {account}</p>
          <p className="text-xl">Points: {user.points}</p>
          <p className="text-xl">Purchased Products:</p>
          <ul>
            {products.map((product, index) => (
              <li key={index} className="text-sm text-blue-500">
                Name: {product.name}, Price: {ethers.utils.formatEther(product.price)} CELO
              </li>
            ))}
          </ul>
          <p className="text-xl">Claimed Rewards:</p>
          <ul>
            {rewards.map((reward, index) => (
              <li key={index}>
                {reward.description} - {reward.pointsRequired} points
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
