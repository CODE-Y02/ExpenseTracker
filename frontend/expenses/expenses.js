//global id for editing
let editId = undefined;

// first get data from form
let form = document.getElementById("form");

//on dom loaded
window.addEventListener("DOMContentLoaded", getAll);

//On submit
form.addEventListener("submit", (e) => createOrUpdateExpense(e));

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

document.getElementById("rzp-button1").onclick = async function (e) {
  e.preventDefault();
  try {
    // order Id from backend
    const responseFromServer = await axios.post(
      "http://localhost:3000/payment/create/orderId",
      {
        amount: 500, // pass in rs --> backend will handle rest
      }
    );

    const { orderId, amount, currency } = responseFromServer.data;

    // options
    let options = {
      key: "rzp_test_bnWvn8yH1pEuty", // Enter the Key ID generated from the Dashboard
      amount,
      currency,
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        console.log(response);
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Tony Stark",
        email: "IronMan@A.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        backgroundColor: "#ffadad",
        color: "#1d1828",
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};
