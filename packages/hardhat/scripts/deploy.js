const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${balance.toString()}`);

  const initialPointsPerPurchase = 5;
  const rewardThreshold = 10;

  const Shop = await ethers.getContractFactory("DecentralizedShop");
  const shop = await Shop.deploy(initialPointsPerPurchase, rewardThreshold);

  await shop.deployed();

  console.log(`DecentralizedShop deployed to: ${shop.address}`);

  const data = {
    address: shop.address,
    abi: JSON.parse(shop.interface.format("json")),
  };

  // Adjust the path as per your project structure
  fs.writeFileSync("../Shop.json", JSON.stringify(data, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
