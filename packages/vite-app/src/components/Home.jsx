import React from "react";
import { Link } from "react-router-dom";
import { useAccount } from "../../utils/AccountContext";

const HeroSection = () => {
  const { account } = useAccount();

  return (
    <section className="bg-gray-100 text-gray-800 p-8 text-center min-h-[85vh] flex flex-col items-center justify-center ">
      <h2 className="text-3xl font-bold">Celo Shop</h2>

      <p className="text-sm">Shop Smart, Earn Rewards!</p>

      <p className="mb-4 text-2xl w-[100%] md:w-[60%] my-2 ">
        Discover a new way to shop online with Celo Shop, where every purchase
        brings you closer to exclusive rewards. Experience the power of
        decentralization and be part of a community that values your loyalty.
      </p>

      {account ? (
        <Link
          to="/product-page"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Shop Now
        </Link>
      ) : (
        <p className="text-center text-red-400">
          Please connect your wallet to start shopping and earning rewards.
        </p>
      )}
    </section>
  );
};

export default HeroSection;
