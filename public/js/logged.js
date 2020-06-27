$(document).ready(function(){
    localStorage.setItem('elem', undefined);
    var now = new Date();
    $("#main").hide();
    const validateJWT = () => {
        const item = localStorage.getItem('token');
        if(!item){
            return null;
        }else{
            const itemObj = JSON.parse(item);
            if(now.getTime()>itemObj.expiry){
                localStorage.removeItem('token');
                return null
            }else{
                return itemObj.value
            }
        }
    };
    const taskCount = (linkk='/userTasks/count')=>{
        let webToken = validateJWT();
        if (webToken==null) {
            alert("You must be signed in");
        } else {
            console.log(linkk);
            fetch(linkk,{
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    localStorage.setItem('count',data.count);
                    localStorage.setItem('url', '/tasks?&limit=6');
                })
            });
        }
    }
    taskCount();
    const viewPic = () => {
        let webToken = validateJWT();
        if (webToken==null) {
            alert("You must be signed in");
        } else {
            fetch('/users/avatar',{
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    if (data.error) {
                    } else {
                        $('#blah').attr('src', `data:image/png;base64,${data.image}`);
                    }
                })
            });
        }    
    }
    viewPic();
    const APIrequest = (method, route) => {
        let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                fetch(route,{
                    method: method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + webToken
                    }
                }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        console.log(data);
                    })
                });
            }
    }
    
    if(validateJWT()==null){
        document.getElementById('main').click();
    }else{
        { // css section
            var click = false;
            var click1 = false;
            $(".navbar-toggler").addClass("moveit");
            $(".myform").addClass("ug");
            $(".navbar-toggler").click(()=>{
                if(click1==false){
                    $(".navbar-toggler").removeClass("moveit");
                    
                    $(".prof").addClass("pic1");
                    $(".dropd").addClass("xd1");
                    $(".prof").removeClass("pic");
                    $(".dropd").removeClass("xd");
                }
                else{
                    $(".prof").addClass("pic");
                    $(".dropd").addClass("xd");
                    $(".prof").removeClass("pic1");
                    $(".dropd").removeClass("xd1");
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
        } // end of css section

        // Sending request to API Section:
        const readTasks = (path = '/tasks?&limit=6') => {
            let webToken = validateJWT();
            if(webToken==null){
                alert("You must be signed in");
            }else{
            //let endpoint = `/tasks?status=false&limit=1&sort=createdAt:-1`;
            fetch(path,{
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        if(data.error){
                            console.log("1")
                        }else{

                            let i = 1;
                            let status = "";
                            let shadow = "";
                            let date = "";
                            $("#taskCards").html("");
                            while(i<=data.length){
                                if(data[i-1].status==false){
                                    status = 'Incomplete'
                                    shadow = 'bord1'
                                }else{
                                    status = 'Complete';
                                    shadow = 'bord'
                                }
                                date = data[i-1].createdAt.split('T');
                                date = date[0].split('-');
                                $("#taskCards").append(`<div class='col-lg-4 col-md-6 col-sm-12 pb-5'><div class='card text-center ${shadow}'><div class='card-header lead'><span class='pl-5'>Task ${i}</span><span class='float-right' id='${data[i-1]._id}'><i class='far fa-edit' style='cursor: pointer;' id="upd" data-toggle=tooltip data-placement=bottom title=Update></i></span><span class='float-right pr-3' id='${data[i-1]._id}'><i class='fa fa-trash' style='color: red; cursor: pointer;' id='del' data-toggle=tooltip data-placement=bottom title=Delete></i></span></div><div class=card-body><p class=card-text>${data[i-1].description}</p><p class=card-text></p></div><div class=card-footer text-muted lead>Created: ${date[2]}-${date[1]}-${date[0]}<br><span class='font-weight-bold'>Status: ${status}</span></div></div></div>`)
                                i++;
                            }
                            let countTask = Math.ceil(localStorage.getItem('count')/6);
                            console.log(localStorage.getItem('count'));
                            if(localStorage.getItem('count')>6){
                                $("#pagination").html("");
                                i = 0;
                                while(i<countTask){
                                    if(localStorage.getItem('elem')==i){
                                        $("#pagination").append(`<li class="page-item active">
                                    <a class="page-link" id=${i} name="page" href="#">${i+1}</a></li>`);
                                    }else{
                                        $("#pagination").append(`<li class="page-item">
                                    <a class="page-link" id=${i} name="page" href="#">${i+1}</a></li>`);
                                    }
                                    i++;
                                }
                            }else{
                                $("#pagination").html("");
                            }
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                    });
                });
            }
        }
        readTasks();
        $("#me").click(()=>{
            APIrequest('GET', '/users');
        });
        $("#submitPhoto").click(function (e) { 
            e.preventDefault();
            document.getElementById('upload1').click();
        });
        $("#logout").click(()=>{
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                fetch('/users/logout',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + webToken
                    }
                }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        localStorage.removeItem('token');
                        document.getElementById('login').click();
                    })
                });
            }
        });
        $("#logoutAll").click(()=>{
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                fetch('/users/logoutAll',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + webToken
                    }
                }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        console.log(data);
                        localStorage.removeItem('token');
                        document.getElementById('login').click();
                    })
                });
            }
        });
        $("#add").click(function (e) { 
            e.preventDefault();
            let webToken = validateJWT();
            let description = $("#description").val();
            let status = false;
            if(document.getElementById('t').checked) {
                status = true;
            };
            if(description==""){
                alert("All tasks should have a description field");
            }else{
                fetch(`/tasks`,{
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ webToken
                    },
                    body: JSON.stringify({description: description, status: status})
                }).then((response)=>{
                    console.log("fetching");
                    $("#taskCards").html("");
                    taskCount();
                    readTasks();
                })
            }
        });
        $("#taskCards").on('click','#del',function(){
            //alert($(this).parent().attr('id'));
            //$('#myModal').modal('show');
            if (confirm("Are you sure you want to delete the task?")) {
                let webToken = validateJWT();
                let taskid = $(this).parent().attr('id');
                let endpoint = `/tasks/${taskid}`;
                fetch(endpoint,{
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + webToken
                    }
                }).then((response)=>{
                    $("#taskCards").html("");
                    taskCount();
                    readTasks();
                });
            }
        });
        $("#taskCards").on('click','#upd',function(){
            //alert($(this).parent().attr('id'));
            webToken = validateJWT();
            $('#myModal').modal('show');
            let taskid = $(this).parent().attr('id');
            sessionStorage.setItem('taskid', taskid);
            console.log(taskid);
            let endpoint = `/tasks/${taskid}`;
            fetch(endpoint,{
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    $("#updDesc").val(data.Description);
                });
            });
        });
        $("#upddTask").click(function (e) { 
            e.preventDefault();
            let webToken = validateJWT();
            let description = $("#updDesc").val();
            let status = "";
            let obj = "";
            if(document.getElementById('tt').checked) {
                status = true;
            }else if(document.getElementById('ff').checked){
                status = false;
            }
            if(status!=false && status!=true){
                obj ={
                    description: description
                }
            }else{
                obj = {
                    description: description,
                    status: status
                }
            }
            let taskid = sessionStorage.getItem('taskid');
            let endpoint = `/tasks/${taskid}`;
            fetch(endpoint,{
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + webToken
                },
                body: JSON.stringify(obj)
            }).then((response)=>{
                $("#taskCards").html("");
                readTasks();
            });
        });
        $("#apply").click(function (e) { 
            e.preventDefault();
            let status = undefined;
            if(document.getElementById('comp').checked) {
                status = true;
            } else if(document.getElementById('ncomp').checked){
                status = false;
            }
            let sort = undefined;
            if(document.getElementById('asc').checked){
                sort = '1';
            }else if(document.getElementById('desc').checked){
                sort = '-1';
            }
            $("#taskCards").html("");
            if(sort!=undefined && status!=undefined){
                localStorage.setItem('url', `/tasks?sort=createdAt:${sort}&status=${status}&limit=6`);
                taskCount(`/userTasks/count?status=${status}`)
                readTasks(`/tasks?sort=createdAt:${sort}&status=${status}&limit=6`);
            }else if(sort!=undefined && status==undefined){
                localStorage.setItem('url', `/tasks?sort=createdAt:${sort}&limit=6`);
                readTasks(`/tasks?sort=createdAt:${sort}&limit=6`);
            }else if(sort==undefined && status!=undefined){
                localStorage.setItem('url', `/tasks?status=${status}&limit=6`);
                taskCount(`/userTasks/count?status=${status}`)
                readTasks(`/tasks?status=${status}&limit=6`);
            }else{
                localStorage.setItem('url', '/tasks?&limit=6');
                readTasks();
            }
        });
        $("#reset").click(function (e) { 
            e.preventDefault();
            document.getElementById("f1").reset();
            document.getElementById("f2").reset();
        });
        $("#pagination").on('click','[name ="page"]',function(){
            let id = $(this).attr('id');
            let newURL = localStorage.getItem('url').concat(`&skip=${id*6}`);
            localStorage.setItem('elem', id);
            readTasks(newURL);
        });
    }
});
