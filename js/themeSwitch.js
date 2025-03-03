(function () {
    let lightDark = parseInt(localStorage.getItem('light-dark'));
    if (lightDark) {
        document.body.classList.toggle('light');
        document.body.classList.toggle('dark');
    }
    let toggle = document.querySelector('#theme-toggle');
    toggle.addEventListener('click', e => {
        document.body.classList.toggle('light');
        document.body.classList.toggle('dark');
        if (lightDark) lightDark = 0;
        else lightDark = 1;
        localStorage.setItem('light-dark', lightDark);
    });
})();