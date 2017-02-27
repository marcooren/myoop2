/**
 * Created by marco on 22/02/2017.
 */
FileSystem = (function () {
    'use strict';

    function FileSystem() {
        this.lastId = 0;
        this.root = new Folder(this.lastId++, 'root');
    }

    var findById = function (item, id) {
        if (item.id == id) {
            return item;
        } else {
            for (var child of item.children) {
                var found = findById(child, id);
                if (found) {
                    return found;
                }
            }
        }
    }

    FileSystem.prototype.getItem = function (id) {
        if (!id) {
            return this.root;
        } else {
            return findById(this.root, id);
        }
    }

    FileSystem.prototype.addFolder = function (name, parentId) {
        var folder = this.getItem(parentId);
        var newFolder = new Folder(this.lastId++, name);
        folder.addChild(newFolder);
        return newFolder;
    }

    return FileSystem;
})();


var Fs=new FileSystem();
console.log(Fs);

//
//
// FileSystem:
// constructor()//***********************************************
// addFolder(name, parentId)
// addFile(name, parentId, content)
// renameItem(id, newName)
// deleteItem(id)
// getItem(path | id | undefined)
// getPath(id)
