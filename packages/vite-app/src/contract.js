import { ethers } from "ethers";
import Shop from "../../Shop.json";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();
const contractAddress = Shop.address;
const contractABI = Shop.abi;
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export default contract;