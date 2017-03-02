/**
 * Created by marco on 22/02/2017.
 */

FileSystem = (function () {
    'use strict';

    function FileSystem() {
        this.lastId = 0;
        this.root = new Folder(this.lastId++, 'root');
    };



    var findById = function (item, id) {
        if (item.id == id) {
            return item;
        } else {
            if (item.children)
                for (var i=0;i<item.children.length;i++) {
                    var found = findById(item.children[i], id);
                    if (found) {
                        return found;
                    }
                }
        }
    };





    FileSystem.prototype.setLastId=function (id){
        this.lastId=id;
    }

    FileSystem.prototype.getItem = function (id) {
        if (!id) {
            return this.root;
        } else {
            return findById(this.root, id);
        }
    };

    FileSystem.prototype.addFolder = function (name, parentId) {
        var folder = this.getItem(parentId);
        for(var i=0;i<folder.children.length;i++) {
            if (folder.children[i].name==name){
                return false;
            }
        }
        var newFolder = new Folder(this.lastId, name);
        folder.addChild(newFolder);
        buildFlatArray();

        this.lastId++;
        return newFolder;
    };

    FileSystem.prototype.addFile=function (name,parentId,content) {
        var newFile = new File(this.lastId,name,content);
        //  console.log(newFile);
        var folder=this.getItem(parentId);
        for(var i=0;i<folder.children.length;i++) {
            if (folder.children[i].name==name){
                return false;
            }
        }

        folder.addChild(newFile);
        buildFlatArray();

        this.lastId++;
        return newFile;
        //   console.log(folder);

    };



    FileSystem.prototype.addFolderWithId = function (name, parentId,myId) {
        var folder = this.getItem(parentId);
        for(var i=0;i<folder.children.length;i++) {
            if (folder.children[i].name==name){
                return false;
            }
        }
        var newFolder = new Folder(myId, name);
        folder.addChild(newFolder);
        this.lastId++;
        return newFolder;
    };

    FileSystem.prototype.addFileWithid=function (name,parentId,content,myId) {
        var newFile = new File(myId,name,content);
        //  console.log(newFile);
        var folder=this.getItem(parentId);
        for(var i=0;i<folder.children.length;i++) {
            if (folder.children[i].name==name){
                return false;
            }
        }

        folder.addChild(newFile);
        this.lastId++;
        return newFile;
        //   console.log(folder);

    };





    FileSystem.prototype.rename=function(id,newName){
        //   console.log(this);

        var item = this.getItem(id);

        item.rename(newName);
        buildFlatArray();

        //   console.log(item);


    };


    FileSystem.prototype.deleteItem=function(id) {
        var parentId=this.returnParentId(this.root,id);
        //   console.log(parentId);
        var item=this.getItem(parentId);
        //    console.log(item);
        item.deleteChild(id);
        buildFlatArray();

    };


    FileSystem.prototype.returnParentId = function (item,id) {

        if(id==0) {
            return -1
        }
        if(item.children)
            for (var i=0;i<item.children.length;i++) {
                if (item.children[i].id==id){
                    return item.id;
                }
                var found = this.returnParentId(item.children[i], id);
                if (found) {
                    return found;
                }
            }

    };





    return FileSystem;
})();

//
//
// FileSystem:
// constructor()//***********************************************
// addFolder(name, parentId)//************************************
// addFile(name, parentId, content)//******************************
// renameItem(id, newName)//****************************
// deleteItem(id)//*******************************************
// getItem(path | id | undefined)//*******************************
// getPath(id)
