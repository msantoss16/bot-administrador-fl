const serverURL = 'http://localhost:8081';
function ClickDownAnimation(element) {
    item = document.getElementById(element);
    item.style.animation = 'downShow 1s ease';
    item.classList.add('show');
    setTimeout(() => item.style.animation = '', 1000);
}

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

$('form[for=iq]').submit(function(e) {
    e.preventDefault();
    let _email = $('.iqemail').val();
    let _password = $('.iqpassword').val();
});

$('form[for=tl]').submit(function(e) {
    e.preventDefault();
    let _number = $('.tlNumber').val();
    console.log(_number);
})