if (!Cookies.get('token')){
    window.location.replace("../index.html");
}

function inserirTable(array, id){
    table = document.getElementById(id);
    table.innerText = "";
    for (item in array) {
        date = new Date(array[item].configsSignal.horario)
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        td1.innerText = array[item].configsSignal.sinal;
        td2.innerText = array[item].configsSignal.paridade;
        td3.innerText = array[item].configsFolder.valor / 100;
        td4.innerText = array[item].configsFolder.win;
        //td4.innerText = array[item].configsFolder.status;
        td5.innerText = date.toString();
        if (array[item].configsFolder.status == 0) {
            td6.innerText = 'Agendado';
        } else if (array[item].configsFolder.status == 1) {
            td6.innerText = 'Em andamento';
        } else if (array[item].configsFolder.status == 2) {
            td6.innerText = 'Concluido';
        } else {
            td6.innerText = 'Error'
        }
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        table.appendChild(tr);
    }
};

const serverURL = 'http://localhost:8081';
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

axios.post(`${serverURL}/folder/dados`, {folderId: getUrlParameter('id')}, {headers: {'Authorization': ('Bearer '+Cookies.get('token'))}})
    .then(response => {
        data = response.data;
        inserirTable(data.data.folders[0].sinaisid, 'historicoP');
        
    }).catch(error => {
        console.log(error);
});

$('.delete-btn').click(function() {
    swal({
        title: 'Você tem certeza?',
        text: 'A pasta será deletada permanentemente!',
        icon: 'warning',
        //dangerMode: true,
        buttons: [{text: 'Deletar', visible: true, value: null}, {text: 'Cancelar'}],
    }).then(function() {
        swal(
            'Apagado',
            'A pasta foi apagada com sucesso',
            'success'
        )
    });
});

//console.log(getUrlParameter('id'));