(function () {
    const initNavigation = () => {
        const toggleButton = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.main-nav');

        if (!toggleButton || !nav) {
            return;
        }

        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', String(!isExpanded));
            nav.classList.toggle('is-open');
            toggleButton.classList.toggle('is-active');
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.classList.remove('is-active');
            });
        });
    };

    window.initNavigation = initNavigation;
})();
