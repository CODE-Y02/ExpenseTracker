//global id for editing
let editId = undefined;

// first get data from form
let form = document.getElementById("form");

//on dom loaded
window.addEventListener("DOMContentLoaded", getAll);

//On submit
form.addEventListener("submit", (e) => createOrUpdateExpense(e));

// on buy premium
document.getElementById("buy-premium").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/buyMembership/payment.html";
});

//getAll

async function getAll(event) {
  event.preventDefault();

  try {
    const { token } = JSON.parse(localStorage.getItem("ExpenseTracker"));

    let res = await axios.get(`http://localhost:3000/expense`, {
      headers: {
        Authorization: token,
      },
    });

    console.log(res.data.expenses);

    //disolay all exp
    res.data.expenses.map((expense) => {
      showOnscreen(expense);
    });
  } catch (error) {
    console.log(error);
    shoewError(error.response.data.error);
  }
}

// sendData --> post and put
async function createOrUpdateExpense(e) {
  try {
    e.preventDefault();
    console.log("send data");
    let amount = document.getElementById("amount");
    let description = document.getElementById("description");
    let type = document.getElementById("ExpanaseType");

    const { token } = JSON.parse(localStorage.getItem("ExpenseTracker")); // get token

    let expenseObj = {
      expenseAmount: amount.value,
      description: description.value,
      category: type.value,
    };

    if (editId) {
      // console.log(editId);
      //edit // put request

      await axios.put(`http://localhost:3000/expenses/${editId}`, expenseObj);
      showOnscreen({ ...expenseObj, id: editId });
      editId = undefined;
    } else {
      // try {
      //post
      let response = await axios.post(
        `http://localhost:3000/expense/addExpense`,
        expenseObj,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      //   console.log(response);
      showOnscreen(response.data.expense);
    }
    amount.value = "";
    description.value = "";
    type.value = "other";
  } catch (error) {
    console.log(error);
    shoewError(error.response.data.error);
  }
}

//show on screen
function showOnscreen(obj) {
  //   console.log(obj);
  let ul = document.getElementById("listExpense");
  let newLi = `<li id="${obj.id}">  
  Expense Type : ${obj.category}   Amount : ${obj.expenseAmount}   Description : ${obj.description} <button onclick="editExp('${obj.id}')">Edit</button><button onclick="delExp('${obj.id}')">Delete</button>
  </li>
  `;

  ul.innerHTML = ul.innerHTML + newLi;
}

//remove from screen
function removeFromScreen(id) {
  document.getElementById(id).remove();
}

// DELETE
async function delExp(id) {
  let { token } = JSON.parse(localStorage.getItem("ExpenseTracker")); // get token
  //delete
  try {
    await axios.delete(
      `http://localhost:3000/expense/delete/${id}`,

      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("deleting ");
    removeFromScreen(id);
    alert("Expense Deleted");
  } catch (error) {
    // console.log("delete", error);
    shoewError(error.response.data.error);
  }
}

// EDIT
/*
async function editExp(id) {
  try {
    if (editId) {
      return;
    }

    //get expense
    let expenseObj = await axios.get(`http://localhost:3000/expenses/${id}`);
    console.log(expenseObj);

    //set global edit id
    editId = id;

    //now set data on form
    document.getElementById("amount").value = expenseObj.data.amount;
    document.getElementById("description").value = expenseObj.data.description;
    document.getElementById("ExpanaseType").value = expenseObj.data.type;

    //remove from screen
    removeFromScreen(id);
  } catch (error) {
    console.log("edit function", error);
  }
}
*/

function shoewError(message) {
  let errMsg = document.querySelector(".error-msg ");
  errMsg.classList.remove("hidden");
  errMsg.innerText = message;
  setTimeout(() => {
    errMsg.innerText = "";
    errMsg.classList.add("hidden");
  }, 4000);
}
