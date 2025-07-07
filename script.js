 // Sample images data
        const sampleImages = [
            { src: 'images/mountains-lake_1398-1153.webp', category: 'Nature', title: 'Mountain Landscape' },
            { src: 'images/sketch-drafting-modern-cozy-house-becoming-real-3d-illustration_146508-366.webp', category: 'Architecture', title: 'Modern Building' },
            { src: 'images/HD-wallpaper-anime-solo-leveling-sung-jin-woo-thumbnail.webp', category: 'Anime', title: 'Sung Jin woo'},
            { src: './images/182600.webp', category: 'Animals', title: 'cute cat' },
            { src: 'images/scenic-view-landscape-against-sky-sunset_1048944-20504572.webp', category: 'Nature', title: 'Sunset View' },
            { src: 'images/pexels-photo-262347.webp', category: 'Architecture', title: 'Urban Design' }
        ];

        let currentImages = [...sampleImages];
        let uploadedImages = [];
        let currentFilter = 'all';
        let currentLightboxIndex = 0;
        let filteredImages = [];

        // Initialize gallery
        function initGallery() {
            renderGallery();
            setupEventListeners();
        }

        // Render gallery
        function renderGallery() {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            filteredImages = currentFilter === 'all' 
                ? [...currentImages, ...uploadedImages] 
                : [...currentImages, ...uploadedImages].filter(img => img.category === currentFilter);

            filteredImages.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                    <div class="category-tag">${image.category}</div>
                    <div class="overlay">
                        <h3>${image.title}</h3>
                        <p>Category: ${image.category}</p>
                    </div>
                `;
                item.addEventListener('click', () => openLightbox(index));
                gallery.appendChild(item);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentFilter = e.target.dataset.filter;
                    renderGallery();
                });
            });

            // Image upload
            document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

            // Lightbox controls
            document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
            document.getElementById('lightboxPrev').addEventListener('click', showPreviousImage);
            document.getElementById('lightboxNext').addEventListener('click', showNextImage);

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (document.getElementById('lightbox').classList.contains('active')) {
                    if (e.key === 'ArrowLeft') showPreviousImage();
                    if (e.key === 'ArrowRight') showNextImage();
                    if (e.key === 'Escape') closeLightbox();
                }
            });

            // Lightbox background click
            document.getElementById('lightbox').addEventListener('click', (e) => {
                if (e.target.id === 'lightbox') closeLightbox();
            });
        }

        // Handle image upload
        function handleImageUpload(e) {
            const files = Array.from(e.target.files);
            const category = document.getElementById('categorySelect').value;

            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const newImage = {
                            src: e.target.result,
                            category: category,
                            title: file.name.split('.')[0],
                            uploaded: true
                        };
                        uploadedImages.push(newImage);
                        renderGallery();
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Clear input
            e.target.value = '';
        }

        // Lightbox functions
        function openLightbox(index) {
            currentLightboxIndex = index;
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightboxImg');
            
            img.src = filteredImages[index].src;
            img.alt = filteredImages[index].title;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function showPreviousImage() {
            currentLightboxIndex = currentLightboxIndex > 0 
                ? currentLightboxIndex - 1 
                : filteredImages.length - 1;
            
            const img = document.getElementById('lightboxImg');
            img.src = filteredImages[currentLightboxIndex].src;
            img.alt = filteredImages[currentLightboxIndex].title;
        }

        function showNextImage() {
            currentLightboxIndex = currentLightboxIndex < filteredImages.length - 1 
                ? currentLightboxIndex + 1 
                : 0;
            
            const img = document.getElementById('lightboxImg');
            img.src = filteredImages[currentLightboxIndex].src;
            img.alt = filteredImages[currentLightboxIndex].title;
        }

        // Mobile navigation functions
        function showPrevious() {
            if (filteredImages.length > 0) {
                const firstVisible = document.querySelector('.gallery-item');
                if (firstVisible) {
                    firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }

        function showNext() {
            if (filteredImages.length > 0) {
                const lastVisible = document.querySelector('.gallery-item:last-child');
                if (lastVisible) {
                    lastVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }

        function filterImages(category) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                }
            });
            currentFilter = category;
            renderGallery();
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', initGallery);
  