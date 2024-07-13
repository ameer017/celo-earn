// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedShop {
    address public owner;
    uint256 public productCounter;
    uint256 public rewardCounter;
    uint256 public pointsPerPurchase;
    uint256 public rewardThreshold;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address payable seller;
        bool isSold;
    }

    struct Reward {
        uint256 id;
        string description;
        uint256 pointsRequired;
        address claimer;
        bool isClaimed;
    }

    struct User {
        uint256 points;
        uint256[] purchasedProducts;
        uint256[] claimedRewards;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Reward) public rewards;
    mapping(address => User) public users;

    event ProductAdded(uint256 id, string name, uint256 price, address seller);
    event ProductPurchased(uint256 id, address buyer);
    event RewardAdded(uint256 id, string description, uint256 pointsRequired);
    event RewardClaimed(uint256 id, address claimer);
    event RewardWithdrawn(uint256 id, address claimer, uint256 amount);

    constructor(uint256 _pointsPerPurchase, uint256 _rewardThreshold) {
        owner = msg.sender;
        pointsPerPurchase = _pointsPerPurchase;
        rewardThreshold = _rewardThreshold;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        productCounter++;
        products[productCounter] = Product(
            productCounter,
            _name,
            _description,
            _price,
            payable(msg.sender),
            false
        );
        emit ProductAdded(productCounter, _name, _price, msg.sender);
    }

    function purchaseProduct(uint256 _productId) public payable {
        Product storage product = products[_productId];
        require(msg.value == product.price, "Incorrect value sent");
        require(!product.isSold, "Product already sold");

        product.isSold = true;
        product.seller.transfer(msg.value);
        users[msg.sender].points += pointsPerPurchase;
        users[msg.sender].purchasedProducts.push(_productId);

        // Check if user has reached reward threshold
        if (users[msg.sender].points >= rewardThreshold) {
            rewardCounter++;
            rewards[rewardCounter] = Reward(
                rewardCounter,
                "Reward for reaching points threshold",
                rewardThreshold,
                msg.sender,
                false
            );
            emit RewardAdded(
                rewardCounter,
                "Reward for reaching points threshold",
                rewardThreshold
            );
        }

        emit ProductPurchased(_productId, msg.sender);
    }

    function getProduct(
        uint256 _productId
    ) public view returns (Product memory) {
        return products[_productId];
    }

    function addReward(
        string memory _description,
        uint256 _pointsRequired
    ) public onlyOwner {
        rewardCounter++;
        rewards[rewardCounter] = Reward(
            rewardCounter,
            _description,
            _pointsRequired,
            address(0),
            false
        );
        emit RewardAdded(rewardCounter, _description, _pointsRequired);
    }

    function claimReward(uint256 _rewardId) public {
        Reward storage reward = rewards[_rewardId];
        User storage user = users[msg.sender];
        require(user.points >= reward.pointsRequired, "Not enough points");
        require(!reward.isClaimed, "Reward already claimed");

        user.points -= reward.pointsRequired;
        user.claimedRewards.push(_rewardId);
        reward.isClaimed = true;
        reward.claimer = msg.sender;

        emit RewardClaimed(_rewardId, msg.sender);
    }

    function redeemReward(uint256 _rewardId, uint256 _amount) public {
        Reward storage reward = rewards[_rewardId];
        require(reward.claimer == msg.sender, "You did not claim this reward");
        require(reward.isClaimed, "Reward is not claimed");

        emit RewardWithdrawn(_rewardId, msg.sender, _amount);

        payable(msg.sender).transfer(_amount);
    }

    function getReward(uint256 _rewardId) public view returns (Reward memory) {
        return rewards[_rewardId];
    }

    function getUser(address _user) public view returns (User memory) {
        return users[_user];
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCounter);
        for (uint256 i = 1; i <= productCounter; i++) {
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }

    function getAllRewards() public view returns (Reward[] memory) {
        Reward[] memory allRewards = new Reward[](rewardCounter);
        for (uint256 i = 1; i <= rewardCounter; i++) {
            allRewards[i - 1] = rewards[i];
        }
        return allRewards;
    }
}
