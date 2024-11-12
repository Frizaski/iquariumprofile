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

    // Inisialisasi EmailJS
    emailjs.init("dsuLOXyydWGukQ9sc");

    // Fungsi untuk mengirim email
    function sendMail(event) {
        event.preventDefault(); // Mencegah form dari reload halaman

        emailjs.sendForm('service_2snthmg', 'template_bawnm05', '#contactForm')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Pesan berhasil dikirim!');
                
                // Mengosongkan formulir
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.log('FAILED...', error);
                alert('Pesan gagal dikirim, silakan coba lagi.');
            });
    }

    // Pastikan form memanggil fungsi sendMail
    document.getElementById('contactForm').onsubmit = sendMail;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Swiper initialization
    var swiper = new Swiper(".mySwiper", {
        loop: true,
        spaceBetween: -10,
        slidesPerView: 3,
        watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".mySwiper2", {
        loop: true,
        spaceBetween: 32,
        thumbs: {
            swiper: swiper,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    var teamSwiper = new Swiper(".teamswiper", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        speed: 800,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });

    fetchFeedbacks();
});

async function fetchFeedbacks() {
    try {
        const response = await fetch('http://localhost:8000/api/feedback');
        const result = await response.json();
        
        if (result.success) {
            updateTestimonialSlides(result.data);
        }
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
    }
}

function updateTestimonialSlides(feedbacks) {
    const swiperWrapper = document.getElementById('testimonialWrapper');
    swiperWrapper.innerHTML = '';

    feedbacks.forEach(feedback => {
        const slide = `
            <div class="swiper-slide">
                <div class="flex justify-center">
                    <div class="block max-w-sm rounded-xl bg-white shadow-lg transform hover:scale-105 transition duration-300">
                        <div class="bg-indigo-500 text-white p-6 rounded-t-xl text-center">
                            <h4 class="text-lg font-semibold">${feedback.user.name}</h4>
                            <p class="text-sm opacity-80">Pengguna iQuarium</p>
                        </div>
                        <div class="p-8 text-center">
                            <p class="text-gray-700">
                                ${feedback.komentar}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        swiperWrapper.innerHTML += slide;
    });

    // Reinisialisasi Swiper
    var testimonialSwiper = new Swiper(".testimonial-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
}



