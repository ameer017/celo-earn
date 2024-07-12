// ClaimReward.js
import React, { useEffect, useState } from "react";
import contract from "../contract";

const Reward = () => {
  const [rewards, setRewards] = useState([]);
  const [claimingReward, setClaimingReward] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewards = await contract.getAllRewards();
        setRewards(rewards);
        console.log(rewards)
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
      // Optionally, you can refresh the rewards list after claiming
      const updatedRewards = await contract.getAllRewards();
      setRewards(updatedRewards);
    } catch (error) {
      console.error("Failed to claim reward:", error);
      setMessage("Failed to claim reward");
    } finally {
      setClaimingReward(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl my-4 font-bold">Claim Rewards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {rewards.map((reward, index) => (
          <div key={index} className="border p-4 rounded">
            <h3>{reward.description}</h3>
            <p>Points Required: {reward.pointsRequired}</p>
            <button
              onClick={() => claimReward(reward.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              disabled={claimingReward}
            >
              {claimingReward ? "Claiming..." : "Claim Reward"}
            </button>

            <p>{message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reward;
