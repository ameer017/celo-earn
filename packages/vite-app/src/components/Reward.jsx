import React, { useEffect, useState } from "react";
import contract from "../contract";
import Sidebar from "./SideBar";
import { FaOpenid } from "react-icons/fa6";
import { ethers } from "ethers";

const ClaimReward = () => {
  const [rewards, setRewards] = useState([]);
  const [claimingReward, setClaimingReward] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewards = await contract.getAllRewards();
        const formattedRewards = rewards.map((reward) => ({
          ...reward,
          pointsRequired: ethers.BigNumber.from(
            reward.pointsRequired
          ).toNumber(),
          isClaimed: reward.isClaimed, // Assuming isClaimed is part of the reward object
        }));
        setRewards(formattedRewards);
      } catch (error) {
        console.error("Failed to fetch rewards:", error);
        setError("Failed to fetch rewards");
      }
    };
    fetchRewards();
  }, []);

  const claimReward = async (rewardId) => {
    try {
      setClaimingReward(true);
      const tx = await contract.claimReward(rewardId);
      await tx.wait();
      setMessage("Reward claimed successfully!");

      const updatedRewards = await contract.getAllRewards();
      const formatRewards = updatedRewards.map((reward) => ({
        ...reward,
        pointsRequired: ethers.BigNumber.from(reward.pointsRequired).toNumber(),
        isClaimed: reward.isClaimed, // Assuming isClaimed is part of the reward object
      }));
      setRewards(formatRewards);
    } catch (error) {
      console.error("Failed to claim reward:", error);
      setMessage("Failed to claim reward");
    } finally {
      setClaimingReward(false);
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      setRedeemingReward(true);

      // Manually set a gas limit
      const gasLimit = 1000000; // Adjust this value as needed

      const tx = await contract.redeemReward(rewardId, redeemAmount, {
        gasLimit,
      });
      await tx.wait();

      setMessage("Reward redeemed successfully!");

      const updatedRewards = await contract.getAllRewards();
      const formatRewards = updatedRewards.map((reward) => ({
        ...reward,
        pointsRequired: ethers.BigNumber.from(reward.pointsRequired).toNumber(),
        isClaimed: reward.isClaimed, // Assuming isClaimed is part of the reward object
      }));
      setRewards(formatRewards);
      setRedeemAmount(0);
    } catch (error) {
      console.error("Failed to redeem reward:", error);

      // Handle specific error cases
      if (error.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT) {
        setMessage(
          "Failed to redeem reward: Unpredictable gas limit. Please try again or check your parameters."
        );
      } else if (error.code === -32603) {
        setMessage(
          "Failed to redeem reward: Internal JSON-RPC error. Please check your contract and parameters."
        );
      } else {
        setMessage("Failed to redeem reward");
      }
    } finally {
      setRedeemingReward(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col items-center  justify-center flex-1 relative">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded absolute left-0 top-1 md:hidden"
        >
          {sidebarOpen ? "" : <FaOpenid />}
        </button>
        <div className="flex flex-col items-center ">
          <h1 className="text-3xl my-4 font-bold">Claim and Redeem Rewards</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {rewards.map((reward, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-lg flex flex-col">
                <h3 className="my-2 text-[15px] ">{reward.description}</h3>
                <p className="my-2 font-bold">Points Required: {reward.pointsRequired}</p>
                {!reward.isClaimed && (
                  <button
                    onClick={() => claimReward(reward.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    disabled={claimingReward}
                  >
                    {claimingReward ? "Claiming..." : "Claim Reward"}
                  </button>
                )}
                {reward.isClaimed && (
                  <div className="mt-4 flex flex-col">
                    <input
                      type="text"
                      value={redeemAmount}
                      onChange={(e) =>
                        setRedeemAmount(parseInt(e.target.value))
                      }
                      className="px-4 py-2 border rounded"
                      placeholder="Enter redeem amount"
                    />
                    <button
                      onClick={() => redeemReward(reward.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                      disabled={redeemingReward || redeemAmount <= 0}
                    >
                      {redeemingReward ? "Redeeming..." : "Redeem Reward"}
                    </button>
                    <p>{message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimReward;
