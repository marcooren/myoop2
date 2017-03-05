/**
 * Created by marco on 22/02/2017.
 */


var currentFolder=0;
var oldClick='';

Folder = (function () {
    'use strict';

    function Folder(id, name) {
        this.id = id;
        this.name = name;
        this.children = [];
    };

    Folder.prototype.getType = function () {
        return 'folder';
    };

    Folder.prototype.getId = function () {
        return this.id;
    };


    Folder.prototype.getChildren = function () {
        return this.children;
    };

    Folder.prototype.deleteChild = function (myId) {
        if(this.children)
       for(var i=0;i<this.children.length;i++){
           if(this.children[i].id==myId) {
         //      console.log(typeof(this.children));
               this.children.splice(i, 1);


           }
       }
    };

    Folder.prototype.addChild = function (item) {
        this.children.push(item);


    };

    Folder.prototype.findChild = function (myId) {
        for(var i=0;i<this.children.length;i++){
            if(this.children[i].id==myId) {
                return this.children[i];
            }
        }
    };


    Folder.prototype.rename = function (newName) {
        this.name=newName;
        buildFlatArray();

    };



    return Folder;
})();




//
// constructor(id, name) //*******************************************
// deleteChild(id)//***********************************
// rename(newName)  //***********************************
// addChild(Folder | File)//******************************
// findChild(id)//*************************************
// getChildren() //****************************************
// getId()   //****************************************************
// getType() //******************************************************




