document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const menu = document.getElementById('navbar-sticky');
    const menuIcon = menuButton.querySelector('svg');

    menuButton.addEventListener('click', function() {
        // Toggle menu visibility
        menu.classList.toggle('hidden');

        // Toggle button icon
        if (menu.classList.contains('hidden')) {
            menuIcon.setAttribute('viewBox', '0 0 17 14');
            menuIcon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            `;
        } else {
            menuIcon.setAttribute('viewBox', '0 0 24 24');
            menuIcon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            `;
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form'); // Pastikan ini adalah form yang benar

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form dari reload halaman

            emailjs.sendForm('service_2snthmg', 'template_bawnm05', this)
              .then((result) => {
                alert('Email berhasil dikirim!');
              }, (error) => {
                alert('Gagal mengirim email, coba lagi.');
              });
        });
    });
}); 