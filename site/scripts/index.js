const serverURL = 'http://localhost:8081';


if (Cookies.get('token')){
    window.location.replace("pages/dashboard.html");
} 


function mostrarDiv(id, id2) {
    document.getElementById(id2).style.display = "none";
    document.getElementById(id).style.display = "flex";
};

function setDiv(register) {
    if(register){
        document.querySelector('#loginNav').classList.remove('active');
        document.querySelector('#registerNav').classList.remove('active');
        document.querySelector('#registerNav').classList.add('active');
        mostrarDiv('register', 'login');
    } else {
        document.querySelector('#loginNav').classList.remove('active');
        document.querySelector('#registerNav').classList.remove('active');
        document.querySelector('#loginNav').classList.add('active');
        mostrarDiv('login', 'register');
    }
};

$('#btncad').click(function(){
    let _email = $('.nregis').val();
    let _password = $('.pregis').val();
    if (_password == $('.pcregis').val()){
        axios.post(`${serverURL}/register`, {email: _email, password: _password})
            .then(response => {
                let token = response.data.token;
                console.log(token);
                Cookies.set('token', token, { expires: 1 });
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    } else {
        console.log('Senhas não são iguais.')
    };
});

$('#btnlogin').click(function(){
    let _email = $('.nlogin').val();
    let _password = $('.plogin').val();
    axios.post(`${serverURL}/authenticate`, {email: _email, password: _password})
        .then(response => {
            let token = response.data.token;
            Cookies.set('token', token, {expires: 1});
            location.reload()
        })
        .catch(error => {
            //console.log(error.response.data.error);
        })
});
