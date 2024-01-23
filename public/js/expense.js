 async function CreateExpense(event){
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const catagory = document.getElementById('catagory').value;
    console.log(amount,description,catagory);

    const expense_data ={
        amount,description,catagory
    }
    console.log(expense_data)
    const token = localStorage.getItem('token'); 
    try{
        const response =await axios.post('http://localhost:3000/expenses',expense_data,{
                headers: { Authorization: token}})
            console.log(response);
            if(response){
              window.location.href="/expenses"
            }
            
    }
    catch(err){
        console.log(err);
    }
            
            
            
}


window.addEventListener("DOMContentLoaded", async () => {
  try {
    const page = 1;  // Set the initial page
    const Downloadbtn = document.getElementById('downloaddata');
    const token = localStorage.getItem('token'); 
    const Premium_user = document.getElementById('premiumsuccessful');
    const premium_btn = document.getElementById('razorpay');
    const Leaderboardbtn = document.getElementById('leaderboardbtn');
    const RowsperPage = localStorage.getItem('RowsperPage');
    let Rows = 10;
    if(RowsperPage){
      SelectRows.value=RowsperPage
       Rows = Number(RowsperPage);
    }
    // Use the page parameter in the request URL
    const response = await axios.get(`http://localhost:3000/expense?page=${page}&Rows=${Rows}` ,{
      headers: { Authorization: token} ,data:{Rows}
    }); 

    console.log(response.data.message);
    var premium_user_check = response.data.message;
    
    if (premium_user_check === "SUCCESSFULL") {
      Premium_user.style.display = 'block';
      premium_btn.style.display = 'none';
      Leaderboardbtn.style.display = 'block';
      Downloadbtn.style.display = 'block';
    }
    console.log(response.data.pagination_data)

    showpagination(response.data.pagination_data);  // Pass the response data to showpagination
    for (let i = 0; i < response.data.result.length; i++) {
      showUserDetails(response.data.result[i]);
    }
  } catch (error) {
    console.error(error);
  }
});

function showUserDetails(expenses) {
  const expenseTableBody = document.getElementById('expenseTableBody');

  var userDetailsContainer = document.createElement('tr');
  userDetailsContainer.innerHTML = `
    <td>${expenses.amount}</td>
    <td>${expenses.description}</td>
    <td>${expenses.catagory}</td>
    <td>
      <button id="expensedelete" class="btn btn-danger btn-sm" type="submit">Delete</button>
    </td>`;

  userDetailsContainer.querySelector("#expensedelete").onclick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/expenses/${expenses._id}`, {
        headers: {
          Authorization: token
        }
      });
      alert(response.data.message);
      window.location.href = '/expenses';
    } catch (err) {
      console.log(err);
    }
  };

  expenseTableBody.appendChild(userDetailsContainer);
}



const Premium_user = document.getElementById('premiumsuccessful');
const premium_btn = document.getElementById('razorpay');
const Leaderboardbtn = document.getElementById('leaderboardbtn');
const Downloadbtn = document.getElementById('downloaddata');
premium_btn.onclick=async(e)=>{
  const token = localStorage.getItem('token');
  const response= await axios.get('http://localhost:3000/purchase/premium_membership',{ headers: { Authorization: token } })

  var options = {
    key: response.data.key_id,
    order_id: response.data.order_id,

    handler: async function (response) {
      console.log('Payment success. Payment ID:', response.razorpay_payment_id);
      try {
        await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }, {
          headers: {
            "Authorization": token
          }
        });
        console.log('Payment status updated.');
        premium_btn.style.display='none';
        Premium_user.style.display='block';
        Leaderboardbtn.style.display='block';
        Downloadbtn.style.display='block';

        alert('You are a Premium User Now ');
      } catch (error) {
        console.error('Payment status update failed:', error);
        alert("Something went Wrong");
      }
    }
    
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("Payment Failed", function (response) {
    console.log(response);
    alert("Something went Wrong");
  });

}

Leaderboardbtn.onclick = async (e) => {
  try {
    if (Leaderboardbtn.textContent === 'Show Leaderboard') {
      const response = await axios.get('http://localhost:3000/premium/leaderboard');
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        showUserLeaderboard(response.data[i]);
      }
      Leaderboardbtn.textContent = "Close LeaderBoard";
    } else if (Leaderboardbtn.textContent === "Close LeaderBoard") {
      const Leaderboard = document.querySelector('.leaderboard');
      Leaderboard.innerHTML = ``;  // Corrected the variable name here
      Leaderboardbtn.textContent = "Show Leaderboard";
    }
  } catch (err) {
    console.log(err);
  }
}

function showUserLeaderboard(result) {
  const Leaderboard = document.querySelector('.leaderboard');
  Leaderboard.style.display = 'block';
  const leaderboardDetails = document.createElement('div');
  leaderboardDetails.innerHTML = `Name: ${result.name} - Total Amount: ${result.Total_Amount}`;
  Leaderboard.appendChild(leaderboardDetails);
}



Downloadbtn.onclick=async()=>{ 
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/download/expenses',{ headers: { Authorization: token }})
    try{
      if(response.status === 200){
        var a = document.createElement('a');
        a.href= response.data.fileurl;
        a.download = 'myexpense.csv';
        a.click();
      }
    }
    catch(err){
      console.log(err)
    }
  
  
}

function showpagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  PreviousPage,
  lastPage
}) {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  if (hasPreviousPage) {
    const btn2 = document.createElement('button');
    btn2.innerHTML = PreviousPage;
    btn2.addEventListener('click', () => getExpenses(PreviousPage));
    pagination.appendChild(btn2);
  }

  const btn1 = document.createElement('button');
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener('click', () => getExpenses(currentPage));
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement('button');
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click', () => getExpenses(nextPage));
    pagination.appendChild(btn3);
  }
}

async function getExpenses(pageNo) {
  try {
    const page = pageNo;
    const Downloadbtn = document.getElementById('downloaddata');
    const token = localStorage.getItem('token');
    const Premium_user = document.getElementById('premiumsuccessful');
    const premium_btn = document.getElementById('razorpay');
    const Leaderboardbtn = document.getElementById('leaderboardbtn');

    // Use the page parameter in the request URL
    const response = await axios.get(`http://localhost:3000/expense?page=${pageNo}`, {
      headers: { Authorization: token }
    });

    console.log(response.data.message);
    var premium_user_check = response.data.message;

    if (premium_user_check === "SUCCESSFULL") {
      Premium_user.style.display = 'block';
      premium_btn.style.display = 'none';
      Leaderboardbtn.style.display = 'block';
      Downloadbtn.style.display = 'block';
    }
    console.log(response.data.pagination_data);

    showpagination(response.data.pagination_data); 
    const expenseTableBody = document.getElementById('expenseTableBody');
    expenseTableBody.innerHTML = ''; 

    for (let i = 0; i < response.data.result.length; i++) {
      showUserDetails(response.data.result[i], expenseTableBody);
    }
  } catch (error) {
    console.error(error);
  }
}

const SelectRows = document.getElementById('rowsperpage');
SelectRows.onchange=async()=>{
  localStorage.setItem('RowsperPage',SelectRows.value);
  window.location.href='/expenses'
}
