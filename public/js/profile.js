
$(document).ready(function(){
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
        const viewImage = () => {
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
                        console.log("Printing");
                        if (data.error) {
                            $("#delete").hide();
                        } else {
                            $('#blah').attr('src', `data:image/png;base64,${data.image}`);
                            $('#blah1').attr('src', `data:image/png;base64,${data.image}`);
                            $("#delete").show();
                        }
                        
                    })
                });
            }
        }
        viewImage();
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
        $("#me").click(()=>{
            APIrequest('GET', '/users');
        });
        $("#submitPhoto").click(()=>{
            console.log(localStorage.getItem('token'));
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                const fileInput = document.querySelector('#upload1') ;
                const formData = new FormData();
                formData.append('upload1', fileInput.files[0]); 
                fetch('/users/me/avatar',{
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + webToken
                    },
                    body: formData
                }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        console.log("Printing");
                        console.log(data);
                    })
                });
            }
        });
        $("#delete").click(()=>{
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
            fetch('/users/me/avatar',{
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    console.log("Printing");
                    console.log(data);
                })
            });
        }
        });
        $("#changepass").click(function (e) { 
            console.log("clicke");
            e.preventDefault();
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                const oldpass = $("#Opassword").val();
                console.log(oldpass);
                const newpass = $("#Npassword").val();
                const newpass1 = $("#Npassword1").val();
                if (oldpass!="" && newpass!="" && newpass1!="") {
                    if(newpass.length<6 || newpass1.length<6){
                        alert("Password should have a minimum of 6 characters")
                    }else{
                        if(newpass==newpass1){
                            let webToken = validateJWT();
                    if (webToken==null) {
                        alert("You must be signed in");
                    } else {
                            fetch('/users/changepassword',{
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + webToken
                                },
                                body: JSON.stringify({password: oldpass, newpassword: newpass})
                            }).then((response)=>{
                                console.log("fetching");
                                response.json().then((data)=>{
                                    console.log(data);
                                })
                            });
                        }
                        }else{
                            alert("Passwords don't match");
                        }
                    }
                } else {
                    alert("All fields should be filled");
                }
                
            }
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
                        console.log(data);
                        localStorage.removeItem('token');
                        document.getElementById('mainp').click();
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
                        document.getElementById('mainp').click();
                    })
                });
            }
        });
        $("#deactivate").click(()=>{
            let webToken = validateJWT();
            if (webToken==null) {
                alert("You must be signed in");
            } else {
                fetch('/users/me',{
                    method: 'DELETE',
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
                        document.getElementById('mainp').click()
                    })
                });
            }
        });
    }
});
