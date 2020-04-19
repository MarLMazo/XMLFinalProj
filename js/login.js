window.onload =  function(){
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var error = document.getElementById("error");
    var forms = document.forms[0];

    forms.onsubmit = function(){

        //If no value or empty field
        if(username.value === "" || password.value === ""){
            console.log("failed");
            error.innerHTML = "Incorrect username or password";
            error.style = "color: red";
            return false;

        }else{
            console.log("passed");
            setCookie("username", username.value, 0.5);
           
        }
    }
}