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
}