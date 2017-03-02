/**
 * Created by marco on 22/02/2017.
 */


File= (function () {
    'use strict';

    function File(id,name,content){
        this.id=id;
        this.name=name;
        this.content=content;
    };

    File.prototype.rename = function (newName) {
        this.name=newName;
    };


    File.prototype.setContent = function (content) {
        this.content=content;
    };

    File.prototype.getContent = function (content) {
        return this.content;
    };

    File.prototype.getId = function () {
        return this.id;
    };

    File.prototype.getType = function () {
        return "file";
    };

    return File;


})();

// File
// constructor(id, name, content)  ******************************************
// rename(newName) ************************************************
// setContent(content)*****************************************
// getContent()*************************************************
// getId()*****************************************
// getType()******************************************************
