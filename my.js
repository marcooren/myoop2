



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