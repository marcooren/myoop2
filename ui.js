/**
 * Created by marco on 22/02/2017.
 */


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
