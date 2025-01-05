window.addEventListener("DOMContentLoaded", function (){

 let loginButton = document.getElementById("login-button")
    
    loginButton.addEventListener("click", async function (event){
        event.preventDefault()
        let userEmail = document.getElementById("email").value;
        let userPassword = document.getElementById("password").value;
   
        if (userEmail === "" || userPassword === ""){
            return alert("Veuillez remplir tous les champs")
        }

        try{
            let loginResponse = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword,
                }),
                headers: {
                    "Content-type": "application/json"
                }
            })
            
            if(loginResponse.ok){
                let loginData= await loginResponse.json();
                console.log(loginData)
                localStorage.setItem("token", loginData.token)
                window.location.href = "index.html"
            }else{
                alert("Les identifiants renseignés sont incorrects")
            }

            
        }catch (error){
            console.error(error)
            alert("Les identifiants renseignés sont incorrects")
        }

        
    })
    
    
})
