const serverURL = 'http://localhost:8081';

function gotoPasta(id) {
  window.location.href = './pasta.html?id='+id;
}

axios.get(`${serverURL}/folders`, {headers: {'Authorization': ('Bearer '+Cookies.get('token'))}})
  .then(response => {
    const pastasDiv = document.getElementById('pastas');
    for (value of response.data) {
      let div = document.createElement('div');
      div.classList.add('pasta');
      div.innerHTML = `<div class="pasta__inner" style="background-color: ${value.folder.color};" onclick="gotoPasta(\'${value._id};\')">
        <span>${value.folder.name}</span>
        <p class="description">${value.folder.description}</p>
        <i class="material-icons">folder</i>
      </div>`;
      pastasDiv.appendChild(div);
    }
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
    md.showNotification('top', 'center', 'danger', 'Erro ao carregar as pastas! Tente novamente mais tarde.');
  })

function pegarDados() {

}

$('#createfolder').click(function() {
  let _folderColor = $('#colorInput').val();
  let _accType = $('#select_balance_type').val();
  let _account = $('#select_account_iqoption').val();
  let _telegram = $('#select_telegram_group').val();
  let _valorDolar = $('#folder_vdolar').val();
  let _valorReal = $('#folder_vreais').val();
  let _folderName = $('#folder_name').val();
  let _folderDescription = $('#folder_description').val();
  let _token = Cookies.get('token');

  axios.post(`${serverURL}/folder`, {
    accType: _accType,
    account: _account,
    telegram: _telegram,
    value: {
      real: _valorReal,
      dolar: _valorDolar
    },
    folder: {
      name: _folderName,
      description: _folderDescription,
      color: _folderColor
    }
  }, {
    headers: {'Authorization': ('Bearer '+_token)}
  })
    .then(response => {
      location.reload();
    })
    .catch(error => {
      console.log(error.response.data.error);
      md.showNotification('top', 'center', 'danger', 'Erro ao criar a pasta! Tente novamente mais tarde.');
    });
});