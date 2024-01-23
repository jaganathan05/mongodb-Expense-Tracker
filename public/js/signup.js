function signup(event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const signupdata = {
        name,email,password
    }
    
         axios.post('http://localhost:3000/signup',signupdata).then((response)=>{
            alert(response.data.message);
            window.location.href='/login';

         }).catch((err)=>{
            console.log(err);
            })
        

   

}