const serverURL = 'http://localhost:8081';

function gotoPasta(id) {
  window.location.href = './contas.html'
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
      console.log(response);
    })
    .catch(error => {
      console.log(error.response.data.error);
    });
});