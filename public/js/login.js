function login(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const logindata={
        email , password
    }
    console.log(logindata)
    axios.post('http://localhost:3000/user/login',logindata).then((Response)=>{
        alert(Response.data.message);
        localStorage.setItem('token',Response.data.token)
        window.location.href='/expenses'
    }).catch((err)=>{
        console.error(err);
    })

}

document.addEventListener('DOMContentLoaded', function() {
    const forgetpswbtn = document.getElementById('forgetpsw');
    const loginform = document.getElementById('loginform');
    const forgetform = document.getElementById('forgetform');
  
    forgetpswbtn.addEventListener('click', () => {
      if (loginform.style.display === 'block') {
        loginform.style.display = 'none';
        forgetform.style.display = 'block';
        forgetpswbtn.textContent='close'
      } else {
        loginform.style.display = 'block';
        forgetform.style.display = 'none';
        forgetpswbtn.textContent='Forget Password'
      }
    });



  });  
  async function forget(event){
    event.preventDefault();
    try{
    const email =  document.getElementById('forgetemail').value; 
    const data={
        email
    }
    const response = await axios.post('http://localhost:3000/password/forgotpassword',data);
    console.log(response);
    window.location.href='/login';}
    catch{}
    
}
const password = document.getElementById('password')
const Showpasswordbtn= document.getElementById('showpassword');
Showpasswordbtn.onclick=()=>{
  if(Showpasswordbtn.checked){
    password.type='text';
  }else{
    password.type='password'
  }
}
