
$(document).ready(function(){
    var now = new Date(); 
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

    $("#btn").click(()=>{
        let newPassword = $("#new").val();
        let confPassword = $("#new1").val();
        let obj = {
            userPassword: confPassword
        }
        let webToken = validateJWT();
        if (webToken==null) {
            alert("You must be signed in");
        } else {
            fetch('/users/changepass',{
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
                    console.log("Printing");
                })
            });
        }
    })


});