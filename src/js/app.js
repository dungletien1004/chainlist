App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init() {
        return App.initWeb3();
    },

    async initWeb3() {
        //initialize web3
        if (typeof web3 != 'undefined') {
            console.log('metamas')
            await window.ethereum.enable();
            App.web3Provider = web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        web3 = new Web3(App.web3Provider);
        App.displayAccountInfo()

        return App.initContract();
    },

    displayAccountInfo: function() {
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $('#account').text(account);
                web3.eth.getBalance(account, function(err, balance) {
                    if (err === null) {
                        $('#accountBalance').text(web3.utils.fromWei(balance, "ether") + "ETH")
                    }
                })
            }
        })
    },

    async initContract() {
       $.getJSON('ChainList.json', function(chainListArtifact) {
        // get the contract artifact file and use it to instantiate a truffle contract abstraction
        App.contracts.ChainList =  TruffleContract(chainListArtifact);
        App.contracts.ChainList.setProvider(App.web3Provider);
        //listen to event
        App.listenToEvent();
        console.log('21');
        return App.reloadArticles();
       });
    },
    
    reloadArticles: function() {
        // refresh account info  because the balance might have changed
        App.displayAccountInfo();
        console.log('12');
        $('#articlesRow').empty();
        App.contracts.ChainList.deployed().then(function(instance) {
            return instance.getArticle();
        }).then(function(article) {
            if (article[0] == 0x0) {
                return;
            }
            var articlesRow = $('#articlesRow');
            var articleTemplate = $('#articleTemplate');
        
            articleTemplate.find('.panel-title').text(article[1]);
            articleTemplate.find('.article-description').text(article[2]);
            articleTemplate.find('.article-price').text(Number(web3.utils.fromWei(article[3], "ether")));
        
            
            var seller = article[0];
            if (seller.toLowerCase() == App.account) {
                seller = "You";
            }
            articleTemplate.find('.article-seller').text(seller);

            //add this article
            articlesRow.append(articleTemplate.html());
            // $('#articleRow').append(articleTemplate.html());
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellArticle: function() {
        var _article_name = $('#article_name').val();
        var _description = $('#article_description').val();
        var _price = String(web3.utils.toWei(web3.utils.toBN($('#article_price').val() || 0), "ether"));

        if (_article_name.trim() == '' || _price == 0) {
            return false;
        }

        App.contracts.ChainList.deployed().then(function(instance) {
            return instance.sellArticle(_article_name, _description, _price, {
                from: App.account,
                gas: 500000
            });
        }).then(function(result) {
        }).catch(function(err) {
            console.error(err);
        });
    },
    //this function listen to events trigger by the contract
    listenToEvent: function() {
        App.contracts.ChainList.deployed().then(function(instance) {
            instance.getPastEvents("LogSellArticle", {fromBlock: 0, toBlock: 'latest'})
            .then(events => {
                events.length > 0 && events.map(event => {
                    $('#events').append('<li class="list-group-item" >' + event.args[1].toString() + ' is now for sale </li>');
                })
            })
            .catch(err => console.log ('error', err.message, err.stack));
            console.log('listen');
        })
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
