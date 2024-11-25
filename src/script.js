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
            console.log('Fetched data:', data);
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

    async function initializeProductSwiper(category = 'all') {
        try {
            const products = await fetchProducts();
            const swiperWrapper = document.querySelector('.productSwiper .swiper-wrapper');
            
            if (!swiperWrapper) {
                console.error('Swiper wrapper not found');
                return;
            }
            
            swiperWrapper.innerHTML = '';
            
            if (!products || products.length === 0) {
                swiperWrapper.innerHTML = '<div class="text-center p-4">Tidak ada produk tersedia</div>';
                return;
            }

            const filteredProducts = category === 'all' ? products : products.filter(p => 
                p.kategori.toLowerCase().includes(category.toLowerCase())
            );

            if (filteredProducts.length === 0) {
                swiperWrapper.innerHTML = '<div class="text-center p-4">Tidak ada produk untuk kategori ini</div>';
                return;
            }

            filteredProducts.forEach(product => {
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

            if (productSwiper && typeof productSwiper.destroy === 'function') {
                productSwiper.destroy(true, true);
            }

            productSwiper = new Swiper('.productSwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
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
        } catch (error) {
            console.error('Error initializing swiper:', error);
        }
    }

    // Fungsi untuk membuka modal
    window.openProductModal = function(category = 'all', event) {
        if (event) {
            event.preventDefault();
        }

        fetch('modal.html')
            .then(response => response.text())
            .then(html => {
                if (!document.getElementById('modalContainer')) {
                    const container = document.createElement('div');
                    container.id = 'modalContainer';
                    document.body.appendChild(container);
                }
                
                document.getElementById('modalContainer').innerHTML = html;
                const modal = document.getElementById('productModal');
                
                if (modal) {
                    modal.classList.remove('hidden');
                    window.currentModal = modal;
                    initializeProductSwiper(category);
                }
            })
            .catch(error => {
                console.error('Error loading modal:', error);
                // Fallback jika modal.html tidak dapat dimuat
                const modalHTML = `
                    <div id="productModal" class="fixed inset-0 z-[60]">
                        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
                        <div class="relative min-h-screen flex items-center justify-center p-4">
                            <div class="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 relative">
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
                                    <div class="swiper-pagination"></div>
                                    <div class="swiper-button-next !text-primary"></div>
                                    <div class="swiper-button-prev !text-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('modalContainer').innerHTML = modalHTML;
                const modal = document.getElementById('productModal');
                if (modal) {
                    modal.classList.remove('hidden');
                    window.currentModal = modal;
                    initializeProductSwiper(category);
                }
            });
    };

    // Fungsi untuk menutup modal
    window.closeProductModal = function() {
        if (window.currentModal) {
            window.currentModal.classList.add('hidden');
            window.currentModal = null;
        }
    };

    // Event listener untuk menutup modal saat mengklik di luar
    document.addEventListener('click', function(event) {
        if (window.currentModal && event.target === window.currentModal) {
            window.closeProductModal();
        }
    });

    let fishpediaSwiper;

    async function fetchFishpedia() {
        try {
            const response = await fetch('https://anomalii.my.id/api/fishpedia');
            const data = await response.json();
            console.log('Fetched fishpedia data:', data);
            return data.data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async function initializeFishpediaSwiper(category = 'all') {
        try {
            const fishes = await fetchFishpedia();
            const swiperWrapper = document.querySelector('.fishpediaSwiper .swiper-wrapper');
            
            if (!swiperWrapper) {
                console.error('Swiper wrapper not found');
                return;
            }
            
            swiperWrapper.innerHTML = '';
            
            if (!fishes || fishes.length === 0) {
                swiperWrapper.innerHTML = '<div class="text-center p-4">Tidak ada data ikan tersedia</div>';
                return;
            }

            const filteredFishes = category === 'all' ? fishes : fishes.filter(f => 
                f.kategori.toLowerCase().includes(category.toLowerCase())
            );

            if (filteredFishes.length === 0) {
                swiperWrapper.innerHTML = '<div class="text-center p-4">Tidak ada ikan untuk kategori ini</div>';
                return;
            }

            filteredFishes.forEach(fish => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="bg-white rounded-lg p-4">
                        <img src="https://anomalii.my.id/storage/${fish.gambar_ikan}" alt="${fish.nama}" 
                             class="w-full h-64 object-cover rounded-lg mb-4">
                        <h4 class="text-xl font-semibold mb-2">${fish.nama}</h4>
                        <p class="text-gray-600 mb-2"><i>Nama Ilmiah:</i> ${fish.nama_ilmiah}</p>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="font-semibold">Kategori:</p>
                                <p class="text-gray-600">${fish.kategori}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Asal:</p>
                                <p class="text-gray-600">${fish.asal}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Ukuran:</p>
                                <p class="text-gray-600">${fish.ukuran}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Suhu Ideal:</p>
                                <p class="text-gray-600">${fish.suhu_ideal}°C</p>
                            </div>
                        </div>
                        <div class="border-t pt-4">
                            <p class="font-semibold">Karakteristik:</p>
                            <p class="text-gray-600">${fish.karakteristik}</p>
                        </div>
                    </div>
                `;
                swiperWrapper.appendChild(slide);
            });

            if (fishpediaSwiper && typeof fishpediaSwiper.destroy === 'function') {
                fishpediaSwiper.destroy(true, true);
            }

            fishpediaSwiper = new Swiper('.fishpediaSwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });

        } catch (error) {
            console.error('Error initializing fishpedia swiper:', error);
        }
    }

    window.openFishpediaModal = function(category = 'all', event) {
        if (event) {
            event.preventDefault();
        }

        fetch('modal.html')
            .then(response => response.text())
            .then(html => {
                if (!document.getElementById('modalContainer')) {
                    const container = document.createElement('div');
                    container.id = 'modalContainer';
                    document.body.appendChild(container);
                }
                
                document.getElementById('modalContainer').innerHTML = html;
                const modal = document.getElementById('fishpediaModal');
                
                if (modal) {
                    modal.classList.remove('hidden');
                    window.currentModal = modal;
                    initializeFishpediaSwiper(category);
                }
            })
            .catch(error => console.error('Error loading modal:', error));
    };

    window.closeFishpediaModal = function() {
        if (window.currentModal) {
            window.currentModal.classList.add('hidden');
            window.currentModal = null;
        }
    };

    let pelatihanSwiper;

    async function fetchPelatihan() {
        try {
            const response = await fetch('https://anomalii.my.id/api/pelatihan');
            const data = await response.json();
            console.log('Fetched pelatihan data:', data);
            return data.data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async function initializePelatihanSwiper(category = 'all') {
        try {
            const pelatihan = await fetchPelatihan();
            const swiperWrapper = document.querySelector('.pelatihanSwiper .swiper-wrapper');
            
            if (!swiperWrapper) {
                console.error('Swiper wrapper not found');
                return;
            }
            
            swiperWrapper.innerHTML = '';
            
            if (!pelatihan || pelatihan.length === 0) {
                swiperWrapper.innerHTML = '<div class="text-center p-4">Tidak ada pelatihan tersedia</div>';
                return;
            }

            pelatihan.forEach(course => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="bg-white rounded-lg p-4">
                        <img src="https://anomalii.my.id/storage/${course.gambar_pelatihan}" alt="${course.judul}" 
                             class="w-full h-64 object-cover rounded-lg mb-4">
                        <h4 class="text-xl font-semibold mb-2">${course.judul}</h4>
                        <p class="text-gray-600 mb-4">${course.deskripsi_pelatihan}</p>
                        <div class="border-t pt-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-primary font-bold">${formatPrice(course.harga)}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">Instruktur:</span>
                                <span class="text-sm font-medium">${course.user.nama}</span>
                            </div>
                        </div>
                    </div>
                `;
                swiperWrapper.appendChild(slide);
            });

            if (pelatihanSwiper && typeof pelatihanSwiper.destroy === 'function') {
                pelatihanSwiper.destroy(true, true);
            }

            pelatihanSwiper = new Swiper('.pelatihanSwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
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
        } catch (error) {
            console.error('Error initializing pelatihan swiper:', error);
        }
    }

    window.openPelatihanModal = function(category = 'all', event) {
        if (event) {
            event.preventDefault();
        }

        fetch('modal.html')
            .then(response => response.text())
            .then(html => {
                if (!document.getElementById('modalContainer')) {
                    const container = document.createElement('div');
                    container.id = 'modalContainer';
                    document.body.appendChild(container);
                }
                
                document.getElementById('modalContainer').innerHTML = html;
                const modal = document.getElementById('pelatihanModal');
                
                if (modal) {
                    modal.classList.remove('hidden');
                    window.currentModal = modal;
                    initializePelatihanSwiper(category);
                }
            })
            .catch(error => console.error('Error loading modal:', error));
    };

    window.closePelatihanModal = function() {
        if (window.currentModal) {
            window.currentModal.classList.add('hidden');
            window.currentModal = null;
        }
    };
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
