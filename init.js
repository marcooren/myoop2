


var Fs=new FileSystem();
var Hi=new History();

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


if (localStorage.getItem("oldstorage")) {
    reBuildTree();
} else {
    Fs.addFolder("sub1",0);
    Fs.addFolder("sub2",0);
    Fs.addFile("file1.txt",1,"test");
    Fs.addFolder("sub3",0);
    Fs.addFolder("sub5",1);
    Fs.addFolder("sub10",5);
    Fs.addFolder("sub8",5);
    Fs.addFile("file11.txt",0,"hgjghj");
}


right(0);//****************************************************************
left();//******************************************************************
drawNav();
minimizeAll();



