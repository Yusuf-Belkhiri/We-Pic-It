const emailInput = document.querySelector("#email_input").value;
const passwordInput = document.querySelector("#password_input").value;   
const signInButton = document.querySelector("#sign_in_button");

const signIn = async() => {
    console.log("Hh")
    const { data } = await axios.get('http://127.0.0.1:5000/users', {
        emailInput,
        passwordInput,
    }) 
}

signInButton.addEventListener("click", signIn)