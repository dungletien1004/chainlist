App = {
    web3Provider: null,
    contracts: {},

    init() {
        /*
         * Replace me...
         */

        return App.initWeb3();
    },

    async initWeb3() {
        /*
         * Replace me...
         */

        return App.initContract();
    },

    async initContract() {
        /*
         * Replace me...
         */
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
