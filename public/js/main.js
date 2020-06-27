$(document).ready(function () {
    var now = new Date();
    $("#home").hide();
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
    if (validateJWT()==null) {
        // render the notlogged page
        document.getElementById('notlogged').click();
    } else {
        // render the logged page
        document.getElementById('logged').click();
    }
});