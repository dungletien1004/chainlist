var ChainList = artifacts.require("./ChainList.sol");

// testsuite
contract('ChainList', function(accounts) {
  var chainListInstance;
  console.log(accounts);
  var seller = accounts[0];
  var articleName = "article 1";
  var articleDescription = "Des article 1";
  var articlePrice = "3";

  // it("Should be initialized with empty values", function() {
  //   return ChainList.deployed().then(function(instance) {
  //     return instance.getArticle();
  //   }).then(function(data) {
  //     assert.equal(data[0], 0x0, "seller must be empty");
  //     assert.equal(data[1], "", "article name must be empty");
  //     assert.equal(data[2], "", "article desciption must be empty");
  //     assert.equal(data[3].toNumber(), 0, "article price must be zero");
  //   })
  // });

  // it("Should sell an article", function() {
  //   return ChainList.deployed().then(function(instance) {
  //     chainListInstance = instance;
  //     return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice, "ether"), {from: seller});
  //   }).then(function() {
  //     return chainListInstance.getArticle();
  //   }).then(function(data) {
  //     console.log(Number(data[3]), "-------", Number(web3.utils.toBN(web3.utils.toWei(articlePrice, "ether"))));
  //     assert.equal(data[0], seller, "seller must be " + seller);
  //     assert.equal(data[1], articleName, "article name must be " + articleName);
  //     assert.equal(data[2], articleDescription, "article desciption must be " + articleDescription);
  //     assert.equal(Number(data[3]), Number(web3.utils.toWei(articlePrice, "ether")), "article price must be " + Number(web3.utils.toWei(articlePrice, "ether")));
  //   })
  // });
  // it("Should trigger an article when a new article is sold", function() {
  //   return ChainList.deployed().then(function(instance) {
  //     chainListInstance = instance;
  //     return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice, "ether"), {from: seller});
  //   }).then(function(receipt) {
  //     console.log(receipt);
  //     assert.equal(receipt.logs.length, 1, "one event should have been triggered");
  //     assert.equal(receipt.logs[0].event, "LogSellArticle", "event");
  //     assert.equal(receipt.logs[0].args._seller, seller, "event");
  //     assert.equal(receipt.logs[0].args._name, articleName, "event");
  //   })
  // });
  it("buy article", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice, "ether"), {from: accounts[1]});
    }).then(function(receipt) {
      console.log('receipt======', receipt);
      var buyEvent = chainListInstance.getPastEvents("LogBuyArticle", {_seller: accounts[1]}).then(result => console.log('logBuyEvent=====', result));
      console.log('buyevent====', buyEvent);
      return chainListInstance.buyArticle({from: accounts[2], value: web3.utils.toWei(web3.utils.toBN(3),"ether")});
    }).then(function(result){
      console.log('result=====', result.logs);
      return chainListInstance.getArticle();
    }).then(result => console.log(result));
  })
}); 