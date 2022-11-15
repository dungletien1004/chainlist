var ChainList = artifacts.require("./ChainList.sol");

// testsuite
contract('ChainList', function(accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var articleName = "article 1";
  var articleDescription = "Des article 1";
  var articlePrice = "3";

  it("Should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      return instance.getArticle();
    }).then(function(data) {
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], "", "article name must be empty");
      assert.equal(data[2], "", "article desciption must be empty");
      assert.equal(data[3].toNumber(), 0, "article price must be zero");
    })
  });

  it("Should sell an article", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice, "ether"), {from: seller});
    }).then(function() {
      return chainListInstance.getArticle();
    }).then(function(data) {
      console.log(Number(data[3]), "-------", web3.utils.toBN(web3.utils.toWei(articlePrice, "ether")));
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], articleName, "article name must be " + articleName);
      assert.equal(data[2], articleDescription, "article desciption must be " + articleDescription);
      assert.equal(data[3], Number(web3.utils.toWei(articlePrice, "ether")), "article price must be " + Number(web3.utils.toWei(articlePrice, "ether")));
    })
  })
}); 