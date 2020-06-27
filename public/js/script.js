$(document).ready(function(){
    var now = new Date();
    console.log(localStorage.getItem('token'));
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
    }
    $("#btn5").click(()=>{ // creating a task
        let webToken = validateJWT();
        if(webToken==null){
            alert("You must be signed in")
        }else{
            let description = $("#taskDesc").val();
        let completed = $("#status").val();
        if(description){
            if (completed) {
                if(completed=='true'){
                    completed = true;
                }else{
                    completed = false;
                }
            } else {
                completed = false;
            }
            fetch(`/tasks`,{
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ webToken
                },
                body: JSON.stringify({description: description, status: completed})
            }).then((response)=>{
                console.log("fetching");
                console.log(response);
                response.json().then((data)=>{
                    if(!data){
                        console.log("failed")
                    }else{
                        console.log("success");
                        $("#main3").html(`New task inserted! Description: ${data.description}, Completed: ${data.status}`);
                    }
                })
            })
        }else{
            alert("Tasks must have a description field!");
        }
        }
    });
    $("#btn4").click(()=>{ //reading all tasks for a user

        let webToken = validateJWT();
        if(webToken==null){
            alert("You must be signed in");
        }else{
        let endpoint = `/tasks?status=false&limit=1&sort=createdAt:-1`;
        fetch(endpoint,{
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + webToken
            }
        }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    console.log(data);
                });
            });
        }
    })
    $("#btn6").click(()=>{ // reading a specific task for a user
        let webToken = validateJWT();
        if(webToken==null){
            alert("You must be signed in");
        }else{
            let taskid = $('#taskID').val();
        console.log(taskid);
        let endpoint = `/tasks/${taskid}`;
        console.log(endpoint);
        fetch(endpoint,{
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + webToken
            }
        }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    if(data.error){
                        $('#main2').html(data.error);
                    }else{
                        $('#main2').html(`Description: ${data.Description} Status: ${data.Status}`);
                    }
                    
                });
            });
        }
    });
    $('#btn7').click(()=>{ // updating a task 
        let taskid = $('#taskID1').val();
        console.log(taskid);
        let endpoint = `/tasks/${taskid}`;
        console.log(endpoint);
        fetch(endpoint,{
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1nczM1QG1haWwuYXViLmVkdSIsImlhdCI6MTU5MTQ0NzI3Nn0.oH41BEkRDw01W3pCEBZs_jAjOJ4QvYNGmJKCYN4swvE'
            },
            body: JSON.stringify({status: true})
        }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    
                });
            });
    });
    $("#btn8").click(()=>{
        const webToken = validateJWT();
        if(webToken==null){
            console.log("You need to be signed in");
        }else{
            let taskid = $('#taskID2').val();
            let endpoint = `/tasks/${taskid}`;
            fetch(endpoint,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    //$('#main2').html(`Description: ${data.Description} Status: ${data.Status}`);
                    
                });
            });
        }
    });
    //login 
    $("#login").click(()=>{
        let email = $("#email").val();
        let password = $("#password").val();
        fetch('/users/login',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        }).then((response)=>{
            console.log("fetching");
            response.json().then((data)=>{
                //console.log(data.token);
                let jwt = {
                    value: data.token,
                    expiry: now.getTime() + (3600000 * 6)  // expiry date  = 6 hours
                };
                localStorage.setItem('token', JSON.stringify(jwt));
                console.log(localStorage.getItem('token'));
            })
        });
    });
    
    /**********************************End of task functionalities ***************************/

    $("#cUser").click(()=>{ // create user
        const username = $("#username1").val();
        const email = $("#email1").val();
        const password = $("#password1").val();
        fetch('/users',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, email: email, password: password})
        }).then((response)=>{
            console.log("fetching");
            response.json().then((data)=>{
                console.log(data.token);
                let jwt = {
                    value: data.token,
                    expiry: now.getTime() + (3600000 * 6)  // expiry date  = 6 hours
                };
                localStorage.setItem('token', JSON.stringify(jwt));
                console.log(localStorage.getItem('token'));
            })
        });
    })
    $("#profile").click(() => {
        let webToken = validateJWT();
        if(webToken==null){
            alert("You must be signed in");
        }else{
            fetch('/users',{
                method: 'GET',
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
    });
    $("#updBtn").click(() => { // UPDATING PROFILE
        let webToken = validateJWT();
        let username = $("#updUsername").val();
        let password = $("#updPassword").val();
        if(webToken==null){
            alert("You must be signed in");
        }else{
            let obj;
            if(username){
                obj = {
                    username: username
                }
                if(password){
                    obj = {
                        username: username,
                        password: password
                    }
                }
            }else if(password){
                obj = {
                    password: password
                }
            }
            fetch('/users/me',{
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + webToken
                },
                body: JSON.stringify(obj)
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    console.log(data);
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
                })
            });
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
                })
            });
        }
    });

    $("#showImg").click(()=>{
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
                    $('#ItemPreview').attr('src', `data:image/png;base64,${data.image}`);
                })
            });
        }
    });

    $("#changepass").click(()=>{
        let webToken = validateJWT();
        if (webToken==null) {
            alert("You must be signed in");
        } else {
            fetch('/users/changepassword',{
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + webToken
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    console.log("Printing");
                })
            });
        }
    });
    
    $("#submitPhoto").click(()=>{
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

    $("#forgotpass").click(()=>{
        let email = $("#email").val();
        let obj = {
            email: email
        }
        fetch('/users/forgotpassword',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then((response)=>{
            console.log("fetching");
            response.json().then((data)=>{
                console.log("Printing");
                console.log(data);
            })
        });
    });

});



// Req -> /change

// Send link with JWT

// Req -> /changepassword/token

// Verify token: if token verified, render an html page. Else, return 400 error
