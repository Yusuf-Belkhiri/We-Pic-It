// AUTH : SIGN UP
const emailInput = document.querySelector("#email_input").value;
const firstNameInput = document.querySelector("#firstname_input").value;   
const lastNameInput = document.querySelector("#lastname_input").value;   
const passwordInput = document.querySelector("#password_input").value;   
const confirmPasswordInput = document.querySelector("#confirm_password_input").value;  

const signUpErrorText = document.querySelector(".sign_up_error_text");   
const signUpButton = document.querySelector(".sign_up_button");

// Profile Page
const profilePageText = document.querySelector("profile_page_button");   



const signUp = async() => {
    if(passwordInput != confirmPasswordInput){      // Password Validation
        signUpErrorText.hidden = false;
        return;
    }
//http://127.0.0.1:5000
    const { data } = await axios.post('http://localhost:5000/users', {
        emailInput,
        passwordInput,
        firstNameInput,
        lastNameInput,
    }) 
    .then(function (response) {
        console.log(response);
      })
      
    if(data < 0){
        signUpErrorText.hidden = false;
    }

    // axios({
    //     method: 'post',
    //     url: 'http://localhost:7474/user',
    //     data: {
    //       'statements' : [{
    //         'statement' : 'MATCH (n:$term) RETURN n LIMIT 25',
    //         'parameters' : {
    //           'term' : 'USER'
    //         }
    //       }]
    //     }
    //   }).then(function(response){
    //     console.log(response);
    //   });
}

signUpButton.onclick = signUp;