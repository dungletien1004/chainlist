App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,
    loading: false,

    init() {
        return App.initWeb3();
    },

    async initWeb3() {
        //initialize web3
        if (typeof web3 != 'undefined') {
            console.log('metamas', window.ethereum.enable())
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
                console.log(account);
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
        if(App.loading) {
            return;
        }
        
        App.loading = true;

        App.displayAccountInfo();
        console.log('12');

        var chainListInstance;

        App.contracts.ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.getArticlesForSale();
        }).then(function(articleIds) {
            // retrieve the article placeholder and clear it
            $('#articlesRow').empty();

            for(var i = 0; i < articleIds.length; i++) {
                var articleId = articleIds[i];
                chainListInstance.articles(articleId.toNumber()).then(function(article){
                    App.displayArticle(article[0], article[1], article[3], article[4], article[5]);
                });
            }
            App.loading = false;
            
            
        }).catch(function(err) {
            console.log(err.message);
            App.loading = false;
        });
    },

    displayArticle: function(id, seller, name, description, price) {
        var etherPrice = Number(web3.utils.fromWei(price, "ether"))

        var articlesRow = $('#articlesRow');
        var articleTemplate = $('#articleTemplate');
    
        articleTemplate.find('.panel-title').text(name);
        articleTemplate.find('.article-description').text(description);
        articleTemplate.find('.article-price').text(etherPrice + "ETH");
        articleTemplate.find('.btn-buy').attr('data-id', id);
        articleTemplate.find('.btn-buy').attr('data-value', etherPrice);
    
        
        if (seller.toLowerCase() == App.account) {
            articleTemplate.find('.article-seller').text("You");
            articleTemplate.find('.btn-buy').hide();
        } else {
            articleTemplate.find('.article-seller').text(seller);
            articleTemplate.find('.btn-buy').show();
        }

        articlesRow.append(articleTemplate.html());
        // $('#articleRow').append(articleTemplate.html());
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
            App.reloadArticles();
        }).catch(function(err) {
            console.error(err);
        });
    },
    //this function listen to events trigger by the contract
    listenToEvent: function() {
        App.contracts.ChainList.deployed().then(function(instance) {
            instance.getPastEvents("LogSellArticle", {fromBlock: 0, toBlock: 'latest'})
            .then(events => {
                console.log(events);
                events.length > 0 && events.map(event => {
                    $('#events').append('<li class="list-group-item" >' + event.args[2].toString() + ' is now for sale </li>');
                })
            })
            .catch(err => console.log ('error', err.message, err.stack));
            console.log('LogSellArticle');
            App.reloadArticles();
        });

        App.contracts.ChainList.deployed().then(function(instance) {
            console.log('buy');
            instance.getPastEvents("LogBuyArticle", {})
            .then(events => {
                events.length > 0 && events.map(event => {
                    $('#events').append('<li class="list-group-item" >' + event.args._buyer + ' bought ' + event.args._name + ' is now for sale </li>');
                })
            })
            .catch(err => console.log ('error', err.message, err.stack));
            console.log('LogBuyArticle');
            
            App.reloadArticles();
        })
    },

    buyArticle: function() {
        event.preventDefault();
    
        // retrieve the article price
        var _articleId = $(event.target).data('id');
        var _price = Number($(event.target).data('value'));
    
        App.contracts.ChainList.deployed().then(function(instance){ 
          return  instance.buyArticle(_articleId, {
            from: App.account,
            value: web3.utils.toWei(_price.toString(),"ether"),
            gas: 500000
        });
        })
        .then(result => App.reloadArticles())
        .catch(function(error) {
          console.error(error);
        });

      }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
