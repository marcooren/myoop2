
History = (function () {
    'use strict';

    function History() {
        this.back = [];
        this.forward=[];
    };

    History.prototype.goBack= function () {
        if (this.back.length==0) {
            return -1;
        }
        return this.back.pop();


    };

    History.prototype.goForward= function () {
        if (this.forward.length==0){
            return -1;
        }

        return this.forward.pop();

    };

    History.prototype.addToHistory= function (id) {
        this.back.push(id);

    };

    History.prototype.addToBack=function (id){
        this.back.push(id);

    };

    History.prototype.addToForward=function(id){
        this.forward.push(id);

    };







    return History;
})();

//
// History*************************************
// constructor()********************************
// goBack()***********************************
// goForward()***********************************
// addToHistory(id)******************************