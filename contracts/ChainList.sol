// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.18 <=0.8.17;

contract ChainList {
  // state variables
    address seller;
    string name;
    string description;
    uint256 price;
    constructor() public {
      sellArticle("Default article", "this is an article set by default", 10000000000000000000);
    }
    // sell an article
    function sellArticle(string memory _name, string memory _description, uint256 _price) public {
      seller = msg.sender;
      name = _name;
      description = _description;
      price = _price;
    }

    function getArticle() public view returns (
      address _seller,
      string memory _name,
      string memory _description,
      uint256 _price
    ) {
      return(seller, name, description, price);
    }
}