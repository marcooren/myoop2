



function reBuildTree() {
    var newArray = JSON.parse(localStorage.getItem("oldstorage").toString());
    if (newArray.length<2) {
        return;
    }
    for (var i=1;i<newArray.length;i++){
        if(newArray[i].content){
            //add file
            Fs.addFileWithid(newArray[i].name,newArray[i].parent,newArray[i].content,newArray[i].id);
            if(Fs.lastId<newArray[i].id) {
                Fs.setLastId(newArray[i].id + 1);
            }
        }
        else {
            Fs.addFolderWithId(newArray[i].name,newArray[i].parent,newArray[i].id);
            if(Fs.lastId<newArray[i].id) {
                Fs.setLastId(newArray[i].id + 1);
            }
        }

    }
};



function buildFlatArray() {
    var folderStack = [];
    folderStack[0] = 0;
    var newArray = [{"id":0,"name":"root","parent":null}];
    var oldCurrentFolder = currentFolder;
    currentFolder = 0;
    buildArray(newArray,Fs.root.children);
    localStorage.setItem("oldstorage", JSON.stringify(newArray));
    currentFolder=oldCurrentFolder;

    function buildArray(newArray, oldArray) {
        for (var i = 0; i < oldArray.length; i++) {
            if (oldArray[i].id == currentFolder) {
                newArray.push({
                    "id": oldArray[i].id,
                    "name": oldArray[i].name,
                    "parent": null
                });
            }
            else {
                if (!oldArray[i].content) {
                    newArray.push({
                        "id": oldArray[i].id,
                        "name": oldArray[i].name,
                        "parent": currentFolder
                    });
                }
                else
                    newArray.push({
                        "id": oldArray[i].id,
                        "name": oldArray[i].name,
                        "parent": currentFolder,
                        "content": oldArray[i].content
                    });
            }
            //    console.log(oldArray[i].name);
            if (oldArray[i].children) {
                folderStack.push(currentFolder);
                currentFolder = oldArray[i].id;
                buildArray(newArray, oldArray[i].children);
                currentFolder = folderStack.pop();
            } //else return;
        }
    }


}





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
                buildFlatArray();
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
                buildFlatArray();

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
        $('.path').val(getPath());
    }


    $('.right_view [class^="right"]').off();
    $(".custom-menu2 li").off();
    $('.right_view [class^="right"]').click(function(event) {
        event.stopPropagation();
        //console.log(($(this).attr('class').replace("right", '')));
        var myClick = +($(this).attr('class').replace("right", ''));
        console.log(myClick);

        if(Fs.getItem(myClick).getType()=='folder') {
            Hi.addToBack(currentFolder);
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




    $('.left_view [class^="left"]').click(function(event) {
        event.stopPropagation();
        console.log(($(this).attr('class').replace("left", '')));
        var myclick = +($(this).attr('class').replace("left", ''));


        if(myclick!=currentFolder) {
            //    folderStack.push(currentFolder);
        }
        // FileOrFolder(myclick, fsStorage);
        Hi.addToBack(currentFolder);
        currentFolder = +($(this).attr('class').replace("left", ''));
        left();
        right(currentFolder);




    });


    $('.left_view [class^="left"] img').click(function(event) {
        event.stopPropagation();
        // var number =
        var close_icon = './images/closed_dirs.jpg';
        var open_icon = './images/open_dirs.jpg';
        var changed = 0;
        if ($(this).attr('src') == close_icon && changed == 0) {

            $(this).attr('src', open_icon);
            changed = 1;
        }
        if ($(this).attr('src') == open_icon && changed == 0) {
            $(this).attr('src', close_icon);
            changed = 1;
        }
        changed = 0;
        $(this).parent().children('ul').toggle(200);
    });











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
        console.log($('.file_text').val());
        var temp=Fs.getItem(myId)
        temp.setContent($('.file_text').val());
        buildFlatArray();

    });

    $('.cancel').click(function(event) {
        event.stopPropagation();
        // drawLeft();
        // drawRight();
        right(currentFolder);
    });
    return;
}



function drawNav() {
    var nav_menu = '<div class="main_menu"></div><button class="back">Back</button>' +
        '<button class="forward">Forward</button>Location:<input type="text" class="path" name="path" value="' + "root" + '"><button class="goto">Goto</button></div>';
    $('.top').empty();
    //console.log(currentFolder);
    $('.top').html(nav_menu);

    // $('.path').val(currentFolder);
    $('.goto').click(function(event){
        event.stopPropagation();
        var test=$('.path').val();
        var newPath=test.split('\\');
        if(newPath[newPath.length-1]=='')
            newPath.splice(newPath.length-1,1);
        if(newPath.length==1 && newPath[0]=='root'){
            Hi.addToBack(currentFolder);
            currentFolder=0;
            right(currentFolder);
        }
        console.log(newPath);
        // (function check_path(mypath){
        //     if (mypath.length) {
        //         if (mypath[0]!='root') {
        //             alert("no such path");
        //             return false;
        //         }
        //         if(mypath.length>=2){
        //             var temp=checkPath(mypath,Fs.root)
        //             if (temp=-1) {
        //                 currentFolder = temp;
        //                 right(currentFolder);
        //             }
        //         }
        //     }
        // }(newPath));

        (function check_path(mypath){
            var lastId=-1
            passOn2(Fs.root.children,mypath,0);


            function passOn2(myArray, myparent,x) {
                if(myparent.length<=x) {
                    return;
                }
                for (var i = 0; i < myArray.length; i++) {
                    if(myArray[i].name==myparent[x+1]){
                        if(myArray[i].children) {
                            console.log(myArray[i].id);
                            if (x+2==myparent.length) {
                                lastId=myArray[i].id;
                            }
                            passOn2(myArray[i].children, myparent, x + 1);
                        }
                    }
                }

            }





            console.log("last id: "+lastId);

            if(lastId!=-1) {
                //   folderStack.push(currentFolder);
                Hi.addToBack(currentFolder);
                currentFolder = lastId;
                right(currentFolder);
                return;
                //  drawLeft();
            }

        }(newPath));


    });

    $('.back').click(function(event) {
        event.stopPropagation();
        var temp=Hi.goBack();
        console.log(temp);
        if(!Fs.getItem(temp)){
            return;
        }
        if (temp==-1){
            return;
        }
        Hi.addToForward(currentFolder);
        currentFolder=temp;
        right(currentFolder);
        //  left();

    });

    $('.forward').click(function(event) {
        event.stopPropagation();
        var temp=Hi.goForward();
        console.log(temp);
        if(!Fs.getItem(temp)){
            return;
        }
        if (temp==-1){
            return;
        }
        Hi.addToBack(currentFolder);
        currentFolder=temp;
        right(currentFolder);
        //  left();

    });
}


function minimizeAll(){
    $('.left0').children('ul').children('ul').children('ul').children('ul').toggle();
    $('.left0').children('ul').children('ul').children('ul').toggle();
    $('.left0').children('ul').children('ul').toggle();
    $('.left0').children('ul').toggle();
}


function getPath(){
    var path=[];
    var dir=currentFolder;
    if (currentFolder==0)
        path.push(0);
    while(dir!=-1)
    {
        var temp = Fs.returnParentId(Fs.root, dir);
        if(temp!=-1) {
            path.push(dir);
        }
        if(temp==0){
            path.push(0);
        }
        dir=temp;
    }


    var pathString='';

    for(var i=path.length-1;i>=0;i--){
        pathString+=Fs.getItem(path[i]).name+'\\';
    }

    return pathString;

    //Fs.getItem(currentFolder).name



}