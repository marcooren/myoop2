

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