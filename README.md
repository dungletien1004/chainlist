# ChainSkills Truffle Box

This Truffle Box has all you need to create a DApp by following the course delivered by [ChainSkills](https://www.udemy.com/getting-started-with-ethereum-solidity-development/).

This box has been based from [pet-shop-box](https://github.com/truffle-box/pet-shop-box).

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox chainskills/chainskills-box-truffle5
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```
## Run
    ```javascript
    truffle migrate --network ganache
    truffle console --network ganache
    ChainList.address //display address
    accounts = await web3.eth.getAccounts() // gan account list vao accounts variable
    amountAccount_1 = await web3.eth.getBalance(accounts[1])
    web3.utils.fromWei(amountAccount_1, "ether")
    ChainList.deployed().then(function(instance){app=instance;})
    app.sellArticle("iphone7", "selling in order to buy iPhone8", web3.utils.toWei(web3.utils.toBN(3),"ether"), {from: accounts[1]})
    ```
