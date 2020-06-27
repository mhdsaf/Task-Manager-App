$(document).ready(function(){
    var click = false;
    var click1 = false;
    $(".navbar-toggler").addClass("moveit");
    $(".myform").addClass("ug");
    $(".navbar-toggler").click(()=>{
        if(click1==false){
            $(".navbar-toggler").removeClass("moveit");
        }
        else{
            $(".navbar-toggler").addClass("moveit");
        }
        click1=!click1;
        click=!click;
        if(click==false){
            $(".myform").removeClass("su");
        }else{
            $(".myform").addClass("su");
        }
    })
});  