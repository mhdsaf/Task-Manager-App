$(document).ready(function(){
    var click = false;
    var click1 = false;
    $(".nb1").addClass("moveit2");
    $(".myform2").addClass("ug2");
    $(".nb1").click(()=>{
        if(click1==false){
            $(".nb1").removeClass("moveit2");
            
            $(".prof").addClass("pic12");
            $(".dropd").addClass("xd12");
            $(".prof").removeClass("pic2");
            $(".dropd").removeClass("xd2");
        }
        else{
            $(".prof").addClass("pic2");
            $(".dropd").addClass("xd2");
            $(".prof").removeClass("pic12");
            $(".dropd").removeClass("xd12");
            $(".nb1").addClass("moveit2");
        }
        click1=!click1;
        click=!click;
        if(click==false){
            $(".myform2").removeClass("su2");
        }else{
            $(".myform2").addClass("su2");
        }
    })
    
});
