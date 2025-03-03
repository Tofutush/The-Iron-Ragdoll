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
        if (lightDark) localStorage.setItem('light-dark', 0);
        else localStorage.setItem('light-dark', 1);
        lightDark = parseInt(localStorage.getItem('light-dark'));
    });
})();