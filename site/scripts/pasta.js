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

$('.delete-btn').click(function() {
    swal({
        title: 'Você tem certeza?',
        text: 'A pasta será deletada permanentemente!',
        icon: 'warning',
        //dangerMode: true,
        buttons: [{text: 'deletar', visible: true, value: null}, {text: 'text'}],
    }).then(function() {
        swal(
            'Apagado',
            'A pasta foi apagada com sucesso',
            'success'
        )
    });
});

console.log(getUrlParameter('id'));