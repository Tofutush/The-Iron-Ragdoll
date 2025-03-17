(function () {
    let lightDark = parseInt(localStorage.getItem('light-dark'));
    if (lightDark === 0) document.body.className = 'dark';
    else document.body.className = 'light';
    let toggle = document.querySelector('.theme-toggle');
    toggle.addEventListener('click', e => {
        if (lightDark === 0) {
            lightDark = 1;
            document.body.className = 'light';
        }
        else {
            lightDark = 0;
            document.body.className = 'dark';
        }
        localStorage.setItem('light-dark', lightDark);
    });
})();