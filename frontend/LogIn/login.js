document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  userLogin(user);

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
});

async function userLogin(userObj) {
  try {
    let res = await axios.post("http://localhost:3000/user/signin/", userObj);
    // console.log(res);

    alert(res.data.message);
  } catch (error) {
    // console.log(error.response.data);
    let msg = document.querySelector("#form .error-message");
    msg.classList.remove("hidden");
    msg.innerText = error.response.data.error;
    setTimeout(() => {
      msg.innerText = "";
      msg.classList.add("hidden");
    }, 4000);
  }
}