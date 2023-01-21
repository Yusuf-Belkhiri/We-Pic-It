const userName = document.querySelector(".name").value;
const imageUrl = document.querySelector(".MyImage").src;

const postsNumber = document.querySelector(".posts").value;
const followersNumber = document.querySelector(".followers").value;
const followingsNumber = document.querySelector(".followings").value;

loadProfile();

const loadProfile = async() => {
    const idUser = localStorage.getItem("idUser");

    const { data1 } = await axios.get('http://127.0.0.1:5000/users/userprofileinfo', {
        idUser
    })
    const { data2 } = await axios.post('http://127.0.0.1:5000/users/userposts', {
        idUser
    })
}
