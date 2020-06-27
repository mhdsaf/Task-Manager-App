$(document).ready(function(){
    var now = new Date();
    $("#homepage").hide();
    $("#alertmsg").hide();
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
    $("#submit").click(()=>{
        event.preventDefault();
        let email = $("#email1").val();
        let password = $("#password1").val();
        fetch('/users/loginverify',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        }).then((response)=>{
            console.log("fetching");
            response.json().then((data)=>{
                if(data.error){
                    // wrong credentials
                    $("#error").html("Invalid Email or Password");
                    $("#alertmsg").show();
                }else{
                    let jwt = {
                        value: data.token,
                        expiry: now.getTime() + (3600000 * 6)  // expiry date  = 6 hours
                    };
                    localStorage.setItem('token', JSON.stringify(jwt));
                    console.log(localStorage.getItem('token'));
                    $('#homepage')[0].click();
                }
            })
        });        
    });
})