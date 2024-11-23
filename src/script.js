document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const menu = document.getElementById('navbar-sticky');
    const menuIcon = menuButton.querySelector('svg');

    menuButton.addEventListener('click', function() {
        menu.classList.toggle('hidden');
        if (menu.classList.contains('hidden')) {
            menuIcon.setAttribute('viewBox', '0 0 17 14');
            menuIcon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            `
        } else {
            menuIcon.setAttribute('viewBox', '0 0 24 24');
            menuIcon.innerHTML = `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            `;
        }
    });

    emailjs.init("dsuLOXyydWGukQ9sc");

    function sendMail(event) {
        event.preventDefault();
        emailjs.sendForm('service_2snthmg', 'template_bawnm05', '#contactForm')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Pesan berhasil dikirim!');
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.log('FAILED...', error);
                alert('Pesan gagal dikirim, silakan coba lagi.');
            });
    }

    document.getElementById('contactForm').onsubmit = sendMail;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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

    // Video pergantian saat full screen
    const videoElement = document.getElementById('videoElement');
    const alternateVideoSource = './dist/video/fullver.mp4';

    function switchToAlternateVideo() {
        videoElement.pause();
        videoElement.muted = false;
        videoElement.querySelector('source').src = alternateVideoSource;
        videoElement.load();
        videoElement.play();
    }

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement === videoElement) {
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'contain';
            switchToAlternateVideo();
        } else {
            videoElement.style.width = '';
            videoElement.style.height = '';
            videoElement.style.objectFit = '';
            videoElement.pause();
            videoElement.muted = true;
            videoElement.querySelector('source').src = './dist/video/iquarium.mp4';
            videoElement.load();
            videoElement.play();
        }
    });

    videoElement.addEventListener('click', () => {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        }
    });

    // Tambahkan inisialisasi untuk modal produk
    let productSwiper;
    let currentModal = null;

    async function fetchProducts() {
        try {
            const response = await fetch('https://anomalii.my.id/api/fishmart/');
            const data = await response.json();
            console.log('Fetched data:', data); // Debugging
            return data.data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    }

    async function initializeProductSwiper() {
        const products = await fetchProducts();
        const swiperWrapper = document.querySelector('.productSwiper .swiper-wrapper');
        
        if (!swiperWrapper) {
            console.error('Swiper wrapper not found');
            return;
        }
        
        swiperWrapper.innerHTML = '';
        
        products.forEach(product => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="bg-white rounded-lg p-4">
                    <img src="${product.gambar_produk}" alt="${product.nama_produk}" 
                         class="w-full h-64 object-cover rounded-lg mb-4">
                    <h4 class="text-xl font-semibold mb-2">${product.nama_produk}</h4>
                    <p class="text-gray-600 mb-2">${product.deskripsi_produk}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-primary font-bold">${formatPrice(product.harga)}</span>
                        <span class="text-gray-500">Stok: ${product.stok}</span>
                    </div>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Hapus instance Swiper yang ada jika ada
        if (productSwiper && typeof productSwiper.destroy === 'function') {
            productSwiper.destroy(true, true);
        }

        // Inisialisasi Swiper baru
        if (!window.Swiper) {
            console.error('Swiper not loaded');
            return;
        }

        productSwiper = new Swiper('.productSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // Deklarasikan currentModal sebagai variabel global
    window.currentModal = null;

    // Fungsi untuk membuka modal
    window.openProductModal = function() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('hidden');
            window.currentModal = modal; // Gunakan window.currentModal
            initializeProductSwiper();
        }
    };

    // Fungsi untuk menutup modal
    window.closeProductModal = function() {
        if (window.currentModal) { // Gunakan window.currentModal
            window.currentModal.classList.add('hidden');
            window.currentModal = null;
        }
    };

    // Tambahkan modal ke DOM jika belum ada
    if (!document.getElementById('productModal')) {
        const modalHTML = `
            <div id="productModal" class="fixed inset-0 z-50 hidden">
                <div class="absolute inset-0 bg-black bg-opacity-50"></div>
                <div class="relative min-h-screen flex items-center justify-center p-4">
                    <div class="bg-white w-full max-w-4xl rounded-2xl p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-2xl font-bold text-gray-900">Produk Tersedia</h3>
                            <button onclick="closeProductModal()" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="productSwiper overflow-hidden relative">
                            <div class="swiper-wrapper"></div>
                            <div class="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                            <div class="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Event listener untuk menutup modal saat mengklik di luar
    document.addEventListener('click', function(event) {
        if (window.currentModal && event.target === window.currentModal) {
            window.closeProductModal();
        }
    });
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
