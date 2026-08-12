/* Interactive behavior for index.html. */

function openImageModal(modalId, sourceImageId, modalImageId, openerId) {
    const sourceImage = document.getElementById(sourceImageId);
    const modal = document.getElementById(modalId);
    const modalImage = document.getElementById(modalImageId);
    const closeButton = modal?.querySelector('[data-image-modal-close]');

    if (!sourceImage || !modal || !modalImage) return;

    modalImage.src = sourceImage.currentSrc || sourceImage.src;
    modal.dataset.openerId = openerId;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => closeButton?.focus(), 0);
}

function closeImageModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || modal.style.display === 'none') return;

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const opener = document.getElementById(modal.dataset.openerId);
    window.setTimeout(() => opener?.focus(), 0);
}

function openQRImage() {
    openImageModal('qrImageModal', 'qrImgSrc', 'qrModalImg', 'qrImageTrigger');
}

function closeQRImage() {
    closeImageModal('qrImageModal');
}

function openMonkImage() {
    openImageModal('monkImageModal', 'monkProfileImg', 'monkModalImg', 'monkProfileImg');
}

function closeMonkImage() {
    closeImageModal('monkImageModal');
}

function handleImageTriggerKey(event, imageType) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (imageType === 'qr') openQRImage();
    if (imageType === 'monk') openMonkImage();
}

function getOpenImageModal() {
    return ['qrImageModal', 'monkImageModal']
        .map(id => document.getElementById(id))
        .find(modal => modal?.style.display === 'flex');
}

function initImageModalAccessibility() {
    document.addEventListener('keydown', event => {
        const modal = getOpenImageModal();
        if (!modal) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeImageModal(modal.id);
            return;
        }

        if (event.key !== 'Tab') return;
        const focusable = [...modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter(element => element.offsetParent !== null);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

/* ===================================================
           Web Audio API Sound Engine (Bell & Gong Synthesizer)
           =================================================== */
        let audioCtx = null;

        function getAudioContext() {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContextClass();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        // Resonant Temple Bell Sound
        function playBellSound() {
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                
                // Fundamental frequencies for lao temple bell harmonics
                const freqs = [261.63, 523.25, 784.88, 1046.50, 1567.98];
                freqs.forEach((freq, index) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.25 / (index + 1), now + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc.start(now);
                    osc.stop(now + 4.5);
                });
                showToast("ສຽງລະຄັງວັດດັງຂຶ້ນ... ສາທຸ", "ສຽງສັກສິດ", "fa-bell");
            } catch (e) {
                console.log('Audio Context Error:', e);
            }
        }

        // Deep Resonant Gong Sound
        function playGongSound() {
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 2.0);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.6, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(now);
                osc.stop(now + 5.0);

                showToast("ສຽງຄ້ອງວັດດັງຂຶ້ນ... ສາທຸ", "ສຽງສັກສິດ", "fa-drum");
            } catch (e) {
                console.log('Audio Context Error:', e);
            }
        }

        /* ===================================================
           STREAMING_CHUNK:Managing modal dialogs and notification toast system...
           =================================================== */
        function showToast(message, title = "ແຈ້ງເຕືອນ", icon = "fa-circle-info") {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'bg-laoMaroon text-white p-4 rounded-2xl shadow-2xl border border-laoGold flex items-center gap-3 transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto';
            
            toast.innerHTML = `
                <div class="w-10 h-10 rounded-xl bg-laoGold/20 border border-laoGold/50 flex items-center justify-center text-laoGold text-lg shrink-0">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h5 class="font-lao-serif font-bold text-laoGold text-sm">${translateText(title)}</h5>
                    <p class="text-xs text-amber-100 font-sans truncate">${translateText(message)}</p>
                </div>
            `;

            container.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.classList.remove('translate-y-4', 'opacity-0');
            }, 10);

            // Remove after 3.5 seconds
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        function openModal(title, contentHtml) {
            document.getElementById('modalTitle').querySelector('span').innerText = translateText(title);
            document.getElementById('modalBody').innerHTML = translateHtml(contentHtml);
            const modal = document.getElementById('appModal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('modalBox').classList.remove('scale-95');
                document.getElementById('modalBox').classList.add('scale-100');
            }, 10);
        }

        function closeModal() {
            document.getElementById('modalBox').classList.remove('scale-100');
            document.getElementById('modalBox').classList.add('scale-95');
            setTimeout(() => {
                document.getElementById('appModal').classList.add('hidden');
            }, 200);
        }

        function openGalleryModal(imgSrc, title, description) {
            const content = `
                <div class="space-y-4">
                    <div class="rounded-2xl overflow-hidden border border-laoGold/40 shadow-md max-h-[50vh]">
                        <img src="${imgSrc}" alt="${title}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="text-xl font-bold font-lao-serif text-laoMaroon mb-1">${title}</h4>
                        <p class="text-sm text-gray-600 leading-relaxed font-sans">${description}</p>
                    </div>
                </div>
            `;
            openModal(title, content);
        }

        function openMapModal() {
    const content = `
        <div class="space-y-4 text-center">
            <div class="bg-amber-100 p-6 rounded-2xl border border-amber-300">
                <i class="fa-solid fa-map-location-dot text-5xl text-laoMaroon mb-3"></i>
                <h4 class="font-bold text-lg text-laoMaroon font-lao-serif">ແຜນທີ່ຕຳແໜ່ງ ວັດເຊກະໝານກາງ</h4>
                <p class="text-xs text-gray-600 mt-2">ບ້ານເຊກະໝານກາງ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື, ສປປ ລາວ</p>
            </div>
            <p class="text-sm text-gray-700">ກົດປຸ່ມດ້ານລຸ່ມເພື່ອຄົ້ນຫາວັດເຊກະໝານກາງໃນ Google Maps.</p>
            <div class="pt-2">
                <a href="https://www.google.com/maps/search/?api=1&query=Wat%20Xekaman%20Kang%2C%20Samakkhixay%2C%20Attapeu%2C%20Laos" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all text-sm">
                    <i class="fa-solid fa-location-arrow"></i>
                    <span>ນຳທາງດ້ວຍ Google Maps</span>
                </a>
            </div>
        </div>
    `;
    openModal("ແຜນທີ່ ແລະ ການເດີນທາງ", content);
}

        function openReceiptGeneratorModal() {
            const content = `
                <form onsubmit="generateReceiptSubmit(event)" class="space-y-4">
                    <p class="text-xs text-gray-600">ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອສ້າງບັດອະນຸໂມທະນາບຸນ ສຳລັບເກັບໄວ້ເປັນສິຣິມົງຄົນ.</p>
                    <p class="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"><i class="fa-solid fa-circle-info mr-1"></i> ບັດນີ້ເປັນບັນທຶກສ່ວນຕົວ ບໍ່ແມ່ນໃບເສັດ ແລະ ບໍ່ແມ່ນການຢືນຢັນການໂອນເງິນ.</p>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">ຊື່ ແລະ ນາມສະກຸນ ຜູ້ບໍລິຈາກ</label>
                        <input type="text" id="receiptName" required placeholder="ຕົວຢ່າງ: ທ່ານ ສົມໄຊ ວົງສາ" class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-laoGold focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">ຈຳນວນທີ່ຕ້ອງການລະບຸ (ກີບ / ບາດ)</label>
                        <input type="text" id="receiptAmount" required placeholder="ຕົວຢ່າງ: 100,000 ກີບ" class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-laoGold focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">ວັດຖຸປະສົງການເຮັດບຸນ</label>
                        <select id="receiptPurpose" class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-laoGold focus:outline-none">
                            <option value="ບູລະນະພຣະອຸໂບສົດ (ສິມ)">ບູລະນະພຣະອຸໂບສົດ (ສິມ)</option>
                            <option value="ຄ່ານ້ຳ-ຄ່າໄຟຟ້າວັດ">ຄ່ານ້ຳ-ຄ່າໄຟຟ້າວັດ</option>
                            <option value="ທຶນການສຶກສາພຣະພິກຂຸ-ສາມະເນນ">ທຶນການສຶກສາພຣະພິກຂຸ-ສາມະເນນ</option>
                            <option value="ກອງທຶນສາທາລະນະກຸສົນ">ກອງທຶນສາທາລະນະກຸສົນ</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full gold-gradient text-laoMaroon font-bold py-3 rounded-xl shadow hover:scale-[1.01] transition-transform">
                        ສ້າງບັດອະນຸໂມທະນາບຸນ
                    </button>
                </form>
            `;
            openModal("ບັດອະນຸໂມທະນາບຸນ", content);
        }

        function generateReceiptSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('receiptName').value;
            const amount = document.getElementById('receiptAmount').value;
            const purpose = document.getElementById('receiptPurpose').value;
            const dateStr = new Date().toLocaleDateString('lo-LA', { year: 'numeric', month: 'long', day: 'numeric' });

            const content = `
                <div class="border-4 border-laoGold p-6 rounded-2xl bg-amber-50/80 text-center relative font-lao-serif">
                    <div class="text-laoMaroon font-bold text-2xl mb-1">ບັດອະນຸໂມທະນາບຸນ</div>
                    <div class="text-xs text-laoGoldDark font-semibold uppercase mb-3">WAT XEKAMAN KANG · PERSONAL MERIT ACKNOWLEDGEMENT</div>
                    <div class="mb-4 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[.68rem] font-sans font-bold text-amber-900"><i class="fa-solid fa-circle-info"></i> ບັນທຶກສ່ວນຕົວ · ບໍ່ແມ່ນໃບເສັດ</div>
                    <p class="text-xs text-gray-600 mb-6">ຂໍອະນຸໂມທະນາບຸນຂອບໃຈ ນຳ:</p>
                    <p class="text-2xl font-bold text-laoMaroon mb-2">${name}</p>
                    <p class="text-sm text-gray-700 mb-4">ຈຳນວນທີ່ລະບຸ: <strong class="text-laoMaroon">${amount}</strong></p>
                    <p class="text-xs text-gray-600 mb-6">ເພື່ອວັດຖຸປະສົງ: <strong>${purpose}</strong></p>
                    <p class="mb-4 text-[.68rem] leading-relaxed text-gray-500">ເອກະສານນີ້ສ້າງຈາກຂໍ້ມູນທີ່ທ່ານລະບຸ ແລະ ບໍ່ຮັບຮອງວ່າການຊຳລະເງິນໄດ້ສຳເລັດ.</p>
                    <div class="border-t border-laoGold/40 pt-4 mt-4 flex justify-between items-center text-xs text-gray-500 font-sans">
                        <span>ວັນທີ: ${dateStr}</span>
                        <span class="font-bold text-laoMaroon">ວັດເຊກະໝານກາງ</span>
                    </div>
                </div>
            `;
            openModal("ບັດອະນຸໂມທະນາບຸນ", content);
            showToast("ສ້າງບັດອະນຸໂມທະນາບຸນສຳເລັດ! ສາທຸ", "ສຳເລັດ", "fa-certificate");
        }

        /* ===================================================
           STREAMING_CHUNK:Implementing virtual merit state and local storage...
           =================================================== */
        const DEFAULT_DEVOTEES = [
            { name: "ທ່ານ ສົມພອນ + ຄອບຄົວ", wish: "ຂໍໃຫ້ຄອບຄົວມີຄວາມສຸກ ສຸຂະພາບແຂງແຮງ", time: "5 ນາທີກ່ອນ", lotus: "🌸" },
            { name: "ນາງ ມະລີວັນ", wish: "ຂໍໃຫ້ການຄ້າຂາຍຈະເລີນຮຸ່ງເຮືອງ", time: "18 ນາທີກ່ອນ", lotus: "🪷" },
            { name: "ທ່ານ ບຸນມີ", wish: "ຂໍໃຫ້ແຄ້ວຄາດປອດໄພຈາກໂຣກໄພທັງປວງ", time: "1 ຊົ່ວໂມງກ່ອນ", lotus: "🌼" }
        ];

        const MERIT_DASHBOARD_COPY = {
            lo: {
                eyebrow: 'ຮ່ວມອະນຸໂມທະນາບຸນ', title: 'ສາຍໃຍແຫ່ງສັດທາ',
                note: 'ສະຖິຕິນີ້ອັບເດດຈາກລາຍການທີ່ບັນທຶກໃນອຸປະກອນນີ້',
                participants: 'ຜູ້ຮ່ວມເຮັດບຸນ', wishes: 'ຄຳອະທິຖານ', lotuses: 'ດອກບົວທີ່ຖວາຍ',
                participantDetail: 'ລາຍການທີ່ສະແດງ', wishDetail: 'ຄຳອວຍພອນຈາກໃຈ', lotusDetail: 'ຮ່ວມບູຊາດ້ວຍສັດທາ', feedTitle: 'ລາຍຊື່ຜູ້ຮ່ວມເຮັດບຸນຫຼ້າສຸດ'
            },
            th: {
                eyebrow: 'ร่วมอนุโมทนาบุญ', title: 'สายใยแห่งศรัทธา',
                note: 'สถิตินี้อัปเดตจากรายการที่บันทึกในอุปกรณ์นี้',
                participants: 'ผู้ร่วมทำบุญ', wishes: 'คำอธิษฐาน', lotuses: 'ดอกบัวที่ถวาย',
                participantDetail: 'รายชื่อที่แสดง', wishDetail: 'คำอวยพรจากใจ', lotusDetail: 'ร่วมบูชาด้วยศรัทธา', feedTitle: 'รายชื่อผู้ร่วมทำบุญล่าสุด'
            },
            en: {
                eyebrow: 'SHARED MERIT', title: 'A circle of faith',
                note: 'These counts reflect entries saved in this browser.',
                participants: 'Merit participants', wishes: 'Prayer wishes', lotuses: 'Lotuses offered',
                participantDetail: 'Entries shown here', wishDetail: 'Wishes from the heart', lotusDetail: 'Offerings made in faith', feedTitle: 'Recent merit participants'
            }
        };

        function escapeDynamicHtml(value) {
            return String(value ?? '').replace(/[&<>'"]/g, character => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            })[character]);
        }

        function animateMeritNumber(element, target) {
            if (!element) return;
            const previous = Number(element.dataset.value || 0);
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            element.dataset.value = String(target);
            if (reduceMotion || previous === target) {
                element.textContent = String(target);
                return;
            }
            if (element._meritCounterFrame) cancelAnimationFrame(element._meritCounterFrame);
            const startedAt = performance.now();
            const duration = 520;
            const step = now => {
                const progress = Math.min(1, (now - startedAt) / duration);
                element.textContent = String(Math.round(previous + ((target - previous) * (1 - Math.pow(1 - progress, 3)))));
                if (progress < 1) element._meritCounterFrame = requestAnimationFrame(step);
            };
            element._meritCounterFrame = requestAnimationFrame(step);
        }

        function renderMeritDashboard() {
            const feed = document.getElementById('meritLiveFeed');
            if (!feed) return;
            const devotees = getDevoteeList();
            const language = getPreferredLanguage();
            const copy = MERIT_DASHBOARD_COPY[language] || MERIT_DASHBOARD_COPY.lo;
            const textFields = {
                meritStatsEyebrow: copy.eyebrow, meritStatsTitle: copy.title, meritStatsNote: copy.note,
                meritParticipantsLabel: copy.participants, meritWishesLabel: copy.wishes, meritLotusesLabel: copy.lotuses,
                meritParticipantsDetail: copy.participantDetail, meritWishesDetail: copy.wishDetail, meritLotusesDetail: copy.lotusDetail,
                meritFeedTitle: copy.feedTitle
            };
            Object.entries(textFields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            });
            animateMeritNumber(document.getElementById('meritParticipants'), devotees.length);
            animateMeritNumber(document.getElementById('meritWishes'), devotees.filter(devotee => devotee.wish).length);
            animateMeritNumber(document.getElementById('meritLotuses'), devotees.filter(devotee => devotee.lotus).length);

            const cards = devotees.slice(0, 8).map(devotee => `
                <article class="merit-feed-card">
                    <span class="merit-feed-icon">${escapeDynamicHtml(devotee.lotus || '🪷')}</span>
                    <span class="min-w-0">
                        <strong class="block truncate text-sm font-bold text-laoMaroon">${escapeDynamicHtml(devotee.name)}</strong>
                        <small class="block truncate text-xs text-gray-500">${escapeDynamicHtml(translateText(devotee.time || ''))}</small>
                    </span>
                </article>
            `).join('');
            feed.innerHTML = cards ? `${cards}${cards.replaceAll('<article', '<article aria-hidden="true"')}` : '';
        }

        function getDevoteeList() {
            const stored = localStorage.getItem('xekaman_devotees');
            if (stored) {
                try { return JSON.parse(stored); } catch (e) {}
            }
            return DEFAULT_DEVOTEES;
        }

        function saveDevoteeList(list) {
            localStorage.setItem('xekaman_devotees', JSON.stringify(list));
        }

        function renderDevotees() {
            const devotees = getDevoteeList();
            const container = document.getElementById('recentDevoteesList');
            if (!container) return;
            container.innerHTML = devotees.map(d => `
                <div class="bg-laoMaroon/70 p-3 rounded-xl border border-laoGold/20 flex justify-between items-center gap-2">
                    <div class="min-w-0">
                        <span class="font-bold text-laoGold block text-xs sm:text-sm font-lao-serif truncate">${escapeDynamicHtml(d.lotus || '🪷')} ${escapeDynamicHtml(d.name)}</span>
                        <p class="text-amber-100/80 text-xs font-light truncate">${escapeDynamicHtml(translateText(d.wish))}</p>
                    </div>
                    <span class="text-[10px] text-amber-200/60 shrink-0 bg-laoMaroonDark/60 px-2 py-1 rounded-md border border-laoGold/10">${escapeDynamicHtml(translateText(d.time))}</span>
                </div>
            `).join('');
        }

        function submitVirtualMerit(e) {
            e.preventDefault();
            const name = document.getElementById('devoteeName').value.trim();
            const wish = document.getElementById('devoteeWish').value.trim();
            const lotusSelect = document.getElementById('lotusColor').value;
            const lotusIcon = lotusSelect.split(' ')[0];

            if (!name || !wish) return;

            // Play sound
            playBellSound();

            // Show active altar flame area
            document.getElementById('noFlameText').classList.add('hidden');
            const activeArea = document.getElementById('activeFlameArea');
            activeArea.classList.remove('hidden');
            activeArea.classList.add('flex');

            document.getElementById('blessingOutputName').innerText = translateText("ສາທຸ!") + " " + name;
            document.getElementById('blessingOutputWish').innerText = '“' + wish + '”';
            document.getElementById('offeredLotusIcon').innerText = lotusIcon;

            // Save state
            const currentList = getDevoteeList();
            currentList.unshift({
                name: name,
                wish: wish,
                lotus: lotusIcon,
                time: "ເພິ່ງນີ້"
            });
            saveDevoteeList(currentList);
            renderDevotees();
            renderMeritDashboard();

            showToast("ທ່ານໄດ້ໄຕ້ທຽນ ແລະ ຖວາຍດອກບົວສຳເລັດແລ້ວ! ຂໍໃຫ້ສົມປະຖາໜາ", "ສາທຸ ສາທຸ", "fa-flame");

            // Reset inputs
            document.getElementById('devoteeName').value = '';
            document.getElementById('devoteeWish').value = '';
        }

        function clearDevoteeList() {
            localStorage.removeItem('xekaman_devotees');
            renderDevotees();
            renderMeritDashboard();
            showToast("ລຶບປະວັດການເຮັດບຸນແລ້ວ", "ແຈ້ງເຕືອນ", "fa-trash");
        }

        /* ===================================================
           STREAMING_CHUNK:Adding Dhamma quote rotation and clipboard copy handlers...
           =================================================== */
       const QUOTES = [
    { text: "ຄວາມເວັ້ນຈາກບາບທັງປວງ, ການຍັງກຸສົນໃຫ້ເຖິງພ້ອມ, ການເຮັດຈິດໃຈຂອງຕົນໃຫ້ຜ່ອງໃສ ນີ້ແມ່ນຄຳສອນຂອງພຣະພຸດທະເຈົ້າທັງຫຼາຍ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ການໃຫ້ທານ ຍ່ອມຊະນະການຕະຖີ່ ມີຄວາມເມດຕາ ຍ່ອມຊະນະຄວາມໂກດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຈິດໃຈທີ່ຝຶກອົບຮົມດີແລ້ວ ຍ່ອມນຳຄວາມສຸກມາໃຫ້.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມບໍ່ປະໝາດ ເປັນໜທາງແຫ່ງຄວາມບໍ່ຕາຍ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຕົນເປັນທີ່ເພິ່ງຂອງຕົນ ຄົນອື່ນໃຜເລີຍຈະເປັນທີ່ເພິ່ງໄດ້.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ເຮັດດີໄດ້ດີ ເຮັດຊົ່ວໄດ້ຊົ່ວ ກົດແຫ່ງກຳຍ່ອມໃຫ້ຜົນສະເໝີ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ຄວາມອົດທົນ ເປັນຕົບະຢ່າງຍິ່ງ.", source: "- ໂອວາດປາຕິໂມກ -" },
    { text: "ຜູ້ມີສະຕິ ຍ່ອມມີຄວາມສຸກໃນທຸກສະຖານທີ່.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ເມດຕາທຳ ຄ້ຳຈູນໂລກ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ການຊະນະຕົນເອງ ດີກວ່າຊະນະສົງຄາມພັນຄັ້ງ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ຄວາມສຸກຍ່ອມເກີດຈາກຄວາມສະຫົບແຫ່ງຈິດໃຈ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ອະດີດຜ່ານໄປແລ້ວ ອນາຄົດຍັງບໍ່ເຖິງ ຈົ່ງຢູ່ກັບປັດຈຸບັນຢ່າງມີສະຕິ.", source: "- ຄຳສອນເຕືອນໃຈ -" },
    { text: "ໂກດເຂົາ ເໝືອນຈຸດໄຟເຜົາຕົນເອງ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການສ້າງບຸນກຸສົນ ເປັນອະຣິຍະຊັບຕິດຕົວໄປທຸກຊາດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ປັນຍາຍ່ອມເກີດຈາກການພິຈາລະນາ ແລະ ການຝຶກຝົນ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມກະຕັນຍູ ຮູ້ຄຸນຄົນ ເປັນເຄື່ອງໝາຍຂອງຄົນດີ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ຢ່າເບິ່ງນຳຄວາມຊົ່ວຂອງຄົນອື່ນ ຈົ່ງກວດສອບຄວາມຊົ່ວຂອງຕົນເອງ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ສີລ ຍ່ອມນຳຄວາມສຸກ ແລະ ຄວາມສະຫົບມາໃຫ້ຜູ້ປະຕິບັດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມບໍ່ມີໂຣກ ເປັນລາບອັນປະເສີດ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ຄວາມບໍລິສຸດ ແລະ ຄວາມເສົ້າໝອງ ເປັນຂອງສະເພາະຕົນ ໃຜເຮັດໃຫ້ໃຜບໍລິສຸດບໍ່ໄດ້.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຜູ້ໃຫ້ຍ່ອມເປັນທີ່ຮັກຂອງຄົນທັງຫຼາຍ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມສັນໂດດ ເປັນຊັບຢ່າງຍິ່ງ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມຄຸ້ນເຄີຍ ເປັນຍາດຢ່າງຍິ່ງ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ນິບພານ ເປັນສຸກຢ່າງຍິ່ງ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ການບໍ່ເຮັດບາບທັງປວງ ນຳມາເຊິ່ງຄວາມສະຫົບສຸກ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຜູ້ມີຄວາມເພຍຽນ ຍ່ອມລ່ວງພົ້ນຄວາມທຸກໄດ້.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ວາຈາທີ່ໄພລោះ ແລະ ເປັນຈິງ ຍ່ອມມີຄ່າກວ່າຄຳເວົ້າພັນຄຳທີ່ໄຮ້ສາລະ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ການຄົບຄົນດີ ຍ່ອມນຳພາໄປສູ່ຄວາມຈະເລີນ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການບໍ່ຄົບຄົນພານ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການບູຊາຜູ້ທີ່ຄວນບູຊາ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການລ້ຽງດູພໍ່ແມ່ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການປະຕິບັດທຳ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຈິດໃຈທີ່ຜ່ອງໃສ ຍ່ອມນຳໄປສູ່ສຸຄະຕິ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມໂກດ ຍ່ອມທຳລາຍມິດພາບ ແລະ ຄວາມສະຫົບ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມໂລບ ຍ່ອມນຳມາເຊິ່ງຄວາມທຸກບໍ່ມີທີ່ສິ້ນສຸດ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມຫຼົງ ຍ່ອມເຮັດໃຫ້ຄົນເຮົາມືດບອດຈາກຄວາມຈິງ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ສະຕິ ຍ່ອມປ້ອງກັນຈິດໃຈບໍ່ໃຫ້ຕົກໄປໃນທາງທີ່ຜິດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ສີລ 5 ເປັນເກາະປ້ອງກັນຊີວິດໃຫ້ມີຄວາມສະຫົບສຸກ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ການເວັ້ນຈາກການຂ້າສັດ ຍ່ອມນຳມາເຊິ່ງຄວາມມີອາຍຸຢືນ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ການເວັ້ນຈາກການລັກຊັບ ຍ່ອມນຳມາເຊິ່ງຄວາມປອດໄພໃນຊັບສິນ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ການເວັ້ນຈາກການປະເວນີຜິດ ຍ່ອມນຳມາເຊິ່ງຄວາມສຸກໃນຄອບຄົວ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ການເວັ້ນຈາກການເວົ້າຂີ້ຕເລື່ອນ ຍ່ອມນຳມາເຊິ່ງຄວາມນັບຖືຈາກຄົນອື່ນ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ການເວັ້ນຈາກການດື່ມສຸລາ ຍ່ອມນຳມາເຊິ່ງສະຕິປັນຍາທີ່ແຈ່ມໃສ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ຄວາມດີທີ່ເຮັດໄວ້ ຍ່ອມບໍ່ສູນຫາຍໄປໃສ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ເວລາບໍ່ເຄີຍຄອຍໃຜ ຈົ່ງຟ້າວສ້າງຄວາມດີໃນມື້ນີ້.", source: "- ຄຳສອນເຕືອນໃຈ -" },
    { text: "ຄວາມຕາຍເປັນຂອງແນ່ນອນ ແຕ່ເວລາຕາຍບໍ່ມີໃຜຮູ້.", source: "- ພິຈາລະນາມໍຣະນະສະຕິ -" },
    { text: "ທຸກສິ່ງທຸກຢ່າງເກີດຂຶ້ນ ຕັ້ງຢູ່ ແລະ ດັບໄປເປັນທຳມະດາ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ສັງຂານທັງຫຼາຍບໍ່ທ່ຽງ ຈົ່ງພິຈາລະນາດ້ວຍຄວາມບໍ່ປະໝາດ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ການອະໄພ ໃຫ້ຄວາມສະຫົບແກ່ຈິດໃຈຂອງຜູ້ໃຫ້.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ລົມຫາຍໃຈເຂົ້າອອກ ເປັນຂອງຂວັນອັນປະເສີດຂອງຊີວິດ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ຈົ່ງເປັນຜູ້ຟັງที่ดี ຫຼາຍກວ່າເປັນຜູ້ເວົ້າທີ່ໄຮ້ສາລະ.", source: "- ຄຳສອນເຕືອນໃຈ -" },
    { text: "ຄວາມອ່ອນນ້ອມຖ່ອມຕົນ ຍ່ອມນຳມາເຊິ່ງຄວາມເມດຕາຈາກຜູ້ໃຫຍ່.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມຊື່ສັດ ສຸຈະລິດ ເປັນຮາກຖານຂອງຊີວິດທີ່ດີງາມ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມຂະຫຍັນປະຢັດ ເປັນຄຸນນະທຳນຳໄປສູ່ຄວາມຮັ່ງມີ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການຮູ້ຈັກພໍ ຍ່ອມເຮັດໃຫ້ຊີວິດมีความສຸກຕາມອັດຕະພາບ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມອິດສາ ຍ່ອມທຳລາຍຄວາມສຸກຂອງຕົນເອງ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມຮັກທີ່ແທ້ຈິງ ຄືຄວາມປາດຖະໜາໃຫ້ผู້ອື່ນมีความສຸກ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມກະລຸນາ ຄືຄວາມປາດຖະໜາໃຫ້ผู້ອື່ນພົ້ນຈາກຄວາມທຸກ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ມຸທິຕາ ຄືຄວາມຍິນດີເມື່ອผู້ອື່ນໄດ້ດີ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ອຸເປກຂາ ຄືຄວາມວາງເສີຍດ້ວຍປັນຍາ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ການທຳບຸນ ບໍ່ແມ່ນພຽງແຕ່ການໃຫ້ທານ ແຕ່ລວມເຖິງການรักษาສີລ ແລະ ພາວະນາ.", source: "- ຄຳສອນພຣະທຳ -" },
    { text: "ການທຳສະມາທິ ຍ່ອມເຮັດໃຫ້ຈິດໃຈມີພະລັງ ແລະ ສະຫົບຕັ້ງມັ້ນ.", source: "- ຂໍ້ຄິດປະຕິບັດ -" },
    { text: "ປັນຍາ ຄືແສງສະຫວ່າງສ່ອງທາງໃນຄວາມມືດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມພະຍາຍາມຢູ່ທີ່ໃດ ຄວາມສຳເລັດຢູ່ທີ່ນັ້ນ.", source: "- ສຸພາສິດເຕືອນໃຈ -" },
    { text: "ອຸປະສັກ ເປັນບົດຮຽນສຳຄັນໃນການຝຶກຝົນຕົນເອງ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການຍອມຮັບຄວາມຈິງ ເປັນບາດກ້າວທຳອິດຂອງຄວາມສະຫົບ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຢ່າເອົາຄວາມສຸກຂອງຕົນເອງ ໄປຜູກໄວ້ກັບປາກຂອງຄົນອື່ນ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄຳນິນທາ ເໝືອນລົມພັດມາແລ້ວກໍ່ພັດໄປ ຢ່າເກັບມາເກັບໄວ້ໃນໃຈ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມດີທີ່ເຮັດໃນມຸມມືດ ຍ່ອມສົ່ງຜົນໃຫ້ສະຫວ່າງໃນທີ່ແຈ້ງ.", source: "- ຄຳສອນເຕືອນໃຈ -" },
    { text: "ການຟັງທຳຕາມກາລະ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການສົນທະນາທຳຕາມກາລະ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຄວາມເຄົາລົບ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຄວາມຖ່ອມຕົນ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຄວາມອົດທົນ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຄວາມເປັນຜູ້ວ່າງ່າຍ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການເຫັນສະມະນະ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ການເຮັດຈິດໃຈບໍ່ໃຫ້ຫ່ວັນໄຫວໃນໂລກກະທຳ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຈິດໃຈທີ່ໄຮ້ໂສກ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຈິດໃຈທີ່ປາດສະຈາກມົນທິນ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຈິດໃຈທີ່ເກັມເກษມ ເປັນມົງຄົນອັນປະເສີດ.", source: "- ມັງຄະລາສູດ -" },
    { text: "ຄວາມກະຕັນຍູຕໍ່ຜູ້ມີພຣະຄຸນ ຍ່ອມນຳມາເຊິ່ງຄວາມຈະເລີນຮຸ່ງເຮືອງ.", source: "- ຄຳສອນເຕືອນໃຈ -" },
    { text: "ເມື່ອມີຄວາມທຸກ ຈົ່ງໃຊ້ສະຕິ ແລະ ປັນຍາໃນການແກ້ໄຂ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຢ່າປ່ອຍໃຫ້ຄວາມໂກດ ເປັນຜູ້ຄວບຄຸມການກະທຳຂອງຕົນ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການໃຫ້ອະໄພ ຄືການປົດປ່ອຍຕົນເອງຈາກຄວາມທຸກ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຄວາມສຸກທີ່ແທ້ຈິງ ບໍ່ໄດ້ຢູ່ທີ່ວັດຖຸ ແຕ່ຢູ່ທີ່ຈິດໃຈ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຈົ່ງເປັນຜູ້ສ້າງຄວາມສຸກ ໃຫ້ແກ່ຄົນຮອບข้าง.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການມີມິດດີ ຍ່ອມພາໄປສູ່ທາງທີ່ດີ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ການຄຸ້ມຄອງທວານໃນອິນຊີ ເປັນທາງນຳໄປສູ່ຄວາມສະຫົບ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມປະໝາດ ເປັນເຄືອດທາງແຫ່ງຄວາມເສື່ອມ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຈົ່ງພິຈາລະນາຄວາມແກ່ ຄວາມເຈັບ ແລະ ຄວາມຕາຍ ເພື່ອບໍ່ໃຫ້ປະໝາດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມຮັກໃຜ່ໃນທຳ ຍ່ອມນຳມາເຊິ່ງຄວາມສຸກ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຜູ້ປະຕິບັດທຳ ຍ່ອມມີທຳມະຄຸ້ມຄອງ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມສະຫົບແຫ່ງຈິດ ຍ່ອມເກີດຈາກການລະຄວາມຢາກ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ການຝຶກຕົນເອງ ເປັນສິ່ງທີ່ປະເສີດທີ່ສຸດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມບໍ່ມີອະຄະຕິ ຍ່ອມນຳມາເຊິ່ງຄວາມຍຸຕິທຳ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ຈົ່ງໃຊ້ຊີວິດດ້ວຍຄວາມເມດຕາ ແລະ ປັນຍາໃນທຸກໆ ວັນ.", source: "- ຂໍ້ຄິດເຕືອນໃຈ -" },
    { text: "ການໃຫ້ຄວາມຮູ້ ເປັນການໃຫ້ທານອັນປະເສີດ.", source: "- ພຣະທຳມະຄຳສອນ -" },
    { text: "ຄວາມສຸກຍ່ອມຕາມຜູ້ມີຈິດໃຈດີ ເໝືອນເງົາຕາມໂຕ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ຄວາມທຸກຍ່ອມຕາມຜູ້ມີຈິດໃຈຊົ່ວ ເໝືອນລໍ້ລົດຕາມຮອບຕີນງົວ.", source: "- ພຣະພຸດທະໂອວາດ -" },
    { text: "ຄວາມບໍ່ມີໂຣກທາງໃຈ ຄືຄວາມປາດສະຈາກກິເລດ.", source: "- ພຣະທຳມະຄຳສອນ -" }
];
        function getRandomQuote(button, showNotification = true) {
            let previousQuoteIndex = -1;
            try {
                previousQuoteIndex = Number.parseInt(localStorage.getItem('last_dhamma_quote_index'), 10);
            } catch (error) {
                previousQuoteIndex = -1;
            }
            let randomIndex = Math.floor(Math.random() * QUOTES.length);
            if (QUOTES.length > 1 && randomIndex === previousQuoteIndex) {
                randomIndex = (randomIndex + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length;
            }
            try {
                localStorage.setItem('last_dhamma_quote_index', String(randomIndex));
            } catch (error) {
                // The quote can still be shown when browser storage is unavailable.
            }
            const quote = QUOTES[randomIndex];
            const localizedQuote = autoTranslations[getPreferredLanguage()]?.quotes?.[randomIndex];
            document.getElementById('dhammaText').innerText = localizedQuote || quote.text;
            document.getElementById('dhammaSource').innerText = translateText(quote.source);
            const quoteContent = document.getElementById('dhammaQuoteContent');
            quoteContent?.classList.remove('is-refreshing');
            button?.classList.remove('is-animating');
            window.requestAnimationFrame(() => {
                quoteContent?.classList.add('is-refreshing');
                button?.classList.add('is-animating');
            });
            if (showNotification) showToast("ສຸ່ມທຳມະຄຳສອນໃໝ່ແລ້ວ", "ທຳມະທານ", "fa-quote-left");
        }

        // The quote is freshly randomized whenever the page is opened. This bar simply marks
        // the passage of the temple's day and is updated in the Asia/Vientiane time zone.
        const TEMPLE_TIME_ZONE = 'Asia/Vientiane';
        const TEMPLE_TIME_ZONE_OFFSET_MS = 7 * 60 * 60 * 1000;
        const DAILY_DHAMMA_COPY = {
            lo: { progress: (percent, hours, minutes) => `ມື້ນີ້ຜ່ານໄປ ${percent}% · ເຫຼືອ ${hours} ຊົ່ວໂມງ ${minutes} ນາທີ ຈະເລີ່ມມື້ໃໝ່` },
            th: { progress: (percent, hours, minutes) => `วันนี้ผ่านไป ${percent}% · เหลือ ${hours} ชั่วโมง ${minutes} นาที จะเริ่มวันใหม่` },
            en: { progress: (percent, hours, minutes) => `${percent}% of today has passed · ${hours}h ${minutes}m until a new day` }
        };

        function getTempleDateParts(date = new Date()) {
            const parts = new Intl.DateTimeFormat('en-CA', {
                timeZone: TEMPLE_TIME_ZONE,
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
            }).formatToParts(date);
            return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
        }

        function updateDailyDhammaProgress() {
            const text = document.getElementById('dhammaDayProgressText');
            const bar = document.getElementById('dhammaDayProgressBar');
            const progress = document.querySelector('.daily-dhamma-progress');
            if (!text || !bar || !progress) return;

            const templeTime = getTempleDateParts();
            const elapsedSeconds = (templeTime.hour * 3600) + (templeTime.minute * 60) + templeTime.second;
            const percentage = Math.min(100, (elapsedSeconds / 86400) * 100);
            const secondsLeft = Math.max(0, 86400 - elapsedSeconds);
            const hoursLeft = Math.floor(secondsLeft / 3600);
            const minutesLeft = Math.floor((secondsLeft % 3600) / 60);
            const language = getPreferredLanguage();
            const copy = DAILY_DHAMMA_COPY[language] || DAILY_DHAMMA_COPY.lo;

            text.textContent = copy.progress(Math.floor(percentage), hoursLeft, minutesLeft);
            bar.style.width = `${percentage}%`;
            progress.setAttribute('aria-valuenow', String(Math.round(percentage)));
        }

        // Edit this schedule when the temple confirms a special event. Times use the local
        // temple time zone (Asia/Vientiane). The weekly meditation entry keeps the countdown
        // accurate year-round without needing to update a stale calendar date by hand.
        // Confirmed annual merit festivals for 2026. The cards on the website describe
        // each observance as an all-day event; the temple will announce ceremony times separately.
        const TEMPLE_EVENT_SCHEDULE = [
            {
                id: 'boun-khao-padap-din-2026',
                type: 'fixed',
                start: '2026-09-11T00:00:00+07:00',
                allDay: true,
                title: { lo: 'ບຸນເຂົ້າປະດັບດິນ', th: 'บุญข้าวประดับดิน', en: 'Boun Khao Padap Din' },
                location: { lo: 'ວັດເຊກະໝານກາງ, ບ້ານໃຫຍ່ເຊກະໝານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື', th: 'วัดเซกะมานกาง บ้านใหญ่เซกะมาน เมืองสามัคคีไช แขวงอัตตะปือ สปป.ลาว', en: 'Wat Xekaman Kang, Ban Yai Xekaman, Samakkhixay, Attapeu, Laos' }
            },
            {
                id: 'boun-khao-salak-2026',
                type: 'fixed',
                start: '2026-09-26T00:00:00+07:00',
                allDay: true,
                title: { lo: 'ບຸນເຂົ້າສະຫຼາກ', th: 'บุญข้าวสลาก', en: 'Boun Khao Salak' },
                location: { lo: 'ວັດເຊກະໝານກາງ, ບ້ານໃຫຍ່ເຊກະໝານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື', th: 'วัดเซกะมานกาง บ้านใหญ่เซกะมาน เมืองสามัคคีไช แขวงอัตตะปือ สปป.ลาว', en: 'Wat Xekaman Kang, Ban Yai Xekaman, Samakkhixay, Attapeu, Laos' }
            },
            {
                id: 'boun-ork-phansa-2026',
                type: 'fixed',
                start: '2026-10-26T00:00:00+07:00',
                allDay: true,
                title: { lo: 'ບຸນອອກພັນສາ', th: 'บุญออกพรรษา', en: 'Boun Ork Phansa' },
                location: { lo: 'ວັດເຊກະໝານກາງ, ບ້ານໃຫຍ່ເຊກະໝານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື', th: 'วัดเซกะมานกาง บ้านใหญ่เซกะมาน เมืองสามัคคีไช แขวงอัตตะปือ สปป.ลาว', en: 'Wat Xekaman Kang, Ban Yai Xekaman, Samakkhixay, Attapeu, Laos' }
            }
        ];

        const COUNTDOWN_COPY = {
            lo: { eyebrow: 'ກິດຈະກຳຖັດໄປ', days: 'ມື້', hours: 'ຊົ່ວໂມງ', minutes: 'ນາທີ', seconds: 'ວິນາທີ', at: 'ເວລາວຽງຈັນ' },
            th: { eyebrow: 'กิจกรรมถัดไป', days: 'วัน', hours: 'ชม.', minutes: 'นาที', seconds: 'วินาที', at: 'เวลาเวียงจันทน์' },
            en: { eyebrow: 'NEXT TEMPLE ACTIVITY', days: 'days', hours: 'hours', minutes: 'mins', seconds: 'secs', at: 'Vientiane time' }
        };

        function templeDateFromParts(year, month, day, hour, minute) {
            return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - TEMPLE_TIME_ZONE_OFFSET_MS);
        }

        function getEventStart(event, now = new Date()) {
            if (event.type === 'fixed') return new Date(event.start);

            const templeToday = getTempleDateParts(now);
            const currentDate = new Date(Date.UTC(templeToday.year, templeToday.month - 1, templeToday.day));
            const daysUntilEvent = (event.weekday - currentDate.getUTCDay() + 7) % 7;
            let start = templeDateFromParts(templeToday.year, templeToday.month, templeToday.day + daysUntilEvent, event.hour, event.minute);
            if (start <= now) start = templeDateFromParts(templeToday.year, templeToday.month, templeToday.day + daysUntilEvent + 7, event.hour, event.minute);
            return start;
        }

        function getUpcomingTempleEvent(now = new Date()) {
            return TEMPLE_EVENT_SCHEDULE
                .map(event => ({ ...event, start: getEventStart(event, now) }))
                .filter(event => !Number.isNaN(event.start.getTime()) && event.start > now)
                .sort((a, b) => a.start - b.start)[0];
        }

        function formatTempleEventDate(event, language) {
            const locale = { lo: 'lo-LA', th: 'th-TH', en: 'en-GB' }[language] || 'lo-LA';
            const date = new Intl.DateTimeFormat(locale, {
                timeZone: TEMPLE_TIME_ZONE,
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).format(event.start);

            if (event.allDay) {
                return date + ' · ' + (event.location[language] || event.location.lo);
            }

            const startTime = new Intl.DateTimeFormat(locale, {
                timeZone: TEMPLE_TIME_ZONE,
                hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
            }).format(event.start);
            return date + ' · ' + startTime + (event.endTime ? '–' + event.endTime : '') + ' · ' + (event.location[language] || event.location.lo);
        }

        function setCountdownValue(id, value) {
            const element = document.getElementById(id);
            if (element) element.textContent = String(value).padStart(2, '0');
        }

        function updateEventCountdown() {
            const now = new Date();
            const event = getUpcomingTempleEvent(now);
            if (!event) return;

            const language = getPreferredLanguage();
            const copy = COUNTDOWN_COPY[language] || COUNTDOWN_COPY.lo;
            const difference = Math.max(0, event.start.getTime() - now.getTime());
            const days = Math.floor(difference / 86400000);
            const hours = Math.floor((difference % 86400000) / 3600000);
            const minutes = Math.floor((difference % 3600000) / 60000);
            const seconds = Math.floor((difference % 60000) / 1000);

            document.getElementById('nextEventEyebrow').textContent = copy.eyebrow;
            document.getElementById('nextEventTitle').textContent = event.title[language] || event.title.lo;
            const eventTimeLabel = event.allDay ? ({ lo: 'ຕະຫຼອດມື້', th: 'ตลอดวัน', en: 'All day' }[language] || 'ຕະຫຼອດມື້') : copy.at;
            document.getElementById('nextEventDate').textContent = `${formatTempleEventDate(event, language)} · ${eventTimeLabel}`;
            [['countdownDays', days], ['countdownHours', hours], ['countdownMinutes', minutes], ['countdownSeconds', seconds]].forEach(([id, value]) => setCountdownValue(id, value));
            [['countdownDaysLabel', copy.days], ['countdownHoursLabel', copy.hours], ['countdownMinutesLabel', copy.minutes], ['countdownSecondsLabel', copy.seconds]].forEach(([id, label]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = label;
            });
        }

        const THEME_TOGGLE_COPY = {
            lo: { dark: 'ເປີດໂໝດກາງຄືນ', light: 'ກັບສູ່ໂໝດກາງວັນ' },
            th: { dark: 'เปิดโหมดกลางคืน', light: 'กลับสู่โหมดกลางวัน' },
            en: { dark: 'Use dark mode', light: 'Use light mode' }
        };

        function updateThemeToggle() {
            const button = document.getElementById('themeToggle');
            const icon = document.getElementById('themeToggleIcon');
            if (!button || !icon) return;
            const isDark = document.documentElement.classList.contains('dark-mode');
            const language = getPreferredLanguage();
            const copy = THEME_TOGGLE_COPY[language] || THEME_TOGGLE_COPY.lo;
            const label = isDark ? copy.light : copy.dark;
            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', label);
            button.title = label;
            icon.className = `fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`;
        }

        function toggleTempleTheme() {
            const isDark = !document.documentElement.classList.contains('dark-mode');
            document.documentElement.classList.toggle('dark-mode', isDark);
            try { localStorage.setItem('temple_theme', isDark ? 'dark' : 'light'); } catch (error) {}
            updateThemeToggle();
        }

        function initThemeToggle() {
            const button = document.getElementById('themeToggle');
            if (!button) return;
            button.addEventListener('click', toggleTempleTheme);
            updateThemeToggle();
        }

        const ACTIVITY_NOTICE_COPY = {
            lo: { title: 'ແຈ້ງເຕືອນກິດຈະກຳໃໝ່', message: 'ກະລຸນາກຽມຮ່ວມກິດຈະກຳ' },
            th: { title: 'แจ้งเตือนกิจกรรมใหม่', message: 'ขอเชิญเตรียมร่วมกิจกรรม' },
            en: { title: 'New activity reminder', message: 'You are warmly invited to join' }
        };

        function notifyUpcomingActivity() {
            const event = getUpcomingTempleEvent();
            if (!event) return;
            const marker = `temple_activity_notice_${event.id || event.title.lo}_${event.start.toISOString().slice(0, 10)}`;
            try {
                if (sessionStorage.getItem(marker)) return;
                sessionStorage.setItem(marker, 'seen');
            } catch (error) {}
            const language = getPreferredLanguage();
            const copy = ACTIVITY_NOTICE_COPY[language] || ACTIVITY_NOTICE_COPY.lo;
            window.setTimeout(() => {
                const title = event.title[language] || event.title.lo;
                showToast(`${copy.message}: ${title} · ${formatTempleEventDate(event, language)}`, copy.title, 'fa-calendar-days');
            }, 1100);
        }

        function copyDhammaQuote() {
            const text = document.getElementById('dhammaText').innerText + " " + document.getElementById('dhammaSource').innerText;
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            showToast("ຄັດລອກຂໍ້ຄວາມທຳມະຄຳສອນສຳເລັດແລ້ວ!", "ຄັດລອກແລ້ວ", "fa-copy");
        }

        function copyAccountNo(currency) {
            const accounts = {
                lak: { number: '040-12-00-01285365-001', label: 'LAK' },
                thb: { number: '0801231883147', label: 'THB' }
            };
            const account = accounts[currency] || accounts.lak;
            const successMessage = `ຄັດລອກເລກບັນຊີ ${account.label}: ${account.number} ສຳເລັດແລ້ວ!`;

            const finishCopy = () => showToast(successMessage, 'ຄັດລອກແລ້ວ', 'fa-copy');
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(account.number).then(finishCopy).catch(() => copyAccountNoFallback(account.number, finishCopy));
                return;
            }
            copyAccountNoFallback(account.number, finishCopy);
        }

        function copyAccountNoFallback(accountNumber, onSuccess) {
            const field = document.createElement('textarea');
            field.value = accountNumber;
            field.setAttribute('readonly', '');
            field.style.position = 'fixed';
            field.style.opacity = '0';
            document.body.appendChild(field);
            field.select();
            document.execCommand('copy');
            field.remove();
            onSuccess();
        }

const CONTACT_MIN_FILL_TIME_MS = 3000;
const CONTACT_SUBMISSION_COOLDOWN_MS = 60000;

function resetContactFormTimer(form) {
    if (form) form.dataset.openedAt = String(Date.now());
}

function initContactFormProtection() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    resetContactFormTimer(form);
    form.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
    e.preventDefault();

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyRNp_doGL4rXXaGYJWxE8KgLB_DJiJ5cx-EMn6qxmcSJdLcPdqP4AdFudpmV406Rxo5A/exec';

    const form = e.target;
    const now = Date.now();
    const openedAt = Number(form.dataset.openedAt || 0);
    const honeypot = form.elements.website?.value.trim();
    let lastSubmissionAt = 0;
    try { lastSubmissionAt = Number(localStorage.getItem('contact_last_submission_at') || 0); } catch (error) {}

    if (honeypot) {
        form.reset();
        resetContactFormTimer(form);
        return;
    }
    if (!openedAt || now - openedAt < CONTACT_MIN_FILL_TIME_MS) {
        showToast('ກະລຸນາລໍຖ້າອີກຄູ່ໜຶ່ງແລ້ວລອງສົ່ງໃໝ່', 'ກວດສອບຂໍ້ຄວາມ', 'fa-shield-halved');
        return;
    }
    if (now - lastSubmissionAt < CONTACT_SUBMISSION_COOLDOWN_MS) {
        showToast('ກະລຸນາລໍຖ້າ 1 ນາທີ ກ່ອນສົ່ງຂໍ້ຄວາມອີກຄັ້ງ', 'ສົ່ງຖີ່ເກີນໄປ', 'fa-clock');
        return;
    }
    try { localStorage.setItem('contact_last_submission_at', String(now)); } catch (error) {}

    const inputs = form.querySelectorAll('input');
    const textarea = form.querySelector('textarea');

    const formData = {
        name: inputs[0] ? inputs[0].value : '',
        phone: inputs[1] ? inputs[1].value : '',
        subject: inputs[2] ? inputs[2].value : '',
        message: textarea ? textarea.value : '',
        consent: form.elements.contactConsent?.checked || false
    };

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        showToast("ສົ່ງຂໍ້ຄວາມສຳເລັດແລ້ວ!", "ສົ່ງຂໍ້ຄວາມສຳເລັດ", "fa-paper-plane");
        
        // ລ້າງຂໍ້ຄວາມໃນช่องກອກທັງໝົດ
        if (typeof form.reset === 'function') {
            form.reset();
        }
        inputs.forEach(input => input.value = '');
        if (textarea) textarea.value = '';
        resetContactFormTimer(form);
    })
    .catch(error => {
        showToast("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່", "ສົ່ງບໍ່ສຳເລັດ", "fa-exclamation-triangle");
        console.error('Error!', error.message);
    });
}
        // 1. ฟังก์ชันแชร์ลง Facebook
function shareToFacebook() {
    try {
        var textEl = document.getElementById('dhammaText');
        var sourceEl = document.getElementById('dhammaSource');
        
        var text = textEl ? textEl.innerText.trim() : '';
        var source = sourceEl ? sourceEl.innerText.trim() : '';
        var pageUrl = window.location.href;

        // รวมข้อความคำสอนและแหล่งที่มา
        var shareContent = text + (source ? " " + source : "");

        // สร้าง Link สำหรับแชร์ลง Facebook
        var facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + 
                          encodeURIComponent(pageUrl) + 
                          "&quote=" + encodeURIComponent(shareContent);

        // เปิด Pop-up หน้าแชร์ Facebook
        window.open(facebookUrl, '_blank', 'width=600,height=500,location=no,menubar=no,status=no,toolbar=no');
    } catch (err) {
        console.error("Facebook Share Error:", err);
    }
}

// 2. ฟังก์ชันส่งทาง WhatsApp
function shareToWhatsApp() {
    try {
        var textEl = document.getElementById('dhammaText');
        var sourceEl = document.getElementById('dhammaSource');
        
        var text = textEl ? textEl.innerText.trim() : '';
        var source = sourceEl ? sourceEl.innerText.trim() : '';
        var pageUrl = window.location.href;

        // จัดรูปแบบข้อความ WhatsApp (มีตัวหนาและลิงก์อ่านเพิ่มเติม)
        var message = "*" + text + "*\n" + (source ? source + "\n" : "") + "\n" + translateText("📖 ອ່ານຄຳສອນເພີ່ມເຕີມ:") + " " + pageUrl;

        // สร้าง Link สำหรับส่ง WhatsApp
        var whatsappUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);

        // เปิดแอปพลิเคชัน WhatsApp หรือเว็บ WhatsApp
        window.open(whatsappUrl, '_blank');
    } catch (err) {
        console.error("WhatsApp Share Error:", err);
    }
}

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        /* Initial Setup */
        window.onload = function() {
            renderDevotees();
        };
         // =========================================================================
// ระบบสลับภาษา 2 ภาษา (🇱🇦 ພາສາລາວ / 🇬🇧 English)
// =========================================================================

// 1. คลังคำแปลเปรียบเทียบภาษาอังกฤษจากข้อความเดิมภาษาลาว
const autoTranslations = {
    en: {
        // แถบประกาศด้านบนสุด (Top Bar)
        "ຂໍຕ້ອນຮັບສູ່": "Welcome to",
        "ວັດເຊກະພານກາງ": "Wat Sekaman Kang",
        "ຍິນດີຕ້ອນຮັບທຸກທ່ານ": "Welcome all visitors",
        "ຟັງສຽງຮັງ": "Listen Bell",
        "ຟັງສຽງກອງ": "Listen Gong",
        "ວັນພຣະຕໍ່ໄປ: 15 ຄ່ຳ": "Next Monk Day: 15th Moon",

        // เมนูนำทาง (Header / Navbar)
        "ບ້ານເຊກະພານ, ເມືອງ ສາມັກຄີໄຊ, ແຂວງ ອັດຕະປື": "Sekaman Village, Samakkixay District, Attapeu",
        "ໜ້າຫຼັກ": "Home",
        "ກ່ຽວກັບວັດ": "About Us",
        "ກິດຈະກຳວັດ": "Activities",
        "ຮ່ວມບໍລິຈາກ/ທຳບຸນ": "Donation",
        "ຕິດຕໍ່ເຮົາ": "Contact Us",

        // ส่วนต้อนรับหลัก (Hero Section)
        "ສູນລວມຈິດໃຈ ແລະ ພຣະພຸດທະສາສະໜາ": "Center of Buddhist Faith",
        "ບ້ານເຊກະພານ, ເມືອງ ສາມັກຄີໄຊ, ແຂວງ ອັດຕະປື, ສປປ ລາວ": "Sekaman Village, Samakkixay District, Attapeu Province, Laos",
        "ເຂົ້າເບິ່ງທ່ານຮູບສະມາຊິກພາຍໃນວັດ": "View Organization Structure",

        // ส่วนประวัติความเป็นมา (About Section)
        "ກ່ຽວກັບເຮົາ": "ABOUT US",
        "ປະຫວັດຄວາມເປັນມາຂອງວັດ": "History of the Temple",
        "ວັດເຊກະພານກາງ ຕັ້ງຢູ່ບ້ານເຊກະພານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື, ສປປ ລາວ ເປັນສາສະນະສະຖານທີ່ສຳຄັນອັນເປັນສູນລວມຈິດໃຈຂອງພຸດທະສາສະນິກະຊົນໃນເຂດລຸ່ມນ້ຳເຊກະພານ.": "Wat Sekaman Kang is located in Sekaman Village, Samakkixay District, Attapeu Province, Laos. It is a major Buddhist temple serving as a spiritual sanctuary for local communities.",
        "ວັດแห่งນີ້ເປັນສູນກາງໃນການປະກອບພິທີກຳທາງພຣະພຸດທະສາສະໜາ, ອົບຮົມສັ່ງສອນສີລະທຳ, ຕະຫຼອດຮອດການສືບສານປະເພນີອັນດີງາມຂອງທ້ອງຖິ່ນໃຫ້ຄົງຢູ່ສືບໄປ.": "The temple serves as a center for religious ceremonies, moral teachings, and preserving local cultural traditions for future generations.",

        // ส่วนทำบุญ / บริจาค (Donation Section)
        "ຮ່ວມທຳບຸນ": "DONATION",
        "ຮ່ວມທຳບຸນ / ບໍລິຈາກສ້າງບຳລຸງວັດ": "Make a Donation / Merit Making",
        "ເຊີນຊວນພຸດທະສາສະນິກະຊົນຮ່ວມທຳບຸນສົມທົບທຶນຕາມກຳລັງສັດທາ ເພື່ອບູລະນະປະຕິສັງຂອນ ແລະ ພັດທະນາວັດເຊກະພານກາງ.": "We invite Buddhists to contribute according to their faith for the renovation and development of Wat Sekaman Kang.",
        "ບັນຊີ ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)": "Banque Pour Le Commerce Exterieur Lao (BCEL)",
        "ຊື່ບັນຊີ: ວັດເຊກະພານກາງ ( Wat Sekaman Kang )": "Account Name: Wat Sekaman Kang",

        // ส่วนติดต่อและแผนที่ (Contact & Map Section)
        "LOCATION & CONTACT": "LOCATION & CONTACT",
        "ຕິດຕໍ່ເຮົາ & ແຜນທີ່ການເດີນທາງ": "Contact Us & Location Map",
        "ທີ່ຢູ່": "Address",
        "ໂທລະສັບ / WhatsApp": "Phone / WhatsApp",
        "ອີເມວ": "Email",
        "ເບິ່ງແຜນທີ່ຕຳແໜ່ງວັດ": "View Location Map",

        // ส่วนฟอร์มส่งข้อความ (Contact Form)
        "ສົ່ງຂໍ້ຄວາມ ຫຼື ສອບຖາມຂໍ້ມູນ": "Send Us a Message",
        "ຊື່ ແລະ ນາມສະກຸນ": "Full Name",
        "ເບີໂທລະສັບ": "Phone Number",
        "ຂໍ້ຄວາມທີ່ຕ້ອງການສົ່ງ": "Message",
        "ສົ່ງຂໍ້ຄວາມ": "Send Message",
        "ຕົວຢ່າງ: ທ່ານ ສົມໄຊ": "e.g. Mr. Somchai",
        "020 XXXXXXXX": "020 XXXXXXXX",
        "ພິມຂໍ້ຄວາມຂອງທ່ານຢູ່ທີ່ນີ້...": "Type your message here...",

        // ป๊อปอัปแผนที่ (Map Modal)
        "ແຜນທີ່ ແລະ ການເດີນທາງ": "Map & Directions",
        "ແຜນທີ່ຕຳແໜ່ງ ອັດຕະປື ເຊກະພານ": "Attapeu Sekaman Location Map",
        "ທ່ານສາມາດເດີນທາງຕາມເສັ້ນທາງຫຼັກເລກທີ 16A ແຄມນ້ຳເຊກະພານ.": "You can travel along Route 16A along the Sekaman River.",
        "ນຳທາງດ້ວຍ Google Maps": "Navigate with Google Maps",
        "ປິດ": "Close",

        // ส่วนท้ายเว็บ (Footer)
        "© 2026 ວັດເຊກະພານກາງ ( Wat Sekaman Kang ). ສະຫງວນລິຂະສິດທັງໝົດ.": "© 2026 Wat Sekaman Kang. All rights reserved."
    },
    th: {}
};

// Complete English translation set for every built-in interface string.
// User-entered names and wishes are intentionally kept as entered.
Object.assign(autoTranslations.en, {
    "ວັດເຊກະໝານກາງ - Wat Xekaman Kang": "Wat Xekaman Kang",
    "ແຈ້ງເຕືອນ": "Notification",
    "ຕົກລົງ / ປິດ": "OK / Close",
    "ວັດເຊກະໝານກາງ": "Wat Xekaman Kang",
    "ວັດເຊກະພານກາງ": "Wat Xekaman Kang",
    "ປະຫວັດຄວາມເປັນມາ": "History",
    "ສິ່ງສັກສິດ": "Sacred Sites",
    "ໄຕ້ທຽນອອນໄລນ໌": "Online Candle Offering",
    "ທຳມະຄຳສອນ": "Dhamma Teachings",
    "ກິດຈະກຳ-ງານບຸນ": "Activities & Festivals",
    "ຕິດຕໍ່-ແຜນທີ່": "Contact & Map",
    "ຮ່ວມເຮັດບຸນ": "Make Merit",
    "ຮ່ວມເຮັດບຸນບໍລິຈາກ": "Make Merit & Donate",
    "ສາທຸ ສາທຸ ສາທຸ - ຍິນດີຕ້ອນຮັບສູ່ດິນແດນແຫ່ງທຳ": "Sadhu, Sadhu, Sadhu — welcome to the land of Dhamma",
    "ສູນລວມຈິດໃຈ, ທຳມະທານ, ມໍລະດົກທາງສະຖາປັດຕະຍະກຳ ແລະ ຄວາມສະຫງົບສຸກແຫ່ງລຸ່ມນ້ຳເຊກະໝານ": "A center of faith, Dhamma, architectural heritage, and peace along the Sekaman River",
    "ໄຕ້ທຽນ & ຖວາຍດອກບົວ": "Light a Candle & Offer a Lotus",
    "ອ່ານປະວັດຄວາມເປັນມາ": "Read Our History",
    "ຕັກບາດເຊົ້າ": "Morning Alms Offering",
    "ທຸກໆເຊົ້າ ເວລາ 06:00 ໂມງ": "Every morning at 6:00 AM",
    "ທຳວັດສູດມົນ": "Morning and Evening Chanting",
    "ເຊົ້າ 07:00 | ແລງ 18:00": "Morning 7:00 AM | Evening 6:00 PM",
    "ປະຕິບັດທຳ & ສະມາທິ": "Dhamma Practice & Meditation",
    "ທຸກໆວັນສີນ ແລະ ວັນອາທິດ": "Every observance day and Sunday",
    "ປະຫວັດຄວາມເປັນມາ ວັດເຊກະໝານກາງ": "History of Wat Xekaman Kang",
    "ປີ ແຫ່ງຄວາມສັດທາ": "Years of Faith",
    "ຕັ້ງຢູ່ແຄມນ້ຳເຊກະໝານ ດິນແດນອຸດົມສົມບູນດ້ວຍທຳມະຊາດ ແລະ ວັດທະນະທຳອັນງົດງາມ. ເປັນວັດເກົ່າແກ່ທີ່ສ້າງຂຶ້ນໂດຍຄວາມສັດທາຮ່ວມກັນຂອງພຸດທະສາສະນິກະຊົນ ເພື່ອເປັນສູນລວມຈິດໃຈ, ບ່ອນອົບຮົມສີລະທຳ ແລະ ບ່ອນສຶກສາພຣະທຳຄຳສອນຂອງອົງພຣະສຳມາສຳພຸດທະເຈົ້າ.": "Situated beside the Sekaman River in a land rich in nature and culture, this historic temple was built through the shared faith of Buddhists as a spiritual center, a place for moral training, and a place to study the Buddha's teachings.",
    "ຊື່ຂອງວັດ \"ເຊກະໝານກາງ\" ມີທີ່ມາຈາກທີ່ຕັ້ງທີ່ຢູ່ເຄິ່ງກາງຂອງລຸ່ມນ້ຳເຊກະໝານ ເຊິ່ງເປັນສາຍນ້ຳຫຼັກທີ່ລ້ຽງຊີວິດປະຊາຊົນ. ພຣະອຸໂບສົດ ແລະ ສິ່ງກໍ່ສ້າງພາຍໃນວັດໄດ້ຮັບການອອກແບບຕາມສະຖາປັດຕະຍະກຳລາວອັນເປັນເອກະລັກ ມີຊໍ່ຟ້າ, ໃບລະກາ, ແລະ ລວດລາຍກົບກຽວຢ່າງອ່ອນຊ້ອຍ.": "The name ‘Xekaman Kang’ comes from the temple's location in the middle of the Sekaman River basin, a vital waterway for the community. Its ordination hall and buildings feature distinctive Lao architecture, with elegant roof finials, decorative gables, and intricate carved motifs.",
    "ປັດຈຸບັນ, ວັດເຊກະໝານກາງ ບໍ່ພຽງແຕ່ເປັນສະຖານທີ່ປະກອບພິທີທາງສາສະໜາເທົ່ານັ້ນ, ແຕ່ຍັງເປັນສູນອະນຸລັກສິລະປະວັດທະນະທຳລາວ, ສະຖານທີ່ປະຕິບັດທຳຂອງປະຊາຊົນ ແລະ ຕ້ອນຮັບແຂກບ້ານແຂກເມືອງທີ່ມາຢ້ຽມຢາມດ້ວຍຄວາມອົບອຸ່ນ.": "Today, Wat Xekaman Kang is not only a place for religious ceremonies; it also preserves Lao arts and culture, supports Dhamma practice, and warmly welcomes visitors.",
    "ທຳມະຊາດຮົມເຢັນ": "Peaceful Nature",
    "ຕັ້ງຢູ່ຕິດແຄມນ້ຳ": "Located by the riverside",
    "ສູນຮວມສັດທາ": "Center of Faith",
    "ຮັກສາປະເພນີອັນດີງາມ": "Preserving fine traditions",
    "ສິ່ງສັກສິດ ແລະ ສາສະນະສະຖານ": "Sacred Sites and Religious Buildings",
    "ຊົມຄວາມງາມຂອງສະຖາປັດຕະຍະກຳ ແລະ ສິ່ງສັກສິດຄູ່ບ້ານຄູ່ເມືອງພາຍໃນວັດເຊກະໝານກາງ": "Discover the beauty of the temple's architecture and its community's sacred treasures",
    "ສາສະນະສະຖານຫຼັກ": "Main Religious Building",
    "ພາບຖ່າຍມຸມກວ້າງຂອງວັດເຊກະໝານກາງ ສູນລວມສັດທາແຄມນ້ຳເຊກະໝານ": "A panoramic view of Wat Xekaman Kang, a center of faith by the Sekaman River",
    "ພຣະອຸໂບສົດ": "Ordination Hall",
    "ພຣະອຸໂບສົດ (ສິມ)": "Ordination Hall (Sim)",
    "ພຣະອຸໂບສົດສຸວັນນະພູມ ອອກແບບດ້ວຍຊ່າງຝີມືລາວ, ມີຫຼັງຄາຊ້ອນຊັ້ນອັນສົມສ່ວນ ພ້ອມລວດລາຍແກະສະຫຼັກຄຳ": "The Suwannaphum Ordination Hall was designed by Lao artisans, with harmonious tiered roofs and golden carved motifs.",
    "ພຣະອຸໂບສົດສຸວັນນະພູມ ອອກແບບດ້ວຍຊ່າງຝີມືລາວ, ມີຫຼັງຄາຊ້ອນຊັ້ນອັນສົມສ່ວນ ພ້ອມລວດລາຍແກະສະຫຼັກຄຳທີ່ສະທ້ອນຄວາມຮຸ່ງເຮືອງທາງພຸດທະສາສະໜາ.": "The Suwannaphum Ordination Hall was crafted by Lao artisans, with harmonious tiered roofs and golden carvings that reflect the splendor of Buddhism.",
    "ຕັ້ງຢູ່ໃຈກາງຂອງວັດ": "Located at the heart of the temple",
    "ພຣະປະທານ": "Principal Buddha Image",
    "ພຣະພຸດທະເຊກະໝານ": "Xekaman Buddha Image",
    "ພຣະພຸດທະຮູບປະທານອົງໃຫຍ່ ຫຼໍ່ດ້ວຍທອງສຳລິດ ປາງມາຣະວິໄຊ ມີພຣະພັກອັນສະຫງົບເຢັນ ເປັນທີ່ເຄົາລົບສັກກະຣະບູຊາ": "A large bronze Buddha image in the Mara-vijaya posture, with a serene expression, revered by worshippers.",
    "ພຣະພຸດທະຮູບປະທານອົງໃຫຍ່ ຫຼໍ່ດ້ວຍທອງສຳລິດ ປາງມາຣະວິໄຊ ມີພຣະພັກອັນສະຫງົບເຢັນ ເປັນທີ່ເຄົາລົບສັກກະຣະບູຊາຂອງຊາວບ້ານ ແລະ ອາຄັນຕຸກະ.": "A large bronze principal Buddha image in the Mara-vijaya posture, with a serene expression, revered by local people and visitors.",
    "ປະທັບໃນພຣະອຸໂບສົດ": "Enshrined in the Ordination Hall",
    "ຫໍພຣະໄຕປິດົກ": "Tripitaka Library",
    "ຫໍໄຕກາງນ້ຳ": "Waterside Scripture Library",
    "ຫໍເກບໄພລານ ແລະ ຄຳພີພຣະໄຕປິດົກໂບຮານ ຕັ້ງຢູ່ແຄມນ້ຳເຊກະໝານ ເພື່ອປ້ອງກັນປວກ ແລະ ແມງໄມ້": "A riverside repository for palm-leaf manuscripts and ancient Tripitaka scriptures, built to protect them from termites and insects.",
    "ຫໍເກບໄພລານ ແລະ ຄຳພີພຣະໄຕປິດົກໂບຮານ ຕັ້ງຢູ່ແຄມນ້ຳເຊກະໝານ ເພື່ອປ້ອງກັນປວກ ແລະ ແມງໄມ້, ອຸດົມດ້ວຍຄຳສອນອັນລຳ້ຄ່າ.": "A riverside repository for palm-leaf manuscripts and ancient Tripitaka scriptures, designed to protect them from termites and insects and preserve their invaluable teachings.",
    "ບ່ອນເກັບຮັກສາຄຳພີໂບຮານ": "Repository of ancient scriptures",
    "ໄຕ້ທຽນ & ຖວາຍດອກບົວອອນໄລນ໌": "Light a Candle & Offer a Lotus Online",
    "ສົ່ງຜົນບຸນ ແລະ ຄຳອະທິຖານຂອງທ່ານ ເພື່ອຄວາມສົມຫວັງ, ຄວາມສະຫງົບສຸກ ແລະ ເປັນສິຣິມົງຄົນແກ່ຊີວິດ": "Offer your merit and prayer for fulfillment, peace, and blessings in life",
    "ກະລຸນາປ້ອນຊື່ ແລະ ຄຳອະທິຖານ ຈາກນັ້ນກົດປຸ່ມ \"ໄຕ້ທຽນ & ຖວາຍດອກບົວ\"": "Enter your name and prayer, then select ‘Light a Candle & Offer a Lotus’.",
    "ຊື່ ແລະ ນາມສະກຸນ ຜູ້ຮ່ວມເຮັດບຸນ": "Full Name of the Merit Maker",
    "ຕົວຢ່າງ: ທ່ານ ທອງດີ + ຄອບຄົວ": "e.g. Mr. Thongdy + family",
    "ເລືອກສີດອກບົວຖວາຍ": "Choose a Lotus Color",
    "🌸 ດອກບົວສີຊົມພູ (ຄວາມເມດຕາ & ຄວາມຮັກ)": "🌸 Pink lotus (kindness & love)",
    "🪷 ດອກບົວສີຂາວ (ຄວາມບໍລິສຸດ & ປັນຍາ)": "🪷 White lotus (purity & wisdom)",
    "🌼 ດອກບົວສີເຫຼືອງ (ຄວາມຈະເລີນຮຸ່ງເຮືອງ)": "🌼 Yellow lotus (prosperity)",
    "ຄຳອະທິຖານ / ຂໍພອນ": "Prayer / Blessing Request",
    "ຂໍໃຫ້ຄອບຄົວມີຄວາມສຸກ, ສຸຂະພາບແຂງແຮງ, ປາສະຈາກໂຣກໄພໄຂ້ເຈັບ...": "May my family be happy, healthy, and free from illness...",
    "ລາຍຊື່ຜູ້ໄຕ້ທຽນຖວາຍດອກບົວບໍ່ດົນມານີ້": "Recent Candle and Lotus Offerings",
    "ລຶບປະວັດ": "Clear History",
    "ທຳມະຄຳສອນປະຈຳວັນ": "Daily Dhamma Teaching",
    "\"ຄວາມເວັ້ນຈາກບາບທັງປວງ, ການຍັງກຸສົນໃຫ້ເຖິງພ້ອມ, ການເຮັດຈິດໃຈຂອງຕົນໃຫ້ຜ່ອງໃສ ນີ້ແມ່ນຄຳສອນຂອງພຣະພຸດທະເຈົ້າທັງຫຼາຍ.\"": "‘Avoid all evil, cultivate good, and purify your mind — this is the teaching of all Buddhas.’",
    "- ພຣະທຳມະຄຳສອນ ໂອວາດປາຕິໂມກ -": "— Ovada Patimokkha —",
    "ສຸ່ມຄຳສອນໃໝ່": "New Random Teaching",
    "ຄັດລອກຂໍ້ຄວາມ": "Copy Text",
    "ແບ່ງປັນ Facebook": "Share on Facebook",
    "ສົ່ງທາງ WhatsApp": "Send via WhatsApp",
    "ງານບຸນປະເພນີ ແລະ ຕາຕະລາງກິດຈະກຳ": "Traditional Festivals & Activity Schedule",
    "ຂໍເຊີນຊວນສັດທາສາທຸຊົນທັງຫຼາຍ ຮ່ວມງານບຸນປະເພນີປະຈຳປີ ແລະ ກິດຈະກຳທາງສາສະໜາ": "All devotees are invited to join our annual traditional festivals and religious activities.",
    "ງານບຸນປະຈຳປີ": "Annual Festival",
    "ເດືອນ 11 ລາວ": "11th Lao lunar month",
    "ງານບຸນອອກພັນສາ & ລອຍກະໂທງ": "End of Buddhist Lent & Floating Lantern Festival",
    "ພິທີຕັກບາດເທໂວ, ຟັງພຣະທຳເທດສະໜາ, ໄຕ້ປະທີບໂຄມໄຟ ແລະ ລອຍກະໂທງບູຊາສາຍນ້ຳເຊກະໝານ.": "Alms giving to monks, Dhamma sermons, lantern lighting, and floating offerings to honor the Sekaman River.",
    "ຕະຫຼອດມື້": "All day",
    "ແຄມນ້ຳເຊກະໝານ": "Sekaman Riverside",
    "ບຸນມະຫາຊາດ": "Vessantara Festival",
    "ເດືອນ 4 ລາວ": "4th Lao lunar month",
    "ງານບຸນມະຫາຊາດ (ບຸນຜະເວດ)": "Vessantara Festival (Bun Phawet)",
    "ພິທີແຫ່ຜ້າຜະເວດ, ຟັງເທດສະໜາມະຫາຊາດ 13 ກັນ 1000 ພຣະຄາຖາ ເພື່ອສີຣິມົງຄົນ.": "A procession of the Vessantara cloth and listening to all 13 chapters of the Great Birth Sermon for blessings.",
    "3 ມື້ 3 ຄືນ": "3 days and 3 nights",
    "ກິດຈະກຳປະຈຳອາທິດ": "Weekly Activity",
    "ທຸກໆວັນອາທິດ": "Every Sunday",
    "ອົບຮົມສະມາທິ & ສຶກສາທຳ": "Meditation Training & Dhamma Study",
    "ຮຽນຮູ້ການເຈີນສະມາທິພາວະນາ, ຝຶກຈິດໃຈໃຫ້ສະຫງົບ ແລະ ແລກປ່ຽນຄຳສອນທຳມະ.": "Learn meditation, train the mind for calm, and share Dhamma teachings.",
    "14:00 - 16:00 ໂມງ": "2:00 PM – 4:00 PM",
    "ຫໍແຈກ (ສາລາການເປຣຽນ)": "Dhamma Hall (Study Pavilion)",
    "ຮ່ວມເຮັດບຸນບໍລິຈາກ ບູລະນະວັດເຊກະໝານກາງ": "Make Merit and Donate for the Restoration of Wat Xekaman Kang",
    "ຂໍເຊີນຊວນສາທຸຊົນຜູ້ມີຈິດສັດທາ ຮ່ວມບໍລິຈາກທຶນຮັກສາສ້ອມແປງພຣະອຸໂບສົດ, ຄ່ານ້ຳ-ຄ່າໄຟ, ທຶນການສຶກສາພຣະພິກຂຸ-ສາມະເນນ ແລະ ສ້າງສາທາລະນະປະໂຫຍດໃນຊຸມຊົນ.": "Devotees are invited to contribute to repairs of the ordination hall, utility costs, education for monks and novices, and community benefit projects.",
    "ຮ່ວມສ້າງ ແລະ ບູລະນະສິມ/ພຣະອຸໂບສົດ": "Help Build and Restore the Ordination Hall",
    "ອຸປະຖຳການສຶກສາພຣະທຳມະວິນັຍ": "Support Dhamma and Monastic Education",
    "ກອງທຶນສາທາລະນະສຸກ ແລະ ບຸນປະເພນີ": "Public Welfare and Traditional Festival Fund",
    "ອອກໃບອະນຸໂມທະນາບຸນ (Digital Receipt)": "Create a Merit Certificate (Digital Receipt)",
    "ສະແກນ QR Code ເພື່ອຮ່ວມບໍລິຈາກ (BCEL One)": "Scan the QR Code to Donate (BCEL One)",
    "ຊື່ບັນຊີ: Khamsavanh LEUAMTHININ Monk)": "Account Name: Khamsavanh LEUAMTHININ (Monk)",
    "ທະນາຄານ:": "Bank:",
    "ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)": "Banque Pour Le Commerce Exterieur Lao (BCEL)",
    "ເລກບັນຊີ (LAK):": "Account Number (LAK):",
    "ເລກບັນຊີ (THB):": "Account Number (THB):",
    "ຄັດລອກເລກບັນຊີ": "Copy Account Number",
    "ເຂົ້າເບິ່ງທຳນຽບສະມາຊິກພາຍໃນວັດ": "View the Temple Member Directory",
    "ບ້ານເຊກະໝານກາງ, ເມືອງ ສາມັກຄີໄຊ ແລະ ແຂວງ ອັດຕະປື, ສປປລາວ": "Xekaman Kang Village, Samakkixay District, Attapeu Province, Laos",
    "ຫົວຂໍ້": "Subject",
    "ຂໍ້ຄວາມ": "Message",
    "ລິ້ງຄ໌ດ່ວນ": "Quick Links",
    "ຄຳອຸທິດສ່ວນບຸນ": "Dedication of Merit",
    "\"ອິດທັງ ເມ ຍາຕີນັງ ໂຫຕຸ ສຸຂິຕາ ໂຫນຕຸ ຍາຕະໂຍ\"": "‘May this merit reach all my relatives; may they be happy.’",
    "ຂໍສ່ວນບຸນນີ້ຈົ່ງສຳເລັດແກ່ຍາດຕິພີ່ນ້ອງທັງຫຼາຍຂອງຂ້າພະເຈົ້າ ຂໍໃຫ້ຍາດຕິພີ່ນ້ອງທັງຫຼາຍຈົ່ງມີຄວາມສຸກ.": "May this merit be shared with all my relatives. May they all be happy.",
    "© 2026 ວັດເຊກະໝານກາງ (Wat Xekaman Kang). ສະງວນລິຂະສິດ / All Rights Reserved.": "© 2026 Wat Xekaman Kang. All rights reserved.",
    "ສ້າງຂຶ້ນດ້ວຍຄວາມສັດທາໃນພຣະພຸດທະສາສະໜາ 🇱🇦": "Built with faith in Buddhism 🇱🇦",
    "ພຣະອາຈານ ຄຳສະຫວັນ ເລື່ອມທິນິນ": "Venerable Khamsavanh Leuamthinin",
    "ສູນລວມຈິດໃຈ, ທຳມະທານ ແລະ ມໍລະດົກທາງພຸດທະສາສະໜາ ລຸ່ມນ້ຳເຊກະໝານ. ຂໍໃຫ້ຜົນບຸນອັນເກີດຈາກການສຶກສາ ແລະ ຮ່ວມສ້າງບຸນ ຈົ່ງດົນບັນດານໃຫ້ທ່ານມີຄວາມສຸກ ຄວາມຈະເລີນ.": "A center of faith, Dhamma, and Buddhist heritage along the Sekaman River. May the merit from learning and making merit together bring you happiness and prosperity.",
    "ຄະນະກໍາມະການບໍລິຫານງານ ອພສ ເມືອງສາມັກຄີໄຊ": "Administrative Committee, Samakkixay District",
    "ຄະນະກໍາມາທິການສຶກສາສົງເມືອງ": "District Monastic Education Committee",
    "ສະໄໝທີ VIII (2025-2030)": "8th Term (2025–2030)",
    "ເລືອກພາສາ / Select Language": "Select Language",
    "🇱🇦 ພາສາລາວ": "🇱🇦 Lao",
    "1. 🇱🇦 ພາສາລາວ (Lao)": "1. 🇱🇦 Lao",
    "ແຜນທີ່ຕຳແໜ່ງ ອັດຕະປື ເຊກະໝານ": "Attapeu Xekaman Location Map",
    "ບ້ານເຊກະພານ, ເມືອງ ແລະ ແຂວງໃນເຂດລຸ່ມນ້ຳເຊກະພານ, ສປປ ລາວ": "Xekaman Village in the Sekaman River basin, Laos",
    "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອອອກໃບອະນຸໂມທະນາບຸນດິຈິທັລ ສຳລັບເກັບໄວ້ເປັນສິຣິມົງຄົນ:": "Please enter the details for a digital merit certificate to keep as a blessing.",
    "ຊື່ ແລະ ນາມສະກຸນ ຜູ້ບໍລິຈາກ": "Donor's Full Name",
    "ຕົວຢ່າງ: ທ່ານ ສົມໄຊ ວົງສາ": "e.g. Mr. Somchai Vongsa",
    "ຈຳນວນເງິນບໍລິຈາກ (ກີບ / ບາດ)": "Donation Amount (Kip / Baht)",
    "ຕົວຢ່າງ: 100,000 ກີບ": "e.g. 100,000 Kip",
    "ວັດຖຸປະສົງການເຮັດບຸນ": "Merit-Making Purpose",
    "ບູລະນະພຣະອຸໂບສົດ (ສິມ)": "Restore the Ordination Hall (Sim)",
    "ຄ່ານ້ຳ-ຄ່າໄຟຟ້າວັດ": "Temple Water and Electricity Costs",
    "ທຶນການສຶກສາພຣະພິກຂຸ-ສາມະເນນ": "Education Fund for Monks and Novices",
    "ກອງທຶນສາທາລະນະກຸສົນ": "Public Charity Fund",
    "ສ້າງໃບອະນຸໂມທະນາບຸນ": "Create Merit Certificate",
    "ອອກໃບອະນຸໂມທະນາບຸນ": "Create Merit Certificate",
    "ໃບອະນຸໂມທະນາບຸນ": "Merit Certificate",
    "ຂໍອະນຸໂມທະນາບຸນຂອບໃຈ ນຳ:": "With gratitude for the merit-making of:",
    "ໄດ້ຮ່ວມບໍລິຈາກເຮັດບຸນ ຈຳນວນເງິນ:": "has donated for merit-making in the amount of:",
    "ເພື່ອວັດຖຸປະສົງ:": "For the purpose of:",
    "ວັນທີ:": "Date:",
    "ໃບອະນຸໂມທະນາບຸນດິຈິທັລ": "Digital Merit Certificate",
    "ສ້າງໃບອະນຸໂມທະນາບຸນສຳເລັດ! ສາທຸ": "Merit certificate created successfully! Sadhu.",
    "ສຳເລັດ": "Complete",
    "ຂໍໃຫ້ຄອບຄົວມີຄວາມສຸກ ສຸຂະພາບແຂງແຮງ": "May the family be happy and healthy",
    "5 ນາທີກ່ອນ": "5 minutes ago",
    "ຂໍໃຫ້ການຄ້າຂາຍຈະເລີນຮຸ່ງເຮືອງ": "May business prosper",
    "18 ນາທີກ່ອນ": "18 minutes ago",
    "ຂໍໃຫ້ແຄ້ວຄາດປອດໄພຈາກໂຣກໄພທັງປວງ": "May you be safe from all illnesses",
    "1 ຊົ່ວໂມງກ່ອນ": "1 hour ago",
    "ເພິ່ງນີ້": "Just now",
    "ສາທຸ!": "Sadhu!",
    "ທ່ານໄດ້ໄຕ້ທຽນ ແລະ ຖວາຍດອກບົວສຳເລັດແລ້ວ! ຂໍໃຫ້ສົມປະຖາໜາ": "Your candle and lotus offering was successful! May your wish be fulfilled.",
    "ສາທຸ ສາທຸ": "Sadhu, Sadhu",
    "ລຶບປະວັດການເຮັດບຸນແລ້ວ": "Merit-making history cleared",
    "ສຽງລະຄັງວັດດັງຂຶ້ນ... ສາທຸ": "The temple bell rings… Sadhu.",
    "ສຽງຄ້ອງວັດດັງຂຶ້ນ... ສາທຸ": "The temple gong rings… Sadhu.",
    "ສຽງສັກສິດ": "Sacred Sound",
    "ສຸ່ມທຳມະຄຳສອນໃໝ່ແລ້ວ": "A new Dhamma teaching has been selected",
    "ທຳມະທານ": "Dhamma Gift",
    "ຄັດລອກຂໍ້ຄວາມທຳມະຄຳສອນສຳເລັດແລ້ວ!": "Dhamma teaching copied successfully!",
    "ຄັດລອກແລ້ວ": "Copied",
    "ຄັດລອກເລກບັນຊີ BCEL 160-12-00-00123456-001 ສຳເລັດແລ້ວ!": "BCEL account number 160-12-00-00123456-001 copied successfully!",
    "ສົ່ງຂໍ້ຄວາມສຳເລັດແລ້ວ!": "Message sent successfully!",
    "ສົ່ງຂໍ້ຄວາມສຳເລັດ": "Message Sent",
    "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່": "An error occurred. Please try again.",
    "ສົ່ງບໍ່ສຳເລັດ": "Message Not Sent",
    "📖 ອ່ານຄຳສອນເພີ່ມເຕີມ:": "📖 Read more Dhamma teachings:",
    "- ພຣະພຸດທະໂອວາດ -": "— Teaching of the Buddha —",
    "- ພຣະທຳມະຄຳສອນ -": "— Dhamma Teaching —",
    "- ຄຳສອນພຣະທຳ -": "— Dhamma Teaching —",
    "- ໂອວາດປາຕິໂມກ -": "— Ovada Patimokkha —",
    "- ຄຳສອນເຕືອນໃຈ -": "— Reflection —",
    "- ຂໍ້ຄິດເຕືອນໃຈ -": "— Reflection —",
    "- ມັງຄະລາສູດ -": "— Mangala Sutta —",
    "- ຂໍ້ຄິດປະຕິບັດ -": "— Practical Guidance —",
    "- ພິຈາລະນາມໍຣະນະສະຕິ -": "— Reflection on Death —",
    "- ສຸພາສິດເຕືອນໃຈ -": "— Wise Saying —"
});

// Refine frequently used English labels so the English presentation reads naturally.
Object.assign(autoTranslations.en, {
    "ຟັງສຽງລະຄັງ": "Temple Bell",
    "ຟັງສຽງກອງ": "Temple Gong",
    "ວັນພະຕໍ່ໄປ: 15 ຄ່ຳ": "Next observance day: 15th lunar day",
    "ສາທຸ ສາທຸ ສາທຸ - ຍິນດີຕ້ອນຮັບສູ່ດິນແດນແຫ່ງທຳ": "A warm welcome to Wat Xekaman Kang",
    "ກິດຈະກຳ-ງານບຸນ": "Activities & Festivals",
    "ເບິ່ງຮູບພາບກິດຈະກຳທັງໝົດ": "Browse the complete photo gallery",
    "ຮູບພາບກິດຈະກຳ ແລະ ຊີວິດພາຍໃນວັດ": "Temple photo highlights",
    "ເລືອກຊົມພາບທີ່ຄັດມາຈາກຄັງຮູບກິດຈະກຳຂອງວັດເຊກະໝານກາງ": "A selection from Wat Xekaman Kang's activity photo gallery"
});

// Thai translations for the primary website navigation, information, and services.
Object.assign(autoTranslations.th, {
    "ວັດເຊກະໝານກາງ - Wat Xekaman Kang": "วัดเซกะหมานกลาง",
    "ແຈ້ງເຕືອນ": "แจ้งเตือน",
    "ຕົກລົງ / ປິດ": "ตกลง / ปิด",
    "ວັດເຊກະໝານກາງ": "วัดเซกะหมานกลาง",
    "ວັດເຊກະພານກາງ": "วัดเซกะหมานกลาง",
    "ໜ້າຫຼັກ": "หน้าหลัก",
    "ປະຫວັດຄວາມເປັນມາ": "ประวัติความเป็นมา",
    "ສິ່ງສັກສິດ": "สิ่งศักดิ์สิทธิ์",
    "ໄຕ້ທຽນອອນໄລນ໌": "จุดเทียนออนไลน์",
    "ທຳມະຄຳສອນ": "ธรรมะคำสอน",
    "ກິດຈະກຳ-ງານບຸນ": "กิจกรรมและงานบุญ",
    "ຕິດຕໍ່-ແຜນທີ່": "ติดต่อและแผนที่",
    "ຮ່ວມເຮັດບຸນ": "ร่วมทำบุญ",
    "ຮ່ວມເຮັດບຸນບໍລິຈາກ": "ร่วมทำบุญและบริจาค",
    "ສາທຸ ສາທຸ ສາທຸ - ຍິນດີຕ້ອນຮັບສູ່ດິນແດນແຫ່ງທຳ": "ยินดีต้อนรับสู่วัดเซกะหมานกลาง",
    "ສູນລວມຈິດໃຈ, ທຳມະທານ, ມໍລະດົກທາງສະຖາປັດຕະຍະກຳ ແລະ ຄວາມສະຫງົບສຸກແຫ່ງລຸ່ມນ້ຳເຊກະໝານ": "ศูนย์รวมจิตใจ ธรรมทาน มรดกทางสถาปัตยกรรม และความสงบแห่งลุ่มน้ำเซกะหมาน",
    "ໄຕ້ທຽນ & ຖວາຍດອກບົວ": "จุดเทียนและถวายดอกบัว",
    "ອ່ານປະຫວັດຄວາມເປັນມາ": "อ่านประวัติความเป็นมา",
    "ຕັກບາດເຊົ້າ": "ตักบาตรยามเช้า",
    "ທຸກໆເຊົ້າ ເວລາ 06:00 ໂມງ": "ทุกเช้า เวลา 06:00 น.",
    "ທຳວັດສວດມົນ": "ทำวัตรสวดมนต์",
    "ເຊົ້າ 07:00 | ແລງ 18:00": "เช้า 07:00 | เย็น 18:00 น.",
    "ປະຕິບັດທຳ & ສະມາທິ": "ปฏิบัติธรรมและสมาธิ",
    "ທຸກໆວັນສີນ ແລະ ວັນອາທິດ": "ทุกวันพระและวันอาทิตย์",
    "ປະຫວັດຄວາມເປັນມາ ວັດເຊກະໝານກາງ": "ประวัติความเป็นมาวัดเซกะหมานกลาง",
    "ສິ່ງສັກສິດ ແລະ ສາສະນະສະຖານ": "สิ่งศักดิ์สิทธิ์และศาสนสถาน",
    "ຮູບພາບກິດຈະກຳ ແລະ ຊີວິດພາຍໃນວັດ": "ภาพกิจกรรมและวิถีชีวิตภายในวัด",
    "ເລືອກຊົມພາບທີ່ຄັດມາຈາກຄັງຮູບກິດຈະກຳຂອງວັດເຊກະໝານກາງ": "เลือกชมภาพที่คัดมาจากคลังภาพกิจกรรมของวัดเซกะหมานกลาง",
    "ຊົມຄວາມງາມຂອງສະຖາປັດຕະຍະກຳ ແລະ ສິ່ງສັກສິດຄູ່ບ້ານຄູ່ເມືອງພາຍໃນວັດເຊກະໝານກາງ": "ชมความงามของสถาปัตยกรรมและสิ่งศักดิ์สิทธิ์ภายในวัดเซกะหมานกลาง",
    "ພຣະອຸໂບສົດ": "พระอุโบสถ",
    "ພຣະພຸດທະເຊກະໝານ": "พระพุทธเซกะหมาน",
    "ຫໍໄຕກາງນ້ຳ": "หอไตรกลางน้ำ",
    "ຕັ້ງຢູ່ໃຈກາງຂອງວັດ": "ตั้งอยู่ใจกลางวัด",
    "ຮ່ວມທຳບຸນບໍລິຈາກ ບູລະນະວັດເຊກະໝານກາງ": "ร่วมทำบุญเพื่อบูรณะวัดเซกะหมานกลาง",
    "ຊື່-ນາມສະກຸນຜູ້ຮ່ວມທຳບຸນ": "ชื่อ-นามสกุลผู้ร่วมทำบุญ",
    "ຈຳນວນເງິນບໍລິຈາກ": "จำนวนเงินบริจาค",
    "ວັດຖຸປະສົງການເຮັດບຸນ": "วัตถุประสงค์การทำบุญ",
    "ສ້າງໃບອະນຸໂມທະນາບຸນ": "สร้างใบอนุโมทนาบุญ",
    "ທຳມະຄຳສອນປະຈຳວັນ": "ธรรมะคำสอนประจำวัน",
    "ສຸ່ມທຳມະຄຳສອນໃໝ່": "สุ่มธรรมะคำสอนใหม่",
    "ຄັດລອກ": "คัดลอก",
    "ຕິດຕໍ່ເຮົາ & ແຜນທີ່ການເດີນທາງ": "ติดต่อเราและแผนที่การเดินทาง",
    "ທີ່ຢູ່": "ที่อยู่",
    "ໂທລະສັບ / WhatsApp": "โทรศัพท์ / WhatsApp",
    "ອີເມວ": "อีเมล",
    "ເບິ່ງແຜນທີ່ຕຳແໜ່ງວັດ": "ดูแผนที่ตำแหน่งวัด",
    "ສົ່ງຂໍ້ຄວາມ ຫຼື ສອບຖາມຂໍ້ມູນ": "ส่งข้อความหรือสอบถามข้อมูล",
    "ຊື່ ແລະ ນາມສະກຸນ": "ชื่อและนามสกุล",
    "ເບີໂທລະສັບ": "เบอร์โทรศัพท์",
    "ຂໍ້ຄວາມທີ່ຕ້ອງການສົ່ງ": "ข้อความที่ต้องการส่ง",
    "ສົ່ງຂໍ້ຄວາມ": "ส่งข้อความ",
    "ແຜນທີ່ ແລະ ການເດີນທາງ": "แผนที่และการเดินทาง",
    "ນຳທາງດ້ວຍ Google Maps": "นำทางด้วย Google Maps",
    "BACKGROUND & HISTORY": "ภูมิหลังและประวัติ",
    "ຕັ້ງຢູ່ແຄມນ້ຳເຊກະໝານ ດິນແດນອຸດົມສົມບູນດ້ວຍທຳມະຊາດ ແລະ ວັດທະນະທຳອັນງົດງາມ. ເປັນວັດເກົ່າແກ່ທີ່ສ້າງຂຶ້ນໂດຍຄວາມສັດທາຮ່ວມກັນຂອງພຸດທະສາສະນິກະຊົນ ເພື່ອເປັນສູນລວມຈິດໃຈ, ບ່ອນອົບຮົມສີລະທຳ ແລະ ບ່ອນສຶກສາພຣະທຳຄຳສອນຂອງອົງພຣະສຳມາສຳພຸດທະເຈົ້າ.": "ตั้งอยู่ริมแม่น้ำเซกะหมาน ท่ามกลางธรรมชาติและวัฒนธรรมอันงดงาม เป็นวัดเก่าแก่ที่เกิดจากศรัทธาร่วมกันของพุทธศาสนิกชน เพื่อเป็นศูนย์รวมจิตใจ สถานที่อบรมศีลธรรม และศึกษาพระธรรมคำสอนของพระสัมมาสัมพุทธเจ้า.",
    "ວັດເຊກະໝານກາງ ຕັ້ງຢູ່ແຄມນ້ຳເຊກະໝານ ດິນແດນອຸດົມສົມບູນດ້ວຍທຳມະຊາດ ແລະ ວັດທະນະທຳອັນງົດງາມ. ເປັນວັດເກົ່າແກ່ທີ່ສ້າງຂຶ້ນໂດຍຄວາມສັດທາຮ່ວມກັນຂອງພຸດທະສາສະນິກະຊົນ ເພື່ອເປັນສູນລວມຈິດໃຈ, ບ່ອນອົບຮົມສີລະທຳ ແລະ ບ່ອນສຶກສາພຣະທຳຄຳສອນຂອງອົງພຣະສຳມາສຳພຸດທະເຈົ້າ.": "วัดเซกะหมานกลางตั้งอยู่ริมแม่น้ำเซกะหมาน ท่ามกลางธรรมชาติและวัฒนธรรมอันงดงาม เป็นวัดเก่าแก่ที่เกิดจากศรัทธาร่วมกันของพุทธศาสนิกชน เพื่อเป็นศูนย์รวมจิตใจ สถานที่อบรมศีลธรรม และศึกษาพระธรรมคำสอนของพระสัมมาสัมพุทธเจ้า.",
    "ຊື່ຂອງວັດ \"ເຊກະໝານກາງ\" ມີທີ່ມາຈາກທີ່ຕັ້ງທີ່ຢູ່ເຄິ່ງກາງຂອງລຸ່ມນ້ຳເຊກະໝານ ເຊິ່ງເປັນສາຍນ້ຳຫຼັກທີ່ລ້ຽງຊີວິດປະຊາຊົນ. ພຣະອຸໂບສົດ ແລະ ສິ່ງກໍ່ສ້າງພາຍໃນວັດໄດ້ຮັບການອອກແບບຕາມສະຖາປັດຕະຍະກຳລາວອັນເປັນເອກະລັກ ມີຊໍ່ຟ້າ, ໃບລະກາ, ແລະ ລວດລາຍກົບກຽວຢ່າງອ່ອນຊ້ອຍ.": "ชื่อวัดเซกะหมานกลางมาจากที่ตั้งบริเวณกึ่งกลางลุ่มน้ำเซกะหมาน ซึ่งเป็นสายน้ำสำคัญของชุมชน พระอุโบสถและสิ่งปลูกสร้างภายในวัดออกแบบตามสถาปัตยกรรมลาวอันเป็นเอกลักษณ์ มีช่อฟ้า ใบระกา และลวดลายประณีต.",
    "ປັດຈຸບັນ, ວັດເຊກະໝານກາງ ບໍ່ພຽງແຕ່ເປັນສະຖານທີ່ປະກອບພິທີທາງສາສະໜາເທົ່ານັ້ນ, ແຕ່ຍັງເປັນສູນອະນຸລັກສິລະປະວັດທະນະທຳລາວ, ສະຖານທີ່ປະຕິບັດທຳຂອງປະຊາຊົນ ແລະ ຕ້ອນຮັບແຂກບ້ານແຂກເມືອງທີ່ມາຢ້ຽມຢາມດ້ວຍຄວາມອົບອຸ່ນ.": "ปัจจุบันวัดเซกะหมานกลางไม่ได้เป็นเพียงสถานที่ประกอบพิธีทางศาสนา แต่ยังเป็นศูนย์อนุรักษ์ศิลปวัฒนธรรมลาว พื้นที่ปฏิบัติธรรมของชุมชน และสถานที่ต้อนรับผู้มาเยือนอย่างอบอุ่น.",
    "ປີ ແຫ່ງຄວາມສັດທາ": "ปีแห่งศรัทธา",
    "ທຳມະຊາດຮົມເຢັນ": "ธรรมชาติร่มเย็น",
    "ຕັ້ງຢູ່ຕິດແຄມນ້ຳ": "ตั้งอยู่ริมแม่น้ำ",
    "ສູນຮວມສັດທາ": "ศูนย์รวมศรัทธา",
    "ຮັກສາປະເພນີອັນດີງາມ": "สืบสานประเพณีอันดีงาม",
    "ຊົມຄັງຮູບທັງໝົດ": "ชมคลังภาพทั้งหมด",
    "ປິດ": "ปิด"
});

// Additional Thai copy for the sections that were still appearing in Lao.
Object.assign(autoTranslations.th, {
    "PHOTO GALLERY HIGHLIGHTS": "ภาพไฮไลต์ของวัด",
    "DHAMMA TEACHINGS": "ธรรมะคำสอน",
    "ACTIVITIES & FESTIVALS": "กิจกรรมและงานบุญ",
    "MAKE MERIT & DONATION": "ร่วมทำบุญและบริจาค",
    "ງານບຸນປະເພນີ ແລະ ຕາຕະລາງກິດຈະກຳ": "งานบุญประเพณีและตารางกิจกรรม",
    "ຂໍເຊີນຊວນສັດທາສາທຸຊົນທັງຫຼາຍ ຮ່ວມງານບຸນປະເພນີປະຈຳປີ ແລະ ກິດຈະກຳທາງສາສະໜາ": "ขอเชิญชวนพุทธศาสนิกชนร่วมงานบุญประเพณีประจำปีและกิจกรรมทางศาสนา",
    "ງານບຸນປະຈຳປີ": "งานบุญประจำปี",
    "ເດືອນ 11 ລາວ": "เดือน 11 ลาว",
    "ງານບຸນອອກພັນສາ & ລອຍກະໂທງ": "งานบุญออกพรรษาและลอยกระทง",
    "ພິທີຕັກບາດເທໂວ, ຟັງພຣະທຳເທດສະໜາ, ໄຕ້ປະທີບໂຄມໄຟ ແລະ ລອຍກະໂທງບູຊາສາຍນ້ຳເຊກະໝານ.": "พิธีตักบาตรเทโว ฟังพระธรรมเทศนา จุดประทีปโคมไฟ และลอยกระทงบูชาสายน้ำเซกะหมาน.",
    "ຕະຫຼອດມື້": "ตลอดวัน",
    "ແຄມນ້ຳເຊກະໝານ": "ริมแม่น้ำเซกะหมาน",
    "ບຸນມະຫາຊາດ": "บุญมหาชาติ",
    "ເດືອນ 4 ລາວ": "เดือน 4 ลาว",
    "ງານບຸນມະຫາຊາດ (ບຸນຜະເວດ)": "งานบุญมหาชาติ (บุญผะเหวด)",
    "ພິທີແຫ່ຜ້າຜະເວດ, ຟັງເທດສະໜາມະຫາຊາດ 13 ກັນ 1000 ພຣະຄາຖາ ເພື່ອສີຣິມົງຄົນ.": "พิธีแห่ผ้าผะเหวด ฟังเทศน์มหาชาติ 13 กัณฑ์ 1,000 พระคาถา เพื่อความเป็นสิริมงคล.",
    "3 ມື້ 3 ຄືນ": "3 วัน 3 คืน",
    "ກິດຈະກຳປະຈຳອາທິດ": "กิจกรรมประจำสัปดาห์",
    "ທຸກໆວັນອາທິດ": "ทุกวันอาทิตย์",
    "ອົບຮົມສະມາທິ & ສຶກສາທຳ": "อบรมสมาธิและศึกษาธรรม",
    "ຮຽນຮູ້ການເຈີນສະມາທິພາວະນາ, ຝຶກຈິດໃຈໃຫ້ສະຫງົບ ແລະ ແລກປ່ຽນຄຳສອນທຳມະ.": "เรียนรู้การเจริญสมาธิภาวนา ฝึกจิตใจให้สงบ และแลกเปลี่ยนธรรมะคำสอน.",
    "14:00 - 16:00 ໂມງ": "14:00 - 16:00 น.",
    "ຫໍແຈກ (ສາລາການເປຣຽນ)": "หอแจก (ศาลาการเปรียญ)",
    "ຂໍເຊີນຊວນສາທຸຊົນຜູ້ມີຈິດສັດທາ ຮ່ວມບໍລິຈາກທຶນຮັກສາສ້ອມແປງພຣະອຸໂບສົດ, ຄ່ານ້ຳ-ຄ່າໄຟ, ທຶນການສຶກສາພຣະພິກຂຸ-ສາມະເນນ ແລະ ສ້າງສາທາລະນະປະໂຫຍດໃນຊຸມຊົນ.": "ขอเชิญผู้มีจิตศรัทธาร่วมบริจาคเพื่อซ่อมแซมพระอุโบสถ ค่าน้ำค่าไฟ ทุนการศึกษาพระภิกษุสามเณร และสาธารณประโยชน์ของชุมชน.",
    "ຮ່ວມສ້າງ ແລະ ບູລະນະສິມ/ພຣະອຸໂບສົດ": "ร่วมสร้างและบูรณะสิม/พระอุโบสถ",
    "ອຸປະຖຳການສຶກສາພຣະທຳມະວິນັຍ": "อุปถัมภ์การศึกษาพระธรรมวินัย",
    "ກອງທຶນສາທາລະນະສຸກ ແລະ ບຸນປະເພນີ": "กองทุนสาธารณประโยชน์และงานบุญประเพณี",
    "ອອກໃບອະນຸໂມທະນາບຸນ (Digital Receipt)": "ออกใบอนุโมทนาบุญ (Digital Receipt)",
    "ສະແກນ QR Code ເພື່ອຮ່ວມບໍລິຈາກ (BCEL One)": "สแกน QR Code เพื่อร่วมบริจาค (BCEL One)",
    "ເລກບັນຊີ (LAK):": "เลขบัญชี (LAK):",
    "ເລກບັນຊີ (THB):": "เลขบัญชี (THB):",
    "ທະນາຄານ:": "ธนาคาร:",
    "ຄັດລອກເລກບັນຊີ": "คัดลอกเลขบัญชี",
    "ລິ້ງຄ໌ດ່ວນ": "ลิงก์ด่วน",
    "ຄຳອຸທິດສ່ວນບຸນ": "คำอุทิศส่วนกุศล"
});

Object.assign(autoTranslations.en, {
    "2026 MERIT FESTIVAL CALENDAR": "2026 Merit Festival Calendar",
    "ປະຕິທິນງານບຸນ ປະຈຳປີ 2026": "2026 Merit Festival Calendar",
    "ກຳນົດວັນງານບຸນຕາມປະຕິທິນລາວ ພ້ອມເພີ່ມລົງໃນປະຕິທິນຂອງທ່ານໄດ້ທັນທີ": "Lao calendar dates for merit festivals, ready to add to your personal calendar.",
    "ລະບຸເປັນງານຕະຫຼອດມື້; ເວລາເລີ່ມພິທີໃຫ້ຢືນຢັນກັບທາງວັດອີກຄັ້ງ.": "Listed as all-day events; please confirm the ceremony start time with the temple.",
    "ງານບຸນປະຈຳປີ": "Annual Merit Festival",
    "ວັນສຸກ · 11 ກັນຍາ 2026": "Friday · 11 September 2026",
    "ວັນເສົາ · 26 ກັນຍາ 2026": "Saturday · 26 September 2026",
    "ວັນຈັນ · 26 ຕຸລາ 2026": "Monday · 26 October 2026",
    "ບຸນເຂົ້າປະດັບດິນ": "Boun Khao Padap Din",
    "ບຸນເຂົ້າສະຫຼາກ": "Boun Khao Salak",
    "ບຸນອອກພັນສາ": "Boun Ork Phansa",
    "ຮ່ວມທຳບຸນອຸທິດສ່ວນກຸສົນໃຫ້ບັນພະບຸລຸດ ແລະ ສືບສານປະເພນີລາວ.": "Join in dedicating merit to ancestors and preserving Lao tradition.",
    "ຮ່ວມຕັກບາດ ແລະ ຖວາຍສະຫຼາກພັດຕາຫານ ເພື່ອຮ່ວມສືບສານຮີດຄອງປະເພນີ.": "Join alms giving and the offering of food lots in keeping with tradition.",
    "ຮ່ວມສືບສານປະເພນີບຸນອອກພັນສາ ແລະ ຮ່ວມທຳບຸນຕາມສັດທາ.": "Join the end-of-Buddhist-Lent tradition and make merit according to your faith.",
    "ຕະຫຼອດມື້ · ເວລາພິທີຢືນຢັນກັບວັດ": "All day · Ceremony time to be confirmed with the temple",
    "ວັດເຊກະໝານກາງ, ບ້ານໃຫຍ່ເຊກະໝານ": "Wat Xekaman Kang, Ban Yai Xekaman",
    "ເພີ່ມໃສ່ Google Calendar": "Add to Google Calendar",
    "ດາວໂຫຼດໄຟລ໌ປະຕິທິນ .ics": "Download calendar file (.ics)"
});

Object.assign(autoTranslations.th, {
    "2026 MERIT FESTIVAL CALENDAR": "ปฏิทินงานบุญ ปี 2026",
    "ປະຕິທິນງານບຸນ ປະຈຳປີ 2026": "ปฏิทินงานบุญ ประจำปี 2026",
    "ກຳນົດວັນງານບຸນຕາມປະຕິທິນລາວ ພ້ອມເພີ່ມລົງໃນປະຕິທິນຂອງທ່ານໄດ້ທັນທີ": "กำหนดวันงานบุญตามปฏิทินลาว พร้อมเพิ่มลงในปฏิทินของท่านได้ทันที",
    "ລະບຸເປັນງານຕະຫຼອດມື້; ເວລາເລີ່ມພິທີໃຫ້ຢືນຢັນກັບທາງວັດອີກຄັ້ງ.": "ระบุเป็นงานตลอดวัน โปรดยืนยันเวลาเริ่มพิธีกับทางวัดอีกครั้ง",
    "ງານບຸນປະຈຳປີ": "งานบุญประจำปี",
    "ວັນສຸກ · 11 ກັນຍາ 2026": "วันศุกร์ · 11 กันยายน 2026",
    "ວັນເສົາ · 26 ກັນຍາ 2026": "วันเสาร์ · 26 กันยายน 2026",
    "ວັນຈັນ · 26 ຕຸລາ 2026": "วันจันทร์ · 26 ตุลาคม 2026",
    "ບຸນເຂົ້າປະດັບດິນ": "บุญข้าวประดับดิน",
    "ບຸນເຂົ້າສະຫຼາກ": "บุญข้าวสลาก",
    "ບຸນອອກພັນສາ": "บุญออกพรรษา",
    "ຮ່ວມທຳບຸນອຸທິດສ່ວນກຸສົນໃຫ້ບັນພະບຸລຸດ ແລະ ສືບສານປະເພນີລາວ.": "ร่วมทำบุญอุทิศส่วนกุศลให้บรรพบุรุษ และสืบสานประเพณีลาว",
    "ຮ່ວມຕັກບາດ ແລະ ຖວາຍສະຫຼາກພັດຕາຫານ ເພື່ອຮ່ວມສືບສານຮີດຄອງປະເພນີ.": "ร่วมตักบาตรและถวายสลากภัตตาหาร เพื่อสืบสานฮีตคองประเพณี",
    "ຮ່ວມສືບສານປະເພນີບຸນອອກພັນສາ ແລະ ຮ່ວມທຳບຸນຕາມສັດທາ.": "ร่วมสืบสานประเพณีบุญออกพรรษา และร่วมทำบุญตามศรัทธา",
    "ຕະຫຼອດມື້ · ເວລາພິທີຢືນຢັນກັບວັດ": "ตลอดวัน · เวลาพิธียืนยันกับทางวัด",
    "ວັດເຊກະໝານກາງ, ບ້ານໃຫຍ່ເຊກະໝານ": "วัดเซกะหมานกลาง, บ้านใหญ่เซกะหมาน",
    "ເພີ່ມໃສ່ Google Calendar": "เพิ่มลง Google Calendar",
    "ດາວໂຫຼດໄຟລ໌ປະຕິທິນ .ics": "ดาวน์โหลดไฟล์ปฏิทิน (.ics)"
});

Object.assign(autoTranslations.en, {
    "ສຳລັບຜູ້ມາເຢືອນ": "VISITOR INFORMATION",
    "ຂໍ້ມູນສຳລັບຜູ້ມາຢ້ຽມຢາມ": "Visitor Information",
    "ຂໍ້ມູນສຳຄັນສຳລັບການມາວັດເຊກະໝານກາງ": "Essential information for visiting Wat Xekaman Kang",
    "ສະຖານທີ່": "Location",
    "ເວລາເປີດ": "Opening hours",
    "ການເດີນທາງ": "Directions",
    "ບ້ານໃຫຍ່ເຊກະໝານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື, ສປປ ລາວ": "Ban Yai Xekaman, Samakkhixay, Attapeu, Laos",
    "ເປີດທຸກມື້ 24 ຊົ່ວໂມງ": "Open daily, 24 hours",
    "ໃຊ້ປຸ່ມນີ້ເພື່ອເປີດເສັ້ນທາງໄປຫາວັດໃນ Google Maps.": "Use this button to open directions to the temple in Google Maps.",
    "ນຳທາງດ້ວຍ Google Maps": "Navigate with Google Maps"
});

Object.assign(autoTranslations.th, {
    "ສຳລັບຜູ້ມາເຢືອນ": "ข้อมูลสำหรับผู้มาเยือน",
    "ຂໍ້ມູນສຳລັບຜູ້ມາຢ້ຽມຢາມ": "ข้อมูลสำหรับผู้มาเยือน",
    "ຂໍ້ມູນສຳຄັນສຳລັບການມາວັດເຊກະໝານກາງ": "ข้อมูลสำคัญสำหรับการเดินทางมาวัดเซกะหมานกลาง",
    "ສະຖານທີ່": "สถานที่",
    "ເວລາເປີດ": "เวลาเปิด",
    "ການເດີນທາງ": "การเดินทาง",
    "ບ້ານໃຫຍ່ເຊກະໝານ, ເມືອງສາມັກຄີໄຊ, ແຂວງອັດຕະປື, ສປປ ລາວ": "บ้านใหญ่เซกะหมาน, เมืองสามัคคีไช, แขวงอัตตะปือ, สปป.ลาว",
    "ເປີດທຸກມື້ 24 ຊົ່ວໂມງ": "เปิดทุกวัน 24 ชั่วโมง",
    "ໃຊ້ປຸ່ມນີ້ເພື່ອເປີດເສັ້ນທາງໄປຫາວັດໃນ Google Maps.": "ใช้ปุ่มนี้เพื่อเปิดเส้นทางไปยังวัดใน Google Maps",
    "ນຳທາງດ້ວຍ Google Maps": "นำทางด้วย Google Maps"
});

// English counterparts for all 100 rotating Dhamma quotations, in QUOTES order.
autoTranslations.en.quotes = [
    "Avoid all evil, cultivate good, and purify your mind — this is the teaching of all Buddhas.",
    "Generosity conquers stinginess, and loving-kindness conquers anger.",
    "A well-trained mind brings happiness.",
    "Heedfulness is the path to the deathless.",
    "One is one's own refuge; who else could be one's refuge?",
    "Doing good brings good; doing evil brings evil. The law of karma always bears fruit.",
    "Patience is the highest spiritual practice.",
    "The mindful are happy wherever they are.",
    "Loving-kindness sustains the world.",
    "Conquering oneself is better than winning a thousand battles.",
    "Happiness arises from the peace of the mind.",
    "The past is gone and the future has not arrived; live mindfully in the present.",
    "Being angry with another is like lighting a fire to burn yourself.",
    "Making merit is a noble treasure that accompanies one through every life.",
    "Wisdom arises through reflection and practice.",
    "Gratitude and appreciation are the marks of a good person.",
    "Do not focus on the faults of others; examine your own faults.",
    "Moral conduct brings happiness and peace to those who practice it.",
    "Freedom from illness is the greatest gain.",
    "Purity and impurity belong to oneself; no one can purify another.",
    "Those who give are loved by many.",
    "Contentment is the greatest wealth.",
    "Familiarity is the greatest kinship.",
    "Nibbana is the highest happiness.",
    "Refraining from all evil brings peace.",
    "Those who persevere can overcome suffering.",
    "Beautiful and truthful speech is worth more than a thousand meaningless words.",
    "Keeping good company leads to progress.",
    "Avoiding foolish company is the highest blessing.",
    "Honoring those worthy of honor is the highest blessing.",
    "Caring for one's parents is the highest blessing.",
    "Practicing the Dhamma is the highest blessing.",
    "A bright mind leads to a good destination.",
    "Anger destroys friendship and peace.",
    "Greed brings endless suffering.",
    "Delusion blinds us to the truth.",
    "Mindfulness protects the mind from falling into wrong paths.",
    "The Five Precepts are an island of protection that brings peace to life.",
    "Refraining from killing brings a long life.",
    "Refraining from stealing brings security in one's possessions.",
    "Refraining from sexual misconduct brings happiness to the family.",
    "Refraining from false speech brings respect from others.",
    "Refraining from intoxicants brings clear awareness and wisdom.",
    "The good one has done never disappears.",
    "Time waits for no one; hurry to do good today.",
    "Death is certain, but no one knows when it will come.",
    "All things arise, remain, and pass away according to their nature.",
    "All conditioned things are impermanent; reflect with care and diligence.",
    "Forgiveness brings peace to the heart of the one who forgives.",
    "Each breath in and out is life's precious gift.",
    "Be a good listener more than a speaker of empty words.",
    "Humility brings kindness from elders.",
    "Honesty and integrity are the foundation of a good life.",
    "Diligence and thrift are virtues that lead to prosperity.",
    "Contentment brings happiness according to one's circumstances.",
    "Jealousy destroys one's own happiness.",
    "True love is wishing for others to be happy.",
    "Compassion is wishing for others to be free from suffering.",
    "Sympathetic joy is rejoicing in the goodness of others.",
    "Equanimity is letting go with wisdom.",
    "Making merit is not only giving; it also includes keeping moral precepts and meditating.",
    "Meditation gives the mind strength and steady peace.",
    "Wisdom is the light that guides us through darkness.",
    "Where there is effort, there is success.",
    "Obstacles are important lessons in training oneself.",
    "Accepting the truth is the first step toward peace.",
    "Do not tie your happiness to the words of others.",
    "Criticism is like the wind: it comes and goes; do not keep it in your heart.",
    "Goodness done in the dark will shine in the light.",
    "Listening to the Dhamma at the right time is the highest blessing.",
    "Discussing the Dhamma at the right time is the highest blessing.",
    "Respect is the highest blessing.",
    "Humility is the highest blessing.",
    "Patience is the highest blessing.",
    "Being teachable is the highest blessing.",
    "Seeing spiritual practitioners is the highest blessing.",
    "Keeping the mind unshaken by worldly conditions is the highest blessing.",
    "A sorrowless mind is the highest blessing.",
    "A mind free from defilement is the highest blessing.",
    "A serene mind is the highest blessing.",
    "Gratitude to one's benefactors brings prosperity.",
    "When suffering arises, use mindfulness and wisdom to resolve it.",
    "Do not let anger control your actions.",
    "Forgiveness is freeing oneself from suffering.",
    "True happiness is not found in possessions, but in the mind.",
    "Be a creator of happiness for those around you.",
    "Having good friends leads us along a good path.",
    "Guarding the senses leads to peace.",
    "Carelessness is the path to decline.",
    "Reflect on aging, illness, and death so that you do not become careless.",
    "Love of the Dhamma brings happiness.",
    "Those who practice the Dhamma are protected by it.",
    "Peace of mind arises from letting go of craving.",
    "Training oneself is the greatest thing.",
    "Freedom from bias brings justice.",
    "Live every day with kindness and wisdom.",
    "Giving knowledge is the highest gift.",
    "Happiness follows those with a good mind like a shadow.",
    "Suffering follows those with an unwholesome mind like a wheel follows an ox's hoof.",
    "Freedom from mental illness is freedom from defilements."
];

function getPreferredLanguage() {
    return localStorage.getItem('preferred_lang') || 'lo';
}

function translateText(text, lang = getPreferredLanguage()) {
    const dict = autoTranslations[lang];
    return dict && typeof dict[text] === 'string' ? dict[text] : text;
}

function translateDom(root, lang = getPreferredLanguage()) {
    const dict = autoTranslations[lang];
    if (!dict || !root) return;

    const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return node.parentElement && !ignoredTags.has(node.parentElement.tagName)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        }
    });

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    textNodes.forEach(textNode => {
        const original = textNode.nodeValue.trim();
        if (dict[original]) {
            textNode.nodeValue = textNode.nodeValue.replace(original, dict[original]);
            return;
        }

        let translated = textNode.nodeValue;
        Object.entries(dict).forEach(([source, translation]) => {
            if (typeof translation === 'string' && source && translated.includes(source)) {
                translated = translated.replaceAll(source, translation);
            }
        });
        textNode.nodeValue = translated;
    });

    const elements = root.querySelectorAll ? root.querySelectorAll('*') : [];
    elements.forEach(element => {
        ['placeholder', 'title', 'alt', 'aria-label'].forEach(attribute => {
            const original = element.getAttribute(attribute);
            if (original && dict[original.trim()]) element.setAttribute(attribute, dict[original.trim()]);
        });
        if (element.tagName === 'OPTION' && dict[element.value]) element.value = dict[element.value];
    });
}

function translateHtml(html, lang = getPreferredLanguage()) {
    if (lang === 'lo') return html;
    const template = document.createElement('template');
    template.innerHTML = html;
    translateDom(template.content, lang);
    return template.innerHTML;
}

// 2. Compact language menu, anchored directly below the language button.
const languageLabels = {
    lo: '🇱🇦 ພາສາລາວ',
    en: '🇬🇧 English',
    th: '🇹🇭 ภาษาไทย'
};

function closeLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    const trigger = document.getElementById('languageMenuTrigger');
    if (menu) menu.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    const trigger = document.getElementById('languageMenuTrigger');
    if (!menu || !trigger) return;
    const isOpen = menu.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
}

function syncLanguageMenu(lang) {
    const label = languageLabels[lang] || languageLabels.lo;
    const labelEl = document.getElementById('current-lang-label');
    if (labelEl) labelEl.innerText = label;
    document.querySelectorAll('[data-language-option]').forEach(option => {
        option.setAttribute('aria-current', String(option.dataset.languageOption === lang));
    });
}

// 3. Switching language starts from the original Lao page so translations do not stack.
function selectLanguage(lang) {
    const label = languageLabels[lang] || languageLabels.lo;
    localStorage.setItem('preferred_lang', lang);
    localStorage.setItem('preferred_lang_label', label);
    closeLanguageMenu();
    location.reload();
}

const TEMPLE_CALENDAR_COPY = {
    lo: {
        templeName: 'ວັດເຊກະໝານກາງ',
        details: 'ງານບຸນຕະຫຼອດມື້. ກະລຸນາຢືນຢັນເວລາເລີ່ມພິທີກັບທາງວັດອີກຄັ້ງ.'
    },
    th: {
        templeName: 'วัดเซกะมานกลาง',
        details: 'งานบุญตลอดวัน กรุณายืนยันเวลาเริ่มพิธีกับทางวัดอีกครั้ง'
    },
    en: {
        templeName: 'Wat Xekaman Kang',
        details: 'All-day merit festival. Please confirm the ceremony start time with the temple.'
    }
};

function updateTempleCalendarLinks(lang = getPreferredLanguage()) {
    const language = TEMPLE_EVENT_SCHEDULE[0]?.title[lang] ? lang : 'lo';
    const copy = TEMPLE_CALENDAR_COPY[language] || TEMPLE_CALENDAR_COPY.lo;
    const eventsById = new Map(TEMPLE_EVENT_SCHEDULE.map(event => [event.id, event]));

    document.querySelectorAll('[data-calendar-event]').forEach(element => {
        const event = eventsById.get(element.dataset.calendarEvent);
        const start = element.dataset.calendarStart;
        const end = element.dataset.calendarEnd;
        if (!event || !start || !end) return;

        const title = (event.title[language] || event.title.lo) + ' — ' + copy.templeName;
        const location = event.location[language] || event.location.lo;

        if (element.tagName === 'A') {
            const params = new URLSearchParams({
                action: 'TEMPLATE',
                text: title,
                dates: start + '/' + end,
                details: copy.details,
                location: location,
                ctz: 'Asia/Vientiane'
            });
            element.href = 'https://calendar.google.com/calendar/render?' + params.toString();
        } else if (element.tagName === 'BUTTON') {
            element.dataset.calendarTitle = title;
            element.dataset.calendarLocation = location;
            element.dataset.calendarDescription = copy.details;
        }
    });
}

function applyLanguage(lang) {
    const language = autoTranslations[lang] ? lang : 'lo';
    document.documentElement.lang = language;
    if (language === 'lo') {
        updateTempleCalendarLinks(language);
        return;
    }
    document.title = translateText(document.title, language);
    translateDom(document.body, language);
    updateTempleCalendarLinks(language);
    renderDevotees();
}

const HOME_GALLERY_SLIDES = [ 
{ src: 'images/events/event1.jpg', lo: ['ພາບກິດຈະກຳຂອງວັດ', 'ຊົມພາບບັນຍາກາດງານບຸນ ແລະ ກິດຈະກຳພາຍໃນວັດ'], en: ['Temple activities', 'Moments from merit-making ceremonies and temple activities'], th: ['ภาพกิจกรรมของวัด', 'บรรยากาศงานบุญและกิจกรรมภายในวัด'] }, 
{ src: 'images/events/event2.jpg', lo: ['ບຸນປະເພນີ', 'ຮ່ວມສືບສານວັດທະນະທຳ ແລະ ຄວາມສັດທາ'], en: ['Temple traditions', 'Continuing a shared tradition of culture and faith'], th: ['ประเพณีของวัด', 'สืบสานวัฒนธรรมและความศรัทธาร่วมกัน'] }, 
{ src: 'images/events/event3.jpg', lo: ['ຊຸມຊົນແຫ່ງຄວາມສັດທາ', 'ພາບຄວາມຮ່ວມມືຂອງຄະນະວັດ ແລະ ສາທຸຊົນ'], en: ['A community of faith', 'Temple members and visitors coming together'], th: ['ชุมชนแห่งศรัทธา', 'ภาพความร่วมมือของวัดและพุทธศาสนิกชน'] }, 
{ src: 'images/events/event4.jpg', lo: ['ວິຖີວັດ', 'ສະຖານທີ່ແຫ່ງການຮຽນຮູ້ ແລະ ຄວາມສະຫງົບ'], en: ['The temple way of life', 'A place for learning, reflection, and calm'], th: ['วิถີวัด', 'พื้นที่แห่งการเรียนรู้ การใคร่ครวญ และความสงบ'] }, 
{ src: 'images/events/event5.jpg', lo: ['ຊ່ວງເວລາອັນປະທັບໃຈ', 'ຮູບພາບຈາກງານບຸນຂອງວັດເຊກະໝານກາງ'], en: ['Memorable moments', 'Scenes from merit-making at Wat Xekaman Kang'], th: ['ช่วงเวลาน่าประทับใจ', 'ภาพจากงานบุญของวัดเซกะหมานกลาง'] }, 
{ src: 'images/events/event6.jpg', lo: ['ພາບກິດຈະກຳຂອງວັດ', 'ຊົມພາບບັນຍາກາດງານບຸນ ແລະ ກິດຈະກຳພາຍໃນວັດ'], en: ['Temple activities', 'Moments from merit-making ceremonies and temple activities'], th: ['ภาพกิจกรรมของวัด', 'บรรยากาศงานบุญและกิจกรรมภายในวัด'] }, 
{ src: 'images/events/event7.jpg', lo: ['ບຸນປະເພນີ', 'ຮ່ວມສືບສານວັດທະນະທຳ ແລະ ຄວາມສັດທາ'], en: ['Temple traditions', 'Continuing a shared tradition of culture and faith'], th: ['ประเพณีของวัด', 'สืบสานวัฒนธรรมและความศรัทธาร่วมกัน'] }, 
{ src: 'images/events/event8.jpg', lo: ['ຊຸມຊົນແຫ່ງຄວາມສັດທາ', 'ພາບຄວາມຮ່ວມມືຂອງຄະນະວັດ ແລະ ສາທຸຊົນ'], en: ['A community of faith', 'Temple members and visitors coming together'], th: ['ชุมชนแห่งศรัทธา', 'ภาพความร่วมมือของวัดและพุทธศาสนิกชน'] }, 
{ src: 'images/events/event9.jpg', lo: ['ວິຖີວັດ', 'ສະຖານທີ່ແຫ່ງການຮຽນຮູ້ ແລະ ຄວາມສະຫງົບ'], en: ['The temple way of life', 'A place for learning, reflection, and calm'], th: ['วิถີวัด', 'พื้นที่แห่งการเรียนรู้ การใคร่ครวญ และความสงบ'] }, 
{ src: 'images/events/event10.jpg', lo: ['ຊ່ວງເວລາອັນປະທັບໃຈ', 'ຮູບພາບຈາກງານບຸນຂອງວັດເຊກະໝານກາງ'], en: ['Memorable moments', 'Scenes from merit-making at Wat Xekaman Kang'], th: ['ช่วงเวลาน่าประทับใจ', 'ภาพจากงานบุญของวัดเซกะหมานกลาง'] }, 
{ src: 'images/events/event11.jpg', lo: ['ພາບກິດຈະກຳຂອງວັດ', 'ຊົມພາບບັນຍາກາດງານບຸນ ແລະ ກິດຈະກຳພາຍໃນວັດ'], en: ['Temple activities', 'Moments from merit-making ceremonies and temple activities'], th: ['ภาพกิจกรรมของวัด', 'บรรยากาศงานบุญและกิจกรรมภายในวัด'] }, 
{ src: 'images/events/event12.jpg', lo: ['ບຸນປະເພນີ', 'ຮ່ວມສືບສານວັດທະນະທຳ ແລະ ຄວາມສັດທາ'], en: ['Temple traditions', 'Continuing a shared tradition of culture and faith'], th: ['ประเพณีของวัด', 'สืบสานวัฒนธรรมและความศรัทธาร่วมกัน'] }, 
{ src: 'images/events/event13.jpg', lo: ['ຊຸມຊົນແຫ່ງຄວາມສັດທາ', 'ພາບຄວາມຮ່ວມມືຂອງຄະນະວັດ ແລະ ສາທຸຊົນ'], en: ['A community of faith', 'Temple members and visitors coming together'], th: ['ชุมชนแห่งศรัทธา', 'ภาพความร่วมมือของวัดและพุทธศาสนิกชน'] }, 
{ src: 'images/events/event14.jpg', lo: ['ວິຖີວັດ', 'ສະຖານທີ່ແຫ່ງການຮຽນຮູ້ ແລະ ຄວາມສະຫງົບ'], en: ['The temple way of life', 'A place for learning, reflection, and calm'], th: ['วิถີวัด', 'พื้นที่แห่งการเรียนรู้ การใคร่ครวญ และความสงบ'] }, 
{ src: 'images/events/event15.jpg', lo: ['ຊ່ວງເວລາອັນປະທັບໃຈ', 'ຮູບພາບຈາກງານບຸນຂອງວັດເຊກະໝານກາງ'], en: ['Memorable moments', 'Scenes from merit-making at Wat Xekaman Kang'], th: ['ช่วงเวลาน่าประทับใจ', 'ภาพจากงานบุญของวัดเซกะหมานกลาง'] }, 
{ src: 'images/events/event16.jpg', lo: ['ພາບກິດຈະກຳຂອງວັດ', 'ຊົມພາບບັນຍາກາດງານບຸນ ແລະ ກິດຈະກຳພາຍໃນວັດ'], en: ['Temple activities', 'Moments from merit-making ceremonies and temple activities'], th: ['ภาพกิจกรรมของวัด', 'บรรยากาศงานบุญและกิจกรรมภายในวัด'] }, 
{ src: 'images/events/event17.jpg', lo: ['ບຸນປະເພນີ', 'ຮ່ວມສືບສານວັດທະນະທຳ ແລະ ຄວາມສັດທາ'], en: ['Temple traditions', 'Continuing a shared tradition of culture and faith'], th: ['ประเพณีของวัด', 'สืบสานวัฒนธรรมและความศรัทธาร่วมกัน'] }, 
{ src: 'images/events/event18.jpg', lo: ['ຊຸມຊົນແຫ່ງຄວາມສັດທາ', 'ພາບຄວາມຮ່ວມມືຂອງຄະນະວັດ ແລະ ສາທຸຊົນ'], en: ['A community of faith', 'Temple members and visitors coming together'], th: ['ชุมชนแห่งศรัทธา', 'ภาพความร่วมมือของวัดและพุทธศาสนิกชน'] }, 
{ src: 'images/events/event19.jpg', lo: ['ວິຖີວັດ', 'ສະຖານທີ່ແຫ່ງການຮຽນຮູ້ ແລະ ຄວາມສະຫງົບ'], en: ['The temple way of life', 'A place for learning, reflection, and calm'], th: ['วิถີวัด', 'พื้นที่แห่งการเรียนรู้ การใคร่ครวญ และความสงบ'] }, 
{ src: 'images/events/event20.jpg', lo: ['ຊ່ວງເວລາອັນປະທັບໃຈ', 'ຮູບພາບຈາກງານບຸນຂອງວັດເຊກະໝານກາງ'], en: ['Memorable moments', 'Scenes from merit-making at Wat Xekaman Kang'], th: ['ช่วงเวลาน่าประทับใจ', 'ภาพจากงานบุญของวัดเซกะหมานกลาง'] } 
];
const HOME_SLIDE_LABELS = {
    lo: { previous: 'ຮູບກ່ອນໜ້າ', next: 'ຮູບຖັດໄປ', pause: 'ຢຸດສະໄລດ໌', play: 'ເລີ່ມສະໄລດ໌' },
    en: { previous: 'Previous image', next: 'Next image', pause: 'Pause slideshow', play: 'Play slideshow' },
    th: { previous: 'ภาพก่อนหน้า', next: 'ภาพถัดไป', pause: 'หยุดสไลด์', play: 'เริ่มสไลด์' }
};

let homeSlideIndex = 0;
let homeSlideTimer;
let homeSlidePaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let homeSlideTouchStart = 0;
let homeSlideChangeTimer;

function getHomeSlideLanguage() {
    const language = getPreferredLanguage();
    return HOME_GALLERY_SLIDES[homeSlideIndex][language] ? language : 'lo';
}

function createHomeSlideFallback(title) {
    const safeTitle = String(title).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[character]);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-label="${safeTitle}"><rect width="1200" height="700" fill="#2d080e"/><path d="M0 560 300 350l190 130 240-245 470 325v140H0z" fill="#4a0e17"/><circle cx="960" cy="155" r="58" fill="#d4af37" opacity=".9"/><text x="600" y="620" fill="#f3e5ab" font-family="sans-serif" font-size="34" text-anchor="middle">${safeTitle}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function updateHomeGallerySlide(index) {
    homeSlideIndex = (index + HOME_GALLERY_SLIDES.length) % HOME_GALLERY_SLIDES.length;
    const slide = HOME_GALLERY_SLIDES[homeSlideIndex];
    const language = getHomeSlideLanguage();
    const labels = HOME_SLIDE_LABELS[language] || HOME_SLIDE_LABELS.lo;
    const image = document.getElementById('homeSlideImage');
    const stage = document.getElementById('homeSlideStage');
    const title = document.getElementById('homeSlideTitle');
    const description = document.getElementById('homeSlideDescription');
    const counter = document.getElementById('homeSlideCounter');
    const pause = document.getElementById('homeSlidePause');
    if (!image || !stage || !title || !description || !counter || !pause) return;

    window.clearTimeout(homeSlideChangeTimer);
    stage.classList.add('is-changing');
    homeSlideChangeTimer = window.setTimeout(() => {
        image.src = slide.src;
        image.alt = slide[language][0];
        stage.classList.remove('is-changing');
    }, 230);
    image.onerror = () => { image.onerror = null; image.src = createHomeSlideFallback(slide[language][0]); };
    title.textContent = slide[language][0];
    description.textContent = slide[language][1];
    counter.textContent = `${String(homeSlideIndex + 1).padStart(2, '0')} / ${String(HOME_GALLERY_SLIDES.length).padStart(2, '0')}`;
    document.getElementById('homeSlidePrevious').setAttribute('aria-label', labels.previous);
    document.getElementById('homeSlideNext').setAttribute('aria-label', labels.next);
    pause.textContent = homeSlidePaused ? labels.play : labels.pause;
    renderHomeSlideDots(language);
    resetHomeSlideTimer();
}

function renderHomeSlideDots(language) {
    const dots = document.getElementById('homeSlideDots');
    if (!dots) return;
    dots.innerHTML = '';
    HOME_GALLERY_SLIDES.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `home-gallery-dot${index === homeSlideIndex ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `${language === 'th' ? 'เลือกภาพที่' : language === 'en' ? 'Select image' : 'ເລືອກຮູບທີ'} ${index + 1}: ${slide[language][0]}`);
        dot.setAttribute('aria-current', String(index === homeSlideIndex));
        dot.addEventListener('click', () => updateHomeGallerySlide(index));
        dots.appendChild(dot);
    });
}

function resetHomeSlideTimer() {
    window.clearInterval(homeSlideTimer);
    if (!homeSlidePaused) homeSlideTimer = window.setInterval(() => updateHomeGallerySlide(homeSlideIndex + 1), 7000);
}

function initHomeGallerySlider() {
    const previous = document.getElementById('homeSlidePrevious');
    const next = document.getElementById('homeSlideNext');
    const pause = document.getElementById('homeSlidePause');
    const stage = document.getElementById('homeSlideStage');
    if (!previous || !next || !pause || !stage) return;
    previous.addEventListener('click', () => updateHomeGallerySlide(homeSlideIndex - 1));
    next.addEventListener('click', () => updateHomeGallerySlide(homeSlideIndex + 1));
    pause.addEventListener('click', () => {
        homeSlidePaused = !homeSlidePaused;
        updateHomeGallerySlide(homeSlideIndex);
    });
    stage.addEventListener('touchstart', event => { homeSlideTouchStart = event.changedTouches[0].screenX; }, { passive: true });
    stage.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].screenX - homeSlideTouchStart;
        if (Math.abs(distance) > 45) updateHomeGallerySlide(homeSlideIndex + (distance > 0 ? -1 : 1));
    }, { passive: true });
    stage.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); updateHomeGallerySlide(homeSlideIndex - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); updateHomeGallerySlide(homeSlideIndex + 1); }
    });
    document.addEventListener('keydown', event => {
        if (/INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName) || stage.contains(event.target)) return;
        if (event.key === 'ArrowLeft') updateHomeGallerySlide(homeSlideIndex - 1);
        if (event.key === 'ArrowRight') updateHomeGallerySlide(homeSlideIndex + 1);
    });
    updateHomeGallerySlide(0);
}

function replaceSacredImageSources() {
    const galleryCards = [
        { src: 'images/events/event1.jpg', lo: ['ພາບກິດຈະກຳ 1', 'ຮູບພາບຈາກຄັງຮູບກິດຈະກຳຂອງວັດ'], en: ['Gallery activity 1', 'A local image from the temple activity gallery'], th: ['ภาพกิจกรรม 1', 'ภาพจากคลังภาพกิจกรรมของวัด'] },
        { src: 'images/events/event2.jpg', lo: ['ພາບກິດຈະກຳ 2', 'ຮູບພາບຈາກຄັງຮູບກິດຈະກຳຂອງວັດ'], en: ['Gallery activity 2', 'A local image from the temple activity gallery'], th: ['ภาพกิจกรรม 2', 'ภาพจากคลังภาพกิจกรรมของวัด'] },
        { src: 'images/events/event3.jpg', lo: ['ພາບກິດຈະກຳ 3', 'ຮູບພາບຈາກຄັງຮູບກິດຈະກຳຂອງວັດ'], en: ['Gallery activity 3', 'A local image from the temple activity gallery'], th: ['ภาพกิจกรรม 3', 'ภาพจากคลังภาพกิจกรรมของวัด'] }
    ];
    const language = getPreferredLanguage();
    document.querySelectorAll('#sacred .cursor-pointer').forEach((card, index) => {
        const item = galleryCards[index];
        const image = card.querySelector('img');
        if (!item || !image) return;
        image.src = item.src;
        image.onerror = () => { image.onerror = null; image.src = 'wat-logo.jpg'; };
        card.onclick = () => openGalleryModal(item.src, item[language]?.[0] || item.lo[0], item[language]?.[1] || item.lo[1]);
        const panel = card.parentElement;
        const heading = panel.querySelector('h3');
        const description = panel.querySelector('.p-6 p');
        const badge = card.querySelector('span');
        if (heading) heading.textContent = item[language]?.[0] || item.lo[0];
        if (description) description.textContent = item[language]?.[1] || item.lo[1];
        if (badge) badge.textContent = language === 'th' ? 'คลังภาพกิจกรรม' : language === 'en' ? 'PHOTO GALLERY' : 'ຄັງຮູບກິດຈະກຳ';
    });
}

function initPageEnhancements() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = [
        '#history > .grid', '#history > .history-gallery', '#sacred > .max-w-7xl',
        '#virtual-merit > .max-w-7xl', '#dhamma > .bg-gradient-to-br', '#events > .max-w-7xl',
        '#donation > .max-w-6xl', '#contact > .max-w-7xl', 'footer > .max-w-7xl'
    ].flatMap(selector => [...document.querySelectorAll(selector)]);

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach(element => element.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: .12, rootMargin: '0px 0px -36px' });
        revealTargets.forEach((element, index) => {
            element.classList.add('scroll-reveal');
            element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
            observer.observe(element);
        });
    }

    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    const toggleBackToTop = () => {
        const isVisible = window.scrollY > 520;
        backToTop.classList.toggle('is-visible', isVisible);
        backToTop.tabIndex = isVisible ? 0 : -1;
    };
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
}

const TEMPLE_NEWS_API_URL = 'https://script.google.com/macros/s/AKfycbxrS_whx41LS1lLbnGe7vAsSiktzPVpLT2KsfpaSHiRM2Dy_dNMvLg0eLFwOaTC2Dcb/exec';

function setTempleNewsStatus(message, isError = false) {
    const status = document.getElementById('templeNewsStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('text-red-700', isError);
    status.classList.toggle('text-gray-500', !isError);
}

function isSafeTempleNewsImage(value) {
    try {
        const imageUrl = new URL(value, window.location.href);
        return imageUrl.protocol === 'https:' || imageUrl.protocol === 'http:';
    } catch {
        return false;
    }
}

function createTempleNewsCard(item) {
    const card = document.createElement('article');
    card.className = 'overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40 shadow-md transition-shadow hover:shadow-xl';

    if (isSafeTempleNewsImage(item.image)) {
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title || 'ຂ່າວສານຈາກວັດ';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.className = 'h-52 w-full object-cover';
        image.addEventListener('error', () => image.remove());
        card.append(image);
    }

    const content = document.createElement('div');
    content.className = 'p-6';

    if (item.date) {
        const date = document.createElement('p');
        date.className = 'mb-2 text-xs font-bold tracking-wide text-laoGoldDark';
        date.textContent = item.date;
        content.append(date);
    }

    const title = document.createElement('h3');
    title.className = 'font-lao-serif text-xl font-bold text-laoMaroon';
    title.textContent = item.title;
    content.append(title);

    if (item.detail) {
        const detail = document.createElement('p');
        detail.className = 'mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600';
        detail.textContent = item.detail;
        content.append(detail);
    }

    card.append(content);
    return card;
}

function renderTempleNews(items) {
    const list = document.getElementById('templeNewsList');
    if (!list) return;

    list.replaceChildren();
    if (!items.length) {
        setTempleNewsStatus('ຍັງບໍ່ມີຂ່າວສານທີ່ເລືອກໃຫ້ສະແດງ');
        return;
    }

    items.forEach(item => list.append(createTempleNewsCard(item)));
    setTempleNewsStatus('');
}

function initTempleNews() {
    const list = document.getElementById('templeNewsList');
    if (!list || !TEMPLE_NEWS_API_URL) return;

    const callbackName = `__watXekamanNews_${Date.now()}`;
    const script = document.createElement('script');
    let settled = false;

    function finish(payload, failed = false) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        script.remove();
        delete window[callbackName];

        if (failed || !payload || !Array.isArray(payload.items)) {
            setTempleNewsStatus('ບໍ່ສາມາດໂຫຼດຂ່າວສານໄດ້ໃນຂະນະນີ້', true);
            return;
        }

        renderTempleNews(payload.items);
    }

    const timeout = window.setTimeout(() => finish(null, true), 12000);
    window[callbackName] = payload => finish(payload);
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.onerror = () => finish(null, true);
    script.src = `${TEMPLE_NEWS_API_URL}?callback=${encodeURIComponent(callbackName)}&_=${Date.now()}`;
    document.head.append(script);
}

// 5. โหลดภาษาเดิมที่เลือกไว้อัตโนมัติเมื่อเปิดเว็บ
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_lang') || 'lo';
    syncLanguageMenu(savedLang);
    applyLanguage(savedLang);
    renderDevotees();
    renderMeritDashboard();
    initThemeToggle();
    initContactFormProtection();
    initImageModalAccessibility();
    getRandomQuote(null, false);
    updateDailyDhammaProgress();
    updateEventCountdown();
    notifyUpcomingActivity();
    window.setInterval(updateDailyDhammaProgress, 60000);
    window.setInterval(updateEventCountdown, 1000);
    initHomeGallerySlider();
    replaceSacredImageSources();
    initPageEnhancements();
    initTempleNews();
    document.querySelectorAll('button, a[href]').forEach(element => {
        const classes = typeof element.className === 'string' ? element.className : '';
        if (!/(?:hover:|transition|active:)/.test(classes) && !element.closest('.language-menu-popover')) {
            element.classList.add('temple-button-motion');
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('#languageMenu')) closeLanguageMenu();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeLanguageMenu();
    });
});
