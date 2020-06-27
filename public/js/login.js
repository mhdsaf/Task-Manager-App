$(document).ready(function(){
    $("#alertmsg").hide();
    $("#alertmsg1").hide();
    $("#submit").click(()=>{ // create user
        event.preventDefault();
        const username = $("#username1").val();
        const email = $("#email1").val();
        const password = $("#password1").val();
        const confpass = $("#password2").val();
        if(password==confpass){
            if(password.length<6){
                $("#error").html("Password too short");
                $("#alertmsg").show();
            }else{
                fetch('/users/new',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username: username, email: email, password: password})
                }).then((response)=>{
                    console.log("fetching");
                    response.json().then((data)=>{
                        if(data.error){
                            $("#alertmsg1").hide();
                            $("#error").html(data.error);
                            $("#alertmsg").show();
                        }
                        else{
                            console.log("asd");
                            $("#alertmsg").hide();
                            $("#error1").html("An email has been sent to you. Please go ahead and verify!");
                            $("#alertmsg1").show();
                        }
                    })
                });
            }
        
    }else{
        $("#alertmsg1").hide();
        $("#error").html("Passwords don't match");
        $("#alertmsg").show();
    }
    })
})

// Signing up -> email with jwt -> This takes him to the main page with his account

// Login -> inserts email and password -> redirected to main

// Remember me -> JWT token is valid for 6 hours -> If user access the webpage within the 6 hour interval -> 

