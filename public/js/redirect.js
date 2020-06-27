$(document).ready(function () {
    const now = new Date();
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
    setTimeout(() => {
        if (validateJWT()==null) {
            console.log("false")
        } else {
            fetch('/home',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + validateJWT()
                }
            }).then((response)=>{
                console.log("fetching");
                response.json().then((data)=>{
                    //$('#main2').html(`Description: ${data.Description} Status: ${data.Status}`);
                });
            });
        }
    }, 0); 
});