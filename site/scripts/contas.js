const serverURL = 'http://localhost:8081';

function insertTable(array, id) {
    table = document.getElementById(id);
    table.innerText = "";
    for (item in array) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let td2 = document.createElement('td');
        td.innerText = array[item]
        td2.innerHTML = `<button class="btn" onclick="desvincular(\'${array[item]}\');" style="font-size: 10px;background-color: #e53935; left: 0.3rem; color: #fff"><span>Desvincular</span></button>`
        tr.appendChild(td)
        tr.appendChild(td2);
        table.appendChild(tr);
    }
}

axios.get(`${serverURL}/vincEmail`, {headers: {'Authorization': ('Bearer '+Cookies.get('token'))}})
    .then(response => {
        insertTable(response.data.emails, 'iqtbody');
    }).catch(error => {
        console.log(error);
});

axios.get(`${serverURL}/vincTelegram`, {headers: {'Authorization': ('Bearer '+Cookies.get('token'))}})
    .then(response => {
        insertTable([response.data.number], 'tltbody');
    }).catch(error => {
        console.log(error);
});

function ClickDownAnimation(element) {
    item = document.getElementById(element);
    item.style.animation = 'downShow 1s ease';
    item.classList.add('show');
    setTimeout(() => item.style.animation = '', 1000);
}

function desvincular(email) {
    console.log(email);
};

$('form[for=iq]').submit(function(e) {
    e.preventDefault();
    let _email = $('.iqemail').val();
    let _password = $('.iqpassword').val();
    let _token = Cookies.get('token');
    if (_email != '' && _password != ''){
        md.showNotification('top', 'center', 'warning', 'Verificando a conta...');
        axios.post(`${serverURL}/vincEmail`, {email: _email, password: _password, token: _token}, {headers: {'Authorization': ('Bearer '+_token)}})
            .then(response => {
                switch (response.data.status.trim()) {
                    case 'ok':
                        md.showNotification('top', 'center', 'success', 'Conta vinculada com sucesso');
                        $('.iqemail').val('');
                        $('.iqpassword').val('');
                        break
                    case 'password':
                        md.showNotification('top', 'center', 'danger', 'Erro ao vincular a conta. Email ou senha incorreto!');
                        break
                    case 'exists':
                        md.showNotification('top', 'center', 'danger', 'Conta já vinculada, tente novamente com outra conta!');
                        break
                    default:
                        md.showNotification('top','center', 'danger', 'Erro ao vincular a conta. Tente novamente mais tarde!');
                        break
                }
                if (response.data.emails) 
                    insertTable(response.data.emails, 'iqtbody');
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    } else {
        md.showNotification('top', 'center', 'danger', 'Os campos não podem estar vazios!');
    }
});

$('form[for=tl]').submit(function(e) {
    e.preventDefault();
    let _number = $('.tlNumber').val();
    let _token = Cookies.get('token');
    axios.post(`${serverURL}/vincTelegram`, {number: _number}, {headers: {'Authorization': ('Bearer '+_token)}})
        .then(response => {
            if(response.data.number){
                $('.tlNumber').val('');
                insertTable([response.data.number], 'tltbody');
            }
        });
})
