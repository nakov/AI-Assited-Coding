const loadPartial = async (el) => {
    const path = el.getAttribute('data-include');

    if (!path) {
        return;
    }

    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Неуспешно зареждане на ${path}`);
        }

        const markup = await response.text();
        el.innerHTML = markup;
    } catch (error) {
        console.error(error);
        el.innerHTML = '<p class="include-error">Секцията не може да бъде заредена.</p>';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const includeTargets = document.querySelectorAll('[data-include]');

    await Promise.all(Array.from(includeTargets).map(loadPartial));

    if (typeof window.initNavigation === 'function') {
        window.initNavigation();
    }
});
