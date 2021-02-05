// $('#logoutButton').on('click', function(event) {
//     event.preventDefault();
//     localStorage.clear();
//     window.location.replace('/home.html');
// });

// logout
$('#logoutButton').on('click', function (event) {
    event.preventDefault();
    const baseUrl = 'https://50.17.117.171:5000';
    let token = localStorage.getItem('token');
    axios({
        method: 'post',
        url: baseUrl + '/api/user/logout',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            "Authorization": "Bearer " + token
        }
    })
    .then(function (response) {
        console.log(response)
        localStorage.clear();
        window.location.replace('/home.html');
    })
    .catch(function (response) {
        console.log(response)
        new Noty({
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            timeout: '6000',
            text: 'Error logging out. Please Try Again!',
        }).show();

    });

})
