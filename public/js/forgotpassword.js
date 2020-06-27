
$(document).ready(function(){
    $("#btn").click(()=>{
        let email = $("#email").val();
        let newPassword = $("#new").val();
        let confPassword = $("#new1").val();
        let obj = {
            userEmail: email,
            userPassword: confPassword
        }
        fetch('/users/resetpass',{
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then((response)=>{
            console.log("fetching");
            response.json().then((data)=>{
                console.log("Printing");
            })
        });
    })
});