/* Interactive behavior for gallery.html. */

const slides = [
        { src: 'images/events/event1.jpg', lo: 'ບັນຍາກາດກິດຈະກຳຂອງວັດ 1', th: 'บรรยากาศกิจกรรมของวัด 1', en: 'Temple activities 1', loDesc: 'ຮູບພາບຈາກກິດຈະກຳ ແລະ ງານບຸນຂອງວັດເຊກະໝານກາງ', thDesc: 'ภาพจากกิจกรรมและงานบุญของวัดเซกะหมานกลาง', enDesc: 'Scenes from ceremonies and activities at Wat Xekaman Kang.' },
        { src: 'images/events/event2.jpg', lo: 'ບັນຍາກາດກິດຈະກຳຂອງວັດ 2', th: 'บรรยากาศกิจกรรมของวัด 2', en: 'Temple activities 2', loDesc: 'ບັນທຶກພາບຄວາມສັດທາ ແລະ ການຮ່ວມກິດຈະກຳ', thDesc: 'บันทึกภาพศรัทธาและการร่วมกิจกรรม', enDesc: 'A record of faith and community participation.' },
        { src: 'images/events/event3.jpg', lo: 'ບັນຍາກາດກິດຈະກຳຂອງວັດ 3', th: 'บรรยากาศกิจกรรมของวัด 3', en: 'Temple activities 3', loDesc: 'ພາບການຮ່ວມງານບຸນ ແລະ ກິດຈະກຳພາຍໃນວັດ', thDesc: 'ภาพการร่วมงานบุญและกิจกรรมภายในวัด', enDesc: 'Merit-making and activities inside the temple.' },
        { src: 'images/events/event4.jpg', lo: 'ບັນຍາກາດກິດຈະກຳຂອງວັດ 4', th: 'บรรยากาศกิจกรรมของวัด 4', en: 'Temple activities 4', loDesc: 'ຮູບພາບອີກຊ່ວງໜຶ່ງຂອງງານບຸນ ແລະ ຊຸມຊົນ', thDesc: 'ภาพอีกช่วงหนึ่งของงานบุญและชุมชน', enDesc: 'Another moment from a temple festival and its community.' },
        { src: 'images/events/event5.jpg', lo: 'ບັນຍາກາດກິດຈະກຳຂອງວັດ 5', th: 'บรรยากาศกิจกรรมของวัด 5', en: 'Temple activities 5', loDesc: 'ປະມວນພາບກິດຈະກຳທີ່ວັດຈັດຂຶ້ນ', thDesc: 'ประมวลภาพกิจกรรมที่วัดจัดขึ้น', enDesc: 'A collection of temple activities.' }
    ];

    const translations = {
        lo: {
            title: 'ຄັງຮູບພາບ | ວັດເຊກະໝານກາງ', brand: 'ວັດເຊກະໝານກາງ', navHome: 'ໜ້າຫຼັກ', navGallery: 'ຄັງຮູບພາບ', navMembers: 'ທຳນຽບວັດ', eyebrow: 'WAT XEKAMAN KANG', heroTitle: 'ຄັງຮູບພາບ ແລະ ກິດຈະກຳຂອງວັດ', heroText: 'ປະມວນຮູບພາບບັນຍາກາດງານບຸນ ແລະ ຊີວິດພາຍໃນວັດ ເລືອກຊົມຮູບໄດ້ຈາກປຸ່ມກ່ອນໜ້າ ຫຼື ຖັດໄປ.', chipPhotos: '5 ຮູບພາບ', chipControl: 'ກົດເລື່ອນໄດ້ ແລະ ຮອງຮັບແປ້ນພິມ', galleryTitle: 'ເລືອກຊົມຮູບພາບ', galleryText: 'ສະໄລດ໌ນີ້ໃຊ້ຮູບກິດຈະກຳຈາກໂຟນເດີຂອງວັດ.', slideLabel: 'ຄັງຮູບພາບ', pause: 'ຢຸດການເລື່ອນອັດຕະໂນມັດ', play: 'ເລີ່ມການເລື່ອນອັດຕະໂນມັດ', keyboardHelp: 'ກົດລູກສອນຊ້າຍ/ຂວາ ຫຼື ປຸ່ມເທິງໜ້າຈໍເພື່ອເລື່ອນຮູບ', allPhotosTitle: 'ຮູບພາບທັງໝົດ', allPhotosText: 'ກົດຮູບໃດກໍໄດ້ເພື່ອໄປຫາຮູບນັ້ນໃນສະໄລດ໌.', guideTitle: 'ແນະນຳການເພີ່ມຮູບໃນອະນາຄົດ', guideText: 'ເພື່ອໃຫ້ຂ່າວສານຂອງວັດທັນສະໄໝ ຄວນອັບເດດຮູບກິດຈະກຳໃໝ່ພ້ອມຄຳບັນຍາຍສັ້ນໆ ແລະ ກວດສອບຊື່ໄຟລ໌ກ່ອນເຜີຍແຜ່.', guideOne: 'ຕັ້ງຊື່ໄຟລ໌ຮູບໃຫ້ສື່ຄວາມໝາຍ ແລະ ໃຊ້ຕົວອັກສອນດຽວກັນ.', guideTwo: 'ໃສ່ວັນທີ ຫຼື ຊື່ກິດຈະກຳໃນຄຳບັນຍາຍ ເມື່ອມີຂໍ້ມູນພ້ອມ.', guideThree: 'ທົດສອບປຸ່ມກ່ອນໜ້າ/ຖັດໄປ ແລະ ໜ້າຈໍໂທລະສັບກ່ອນລົງເວັບ.', driveTitle: 'ອັລບັ້ມຮູບພາບສະບັບເຕັມ', driveText: 'ສາມາດເປີດເບິ່ງອັລບັ້ມກິດຈະກຳຂອງວັດທີ່ຈັດເກັບໄວ້ໄດ້.', driveButton: 'ເປີດອັລບັ້ມ Google Drive', footerName: 'ວັດເຊກະໝານກາງ · Wat Xekaman Kang', footerNote: 'ເວັບໄຊທ໌ຂໍ້ມູນ ແລະ ປະຊາສຳພັນຂອງວັດ', previous: 'ຮູບກ່ອນໜ້າ', next: 'ຮູບຖັດໄປ', choose: 'ເລືອກຮູບທີ'
        },
        th: {
            title: 'คลังภาพ | วัดเซกะหมานกลาง', brand: 'วัดเซกะหมานกลาง', navHome: 'หน้าหลัก', navGallery: 'คลังภาพ', navMembers: 'ทำเนียบวัด', eyebrow: 'WAT XEKAMAN KANG', heroTitle: 'คลังภาพและกิจกรรมของวัด', heroText: 'รวบรวมภาพบรรยากาศงานบุญและวิถีชีวิตภายในวัด เลือกดูภาพด้วยปุ่มก่อนหน้า หรือ ถัดไปได้ทันที.', chipPhotos: '5 ภาพ', chipControl: 'เลื่อนภาพได้และรองรับแป้นพิมพ์', galleryTitle: 'เลือกชมภาพ', galleryText: 'สไลด์นี้ใช้รูปกิจกรรมจากโฟลเดอร์แกลเลอรี่ของวัดโดยตรง.', slideLabel: 'คลังภาพ', pause: 'หยุดเลื่อนอัตโนมัติ', play: 'เริ่มเลื่อนอัตโนมัติ', keyboardHelp: 'กดลูกศรซ้าย/ขวา หรือปุ่มบนหน้าจอเพื่อเลื่อนภาพ', allPhotosTitle: 'ภาพทั้งหมด', allPhotosText: 'กดภาพใดก็ได้เพื่อไปยังภาพนั้นในสไลด์.', guideTitle: 'ข้อแนะนำสำหรับการเพิ่มภาพครั้งต่อไป', guideText: 'เพื่อให้ข้อมูลข่าวสารของวัดทันสมัย ควรอัปเดตภาพกิจกรรมพร้อมคำบรรยายสั้น ๆ และตรวจสอบชื่อไฟล์ก่อนเผยแพร่.', guideOne: 'ตั้งชื่อไฟล์ภาพให้สื่อความหมายและใช้รูปแบบตัวอักษรให้สม่ำเสมอ.', guideTwo: 'ใส่วันที่หรือชื่อกิจกรรมไว้ในคำบรรยายเมื่อมีข้อมูลพร้อม.', guideThree: 'ทดสอบปุ่มก่อนหน้า/ถัดไปและหน้าจอโทรศัพท์ก่อนนำขึ้นเว็บไซต์.', driveTitle: 'อัลบั้มภาพฉบับเต็ม', driveText: 'เปิดดูอัลบั้มกิจกรรมของวัดที่จัดเก็บไว้ได้.', driveButton: 'เปิดอัลบั้ม Google Drive', footerName: 'วัดเซกะหมานกลาง · Wat Xekaman Kang', footerNote: 'เว็บไซต์ข้อมูลและประชาสัมพันธ์ของวัด', previous: 'ภาพก่อนหน้า', next: 'ภาพถัดไป', choose: 'เลือกภาพที่'
        },
        en: {
            title: 'Gallery | Wat Xekaman Kang', brand: 'Wat Xekaman Kang', navHome: 'Home', navGallery: 'Gallery', navMembers: 'Temple members', eyebrow: 'WAT XEKAMAN KANG', heroTitle: 'Temple gallery and activities', heroText: 'A collection of temple ceremonies and community moments. Use the previous and next controls to browse.', chipPhotos: '5 images', chipControl: 'Swipe or use the keyboard arrows', galleryTitle: 'Browse the gallery', galleryText: 'This slideshow uses activity images directly from the temple gallery folder.', slideLabel: 'Photo gallery', pause: 'Pause autoplay', play: 'Resume autoplay', keyboardHelp: 'Use the left/right arrow keys or the on-screen controls to change images.', allPhotosTitle: 'All photos', allPhotosText: 'Select any photo to open it in the slideshow.', guideTitle: 'Adding photos in future', guideText: 'Keep the gallery fresh with new activity images and short captions.', guideOne: 'Use clear, consistent filenames.', guideTwo: 'Add the date or activity name to the caption.', guideThree: 'Test the controls and phone layout before publishing.', driveTitle: 'Full photo album', driveText: 'Open the complete temple activity album.', driveButton: 'Open Google Drive album', footerName: 'Wat Xekaman Kang · Laos', footerNote: 'Official information and public-relations website', previous: 'Previous image', next: 'Next image', choose: 'Choose image'
        }
    };

    const languageLabels = { lo: '🇱🇦 ພາສາລາວ', en: '🇬🇧 English', th: '🇹🇭 ภาษาไทย' };
    const storedLanguage = localStorage.getItem('preferred_lang') || localStorage.getItem('wat-kang-language') || 'lo';
    let activeIndex = 0;
    let activeLanguage = translations[storedLanguage] ? storedLanguage : 'lo';
    let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let autoplayTimer;
    let touchStartX = 0;
    let slideChangeTimer;
    let lightboxIndex = 0;
    let lightboxTouchStartX = 0;

    const slideImage = document.getElementById('slideImage');
    const slideTitle = document.getElementById('slideTitle');
    const slideDescription = document.getElementById('slideDescription');
    const slideNumber = document.getElementById('slideNumber');
    const dots = document.getElementById('sliderDots');
    const thumbnails = document.getElementById('thumbnailGrid');
    const pauseButton = document.getElementById('pauseButton');
    const stage = document.getElementById('slideStage');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const galleryLightboxImage = document.getElementById('galleryLightboxImage');
    const galleryLightboxCaption = document.getElementById('galleryLightboxCaption');
    const galleryLightboxFrame = document.getElementById('galleryLightboxFrame');

    function currentText(key) { return translations[activeLanguage][key]; }
    function slideText(slide) { return slide[activeLanguage] || slide.lo; }
    function slideDescriptionText(slide) { return slide[`${activeLanguage}Desc`] || slide.loDesc; }

    function isGalleryLightboxOpen() {
        return galleryLightbox.classList.contains('is-open');
    }

    function showGalleryLightboxImage(index) {
        lightboxIndex = (index + slides.length) % slides.length;
        const slide = slides[lightboxIndex];
        galleryLightboxImage.src = slide.src;
        galleryLightboxImage.alt = slideText(slide);
        galleryLightboxCaption.replaceChildren();
        const title = document.createElement('strong');
        title.textContent = slideText(slide);
        const description = document.createElement('span');
        description.textContent = slideDescriptionText(slide);
        galleryLightboxCaption.append(title, description);
        galleryLightbox.classList.remove('is-zoomed');
    }

    function openGalleryLightbox(index = activeIndex) {
        window.clearInterval(autoplayTimer);
        showGalleryLightboxImage(index);
        galleryLightbox.classList.add('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('gallery-lightbox-open');
        document.getElementById('galleryLightboxClose').focus();
    }

    function closeGalleryLightbox() {
        if (!isGalleryLightboxOpen()) return;
        galleryLightbox.classList.remove('is-open', 'is-zoomed');
        galleryLightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('gallery-lightbox-open');
        showSlide(lightboxIndex);
        slideImage.focus();
    }

    function toggleGalleryLightboxZoom() {
        galleryLightbox.classList.toggle('is-zoomed');
    }

    function closeGalleryLanguageMenu() {
        const menu = document.getElementById('galleryLanguageMenu');
        const trigger = document.getElementById('galleryLanguageTrigger');
        if (menu) menu.classList.remove('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function syncGalleryLanguageMenu() {
        const label = document.getElementById('galleryLanguageLabel');
        if (label) label.textContent = languageLabels[activeLanguage] || languageLabels.lo;
        document.querySelectorAll('[data-language]').forEach(button => {
            button.setAttribute('aria-current', String(button.dataset.language === activeLanguage));
        });
    }

    function fallbackImage(image) {
        const title = image.alt || 'Temple gallery';
        const safeTitle = String(title).replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
        })[character]);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-label="${safeTitle}"><rect width="1200" height="700" fill="#2d080e"/><path d="M0 560 300 350l190 130 240-245 470 325v140H0z" fill="#4a0e17"/><circle cx="960" cy="155" r="58" fill="#d4af37" opacity=".9"/><text x="600" y="620" fill="#f3e5ab" font-family="sans-serif" font-size="34" text-anchor="middle">${safeTitle}</text></svg>`;
        image.onerror = null;
        image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function renderControls() {
        dots.innerHTML = '';
        thumbnails.innerHTML = '';
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `${currentText('choose')} ${index + 1}`);
            dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
            dot.className = index === activeIndex ? 'active' : '';
            dot.addEventListener('click', () => showSlide(index));
            dots.appendChild(dot);

            const thumbnail = document.createElement('button');
            thumbnail.type = 'button';
            thumbnail.className = `thumbnail${index === activeIndex ? ' active' : ''}`;
            thumbnail.setAttribute('aria-label', `${currentText('choose')} ${index + 1}: ${slideText(slide)}`);
            thumbnail.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
            thumbnail.innerHTML = `<img src="${slide.src}" alt="" loading="lazy"><span>${slideText(slide)}</span>`;
            thumbnail.querySelector('img').addEventListener('error', event => fallbackImage(event.currentTarget));
            thumbnail.addEventListener('click', () => showSlide(index));
            thumbnails.appendChild(thumbnail);
        });
    }

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        const slide = slides[activeIndex];
        window.clearTimeout(slideChangeTimer);
        stage.classList.add('is-changing');
        slideChangeTimer = window.setTimeout(() => {
            slideImage.src = slide.src;
            slideImage.alt = slideText(slide);
            slideImage.setAttribute('aria-label', slideText(slide));
            stage.classList.remove('is-changing');
        }, 220);
        slideTitle.textContent = slideText(slide);
        slideDescription.textContent = slideDescriptionText(slide);
        slideNumber.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        renderControls();
        resetAutoplay();
    }

    function resetAutoplay() {
        window.clearInterval(autoplayTimer);
        if (!isPaused) autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 7000);
    }

    function setLanguage(language) {
        activeLanguage = language;
        document.documentElement.lang = language;
        document.title = currentText('title');
        localStorage.setItem('wat-kang-language', language);
        localStorage.setItem('preferred_lang', language);
        localStorage.setItem('preferred_lang_label', languageLabels[language]);
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const value = currentText(element.dataset.i18n);
            if (value) element.textContent = value;
        });
        document.getElementById('previousSlide').setAttribute('aria-label', currentText('previous'));
        document.getElementById('nextSlide').setAttribute('aria-label', currentText('next'));
        syncGalleryLanguageMenu();
        closeGalleryLanguageMenu();
        pauseButton.textContent = isPaused ? currentText('play') : currentText('pause');
        showSlide(activeIndex);
    }

    document.getElementById('galleryLanguageTrigger').addEventListener('click', () => {
        const menu = document.getElementById('galleryLanguageMenu');
        const trigger = document.getElementById('galleryLanguageTrigger');
        const isOpen = menu.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    });
    document.getElementById('previousSlide').addEventListener('click', () => showSlide(activeIndex - 1));
    document.getElementById('nextSlide').addEventListener('click', () => showSlide(activeIndex + 1));
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? currentText('play') : currentText('pause');
        resetAutoplay();
    });
    stage.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); showSlide(activeIndex - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); showSlide(activeIndex + 1); }
    });
    document.addEventListener('keydown', event => {
        if (isGalleryLightboxOpen()) {
            if (event.key === 'Escape') closeGalleryLightbox();
            if (event.key === 'ArrowLeft') showGalleryLightboxImage(lightboxIndex - 1);
            if (event.key === 'ArrowRight') showGalleryLightboxImage(lightboxIndex + 1);
            if (event.key === 'Escape' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
            return;
        }
        if (event.key === 'Escape') { closeGalleryLanguageMenu(); return; }
        const isFormControl = /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName);
        if (isFormControl || stage.contains(event.target)) return;
        if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
        if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
    });
    stage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
    stage.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(distance) > 45) showSlide(activeIndex + (distance > 0 ? -1 : 1));
    }, { passive: true });
    slideImage.tabIndex = 0;
    slideImage.setAttribute('role', 'button');
    slideImage.addEventListener('click', () => openGalleryLightbox(activeIndex));
    slideImage.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGalleryLightbox(activeIndex);
        }
    });
    slideImage.addEventListener('error', event => fallbackImage(event.currentTarget));
    galleryLightboxImage.addEventListener('error', event => fallbackImage(event.currentTarget));
    document.getElementById('galleryLightboxClose').addEventListener('click', closeGalleryLightbox);
    document.getElementById('galleryLightboxPrevious').addEventListener('click', () => showGalleryLightboxImage(lightboxIndex - 1));
    document.getElementById('galleryLightboxNext').addEventListener('click', () => showGalleryLightboxImage(lightboxIndex + 1));
    galleryLightboxImage.addEventListener('click', toggleGalleryLightboxZoom);
    galleryLightbox.addEventListener('click', event => {
        if (event.target === galleryLightbox) closeGalleryLightbox();
    });
    galleryLightboxFrame.addEventListener('touchstart', event => {
        lightboxTouchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    galleryLightboxFrame.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].screenX - lightboxTouchStartX;
        if (Math.abs(distance) > 45) showGalleryLightboxImage(lightboxIndex + (distance > 0 ? -1 : 1));
    }, { passive: true });
    document.addEventListener('click', event => {
        if (!event.target.closest('#galleryLanguageMenu')) closeGalleryLanguageMenu();
    });
    document.getElementById('copyrightYear').textContent = new Date().getFullYear();
    setLanguage(activeLanguage);
