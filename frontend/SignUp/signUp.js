const API_KEY = "a5c0008c4f5145368f69bd74b7c202dd";

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  let newUser = {
    userName: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  userSignUp(newUser);

  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
});

async function userSignUp(userObj) {
  try {
    await axios.post(
      `https://crudcrud.com/api/${API_KEY}/user
        `,
      userObj
    );
  } catch (error) {
    console.log(error);
    let msg = document.querySelector("#form .error-message");
    msg.classList.remove("hidden");
    msg.innerText = error.message;
    setTimeout(() => {
      msg.innerText = "";
      msg.classList.add("hidden");
    }, 3000);
  }
}
