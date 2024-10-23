document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;

    // Generate English link (default without the /es prefix)
    const englishLink = currentPath.replace(/^\/es/, '') || '/';

    // Generate Spanish link (with the /es prefix if it's not already there)
    const spanishLink = currentPath.startsWith('/es') ? currentPath : '/es' + currentPath;

    // Update the language switcher links
    document.getElementById('english-link').setAttribute('href', englishLink);
    document.getElementById('spanish-link').setAttribute('href', spanishLink);
});
