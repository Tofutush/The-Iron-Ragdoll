(function () {
    let lightDark = parseInt(localStorage.getItem('light-dark'));
    if (lightDark === 0) document.body.className = 'light';
    else document.body.className = 'dark';
    let toggle = document.querySelector('.theme-toggle');
    toggle.addEventListener('click', e => {
        if (lightDark === 0) {
            lightDark = 1;
            document.body.className = 'dark';
        }
        else {
            lightDark = 0;
            document.body.className = 'light';
        }
        localStorage.setItem('light-dark', lightDark);
    });
})();