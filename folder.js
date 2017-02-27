/**
 * Created by marco on 22/02/2017.
 */


var currentFolder=0;
var oldClick='';




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
        var newFolder = new Folder(this.lastId++, name);
        folder.addChild(newFolder);
        return newFolder;
    };

    FileSystem.prototype.addFile=function (name,parentId,content) {
        var newFile = new File(this.lastId++,name,content);
      //  console.log(newFile);
        var folder=this.getItem(parentId);
        for(var i=0;i<folder.children.length;i++) {
            if (folder.children[i].name==name){
                return false;
            }
        }

        folder.addChild(newFile);
        return newFile;
     //   console.log(folder);

    };



    FileSystem.prototype.rename=function(id,newName){
     //   console.log(this);

      var item = this.getItem(id);

        item.rename(newName);
     //   console.log(item);











    };


    FileSystem.prototype.deleteItem=function(id) {
       var parentId=this.returnParentId(this.root,id);
    //   console.log(parentId);
        var item=this.getItem(parentId);
    //    console.log(item);
        item.deleteChild(id);
    };


    FileSystem.prototype.returnParentId = function (item,id) {

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



History = (function () {
    'use strict';

    function History() {
        this.back = [];
        this.forward=[];
    };

    History.prototype.goBack= function () {
        return this.back.pop();


    };

    History.prototype.goForward= function () {
        return this.forward.pop();

    };

    History.prototype.addToHistory= function (id) {
        this.back.push(id);

    };




    return History;
})();

//
// History*************************************
// constructor()********************************
// goBack()***********************************
// goForward()***********************************
// addToHistory(id)******************************


var Fs=new FileSystem();
Fs.addFolder("sub1",0);
Fs.addFolder("sub2",0);
Fs.addFile("file1.txt",1,"test");
Fs.addFolder("sub3",0);
Fs.addFolder("sub5",1);
Fs.addFolder("sub10",5);
Fs.addFolder("sub8",5);
Fs.addFile("file11.txt",0,"hgjghj");




$('.views').on("contextmenu", function(event) {

    event.preventDefault();



    $(".custom-menu").finish().toggle(100).

    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
});

$(document).on("mousedown", function(e) {

    if (!$(e.target).parents(".custom-menu").length > 0) {
        $(".custom-menu").hide(100);
    }
});

right(0);//****************************************************************
left();//******************************************************************




$(".custom-menu li").click(function() {

    switch ($(this).attr("data-action")) {


        case "1":

            var folderName = prompt("Enter folder name to create", "newfolder"+Fs.lastId++);

            if (folderName !== null && folderName !== '') {
                if (!Fs.addFolder(folderName, currentFolder))
                    alert("there is already a file or folder in current dir with that name");
                //buildFlatArray();
                //drawLeft();
                //drawRight();
                left();
                right(currentFolder);
            }
                break;

        case "2":
            var fileName = prompt("Enter a file name to create", "newfile.txt"+Fs.lastId++);
            if (fileName !== null && fileName !== '') {
                if (!Fs.addFile(fileName,currentFolder,"#"))
                    alert("there is already a file or folder in current dir with that name");
                //buildFlatArray();
                //drawLeft();
                //drawRight();
                left();
                right(currentFolder);
            }
            break;
    }


    $(".custom-menu").hide(100);
});





























function right(id) {

    $('.right_view').html('');

    print_right(id);
    function print_right(id) {

        if (Fs.getItem(id).getType() != 'folder')
            return;

        if (Fs.getItem(id).children) {
            for (var i = 0; i < Fs.getItem(id).children.length; i++) {

                if(Fs.getItem(id).children[i].getType()=='folder'){
                    //print folder
                    $('.right_view').append('<div class="right' + Fs.getItem(id).children[i].id + '"><img src="./images/closed_dir.jpg"></br><center>' + Fs.getItem(id).children[i].name + '</center></div>');
                }else {
                    //print file
                    $('.right_view').append('<div class="right' + Fs.getItem(id).children[i].id + '"><img src="./images/file.jpg"></br><center>' + Fs.getItem(id).children[i].name + '</center></div>');

                }
            //    console.log(Fs.getItem(id).children[i].name);
            }
        }
    }


    $('.right_view [class^="right"]').off();
    $(".custom-menu2 li").off();
    $('.right_view [class^="right"]').click(function(event) {
        event.stopPropagation();
        //console.log(($(this).attr('class').replace("right", '')));
        var myClick = +($(this).attr('class').replace("right", ''));
        console.log(myClick);

        if(Fs.getItem(myClick).getType()=='folder') {
            currentFolder = +($(this).attr('class').replace("right", ''));
            right(currentFolder);
        }
         if(Fs.getItem(myClick).getType()=='file') {
             openFile(myClick);
         }


    });

    $('.right_view [class^="right"]').on("contextmenu", function(event) {
        event.stopPropagation();
        event.preventDefault();
        myClick = +($(this).attr('class').replace("right", ''));
        oldClick=myClick;

        $(".custom-menu2").finish().toggle(100).css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });

    $(document).bind("mousedown", function(e) {
        // If the clicked element is not the menu
        //  console.log($(this));
        if (!$(e.target).parents(".custom-menu2").length > 0) {
            // Hide it
            $(".custom-menu2").hide(100);
        }
    });


    $(".custom-menu2 li").click(function() {
        // This is the triggered action name
        // console.log(this);
        switch ($(this).attr("data-action")) {

            // A case for each action. Your actions here
            case "1":
                //   console.log(this);
              Fs.deleteItem(oldClick);
                left();
                right(currentFolder);
                //drawLeft();
                //drawRight();
                break;
            case "2":
                var folderName = prompt("Enter new name to rename to: ");
                if (folderName !== null && folderName !== '')
                    if(Fs.rename(oldClick,folderName)) {
                //    alert("there is already a file or folder in current dir with that name");
                   // break;
                }

                    left()
                    right(currentFolder);

                break;
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu2").hide(100);
    });











}

function left() {

    $('.left_view').off();

    $('.left_view').html('');
    $('.left_view').append('<ul class="left0"><img src="./images/closed_dirs.jpg">root</ul>');
    print_left(0,'.left0');
    function print_left(id,parent) {

        if (Fs.getItem(id).children) {
            for (var i = 0; i < Fs.getItem(id).children.length; i++) {
                if (Fs.getItem(id).children[i].getType() == 'folder') {
                  //  console.log(Fs.getItem(id).children[i].name);
                    $(parent).append('<ul class="left' + Fs.getItem(id).children[i].id + '"><img src="./images/closed_dirs.jpg">' + Fs.getItem(id).children[i].name + '</ul>');
                    if (Fs.getItem(id).children[i].children) {
                        print_left(Fs.getItem(id).children[i].id,'.left'+Fs.getItem(id).children[i].id);
                    }
                }
            }
        }

    };


    










};

















function openFile(myId) {
    var myContent = '';
    //findContentOfFile(myId, myArray);
    if(!Fs.getItem(myId).getType()=='folder')
        return;
    var original_text = Fs.getItem(myId).content;
    $('.right_view').html('<textarea class="file_text" rows="10" cols="50">' + original_text + '</textarea></br><button class="save">Save</button><button class="cancel">Cancel</button>');

    $('.save').click(function(event) {
        event.stopPropagation();
        found = 0;
     //   setContentOfFile(($('.file_text').val()), myId, myArray);
        Fs.getItem(myId).setContent($('.file_text').val());
    });

    $('.cancel').click(function(event) {
        event.stopPropagation();
        // drawLeft();
        // drawRight();
       right(currentFolder);
    });
    return;
}