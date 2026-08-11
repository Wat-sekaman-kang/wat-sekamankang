/* Interactive behavior for temple_members.html. */

// ข้อมูลจำลอง (Mock Data) ของสมาชิกภายในวัด
        // RankLevel: 1 = เจ้าอาวาส, 2 = รองเจ้าอาวาส, 3 = ผู้ช่วยเจ้าอาวาส, 4 = พระลูกวัด, 5 = สามเณร, 6 = มัคนายก/บุคลากร
        const membersData = [
            // ข้อมูลปี 2567
            {
                year: "2567",
                id: 101,
                name: "ພຣະອາຈານ ຄຳສະຫວັນ ເລື່ອມທິນິນ (ຖີງ)",
                position: "ເຈົ້າອາວາດ",
                rankLevel: 1,
                age: 29,
                vassa: 5,
                education: "ນັກທຳຊັ້ນຕີ",
                duty: "ບໍລິຫານຈັດການກິດຈະການພາຍໃນວັດທັງໝົດ",
                imageUrl: "images/Monk1.jpg" // ປ່ຽນຊື່ໄຟລ໌ໃຫ້ກົງກັບຮູບໃນໂຟນເດີ images ຂອງທ່ານ
            },
            {
                year: "2567",
                id: 102,
                name: "ພຣະອາຈານ ໂປຍຈັນທະມາດ",
                position: "ຮອງເຈົ້າອາວາດ",
                rankLevel: 2,
                age: 29,
                vassa: 3,
                education: "ມໍຕົ້ນ",
                duty: "ຜູ້ຊ່ວຍວຽກບໍລິຫານ",
                imageUrl: "images/Monk2.jpg"
            },
            {
                year: "2567",
                id: 103,
                name: "ພະອາຈານ ພູດມີໄຊ ສີທັດຄຳແດງ",
                position: "ຮອງເຈົ້າອາວາດ 1 / ",
                rankLevel: 4,
                age: 24,
                vassa: 2,
                education: "ມໍປາຍ",
                duty: "ວຽກເອກະສານ ແລະ ວຽກງານປະຊາສຳພັນ",
                imageUrl: "images/Monk3.jpg"
            },
            {
                year: "2567",
                id: 104,
                name: "ພຣະ ສາທິດ ຊາພັກດີ",
                position: "ພຣະຜູ້ຊ່ອຍເຈົ້າອາວາດ",
                rankLevel: 4,
                age: 27,
                vassa: 2,
                education: "ນັກທຳຕີ",
                duty: "ເບິ່ງແຍງຄວາມສະອາດ ແລະ ເສນາສະນະ",
                imageUrl: "images/Monk4.jpg"
            },
            {
                year: "2567",
                id: 105,
                name: "ສາມະເນນ ແຈ໊ກກີ້",
                position: "ສາມະເນນ",
                rankLevel: 5,
                age: 19,
                vassa: 1,
                education: "ມໍຕົ້ນ / ມ.3",
                duty: "ສຶກສາພະປະລິຍັດຕິທຳ",
                imageUrl: "images/Monk4.jpg"
            },
            {
                year: "2567",
                id: 106,
                name: "ພໍ່ໃຫຍ່ ເສື້ອຂາວ",
                position: "ສ່ຽວຮັກຄູບາສາທິດ",
                rankLevel: 6,
                age: 60,
                vassa: "-",
                education: "ສາຍຕູ້",
                duty: "ນຳພາແມ່ອອກເວົ້າພື້ນພຣະ ແລະ ຈັບຜຶດພຣະ",
                imageUrl: "images/layman1.jpg"
            },

            // ข้อมูลปี 2566
            {
                year: "2566",
                id: 201,
                name: "ພະຄູວິຈິດທຳມະຄຸນ (ສົມຊາຍ)",
                position: "ເຈົ້າອາວາດ",
                rankLevel: 1,
                age: 64,
                vassa: 44,
                education: "ນັກທຳຊັ້ນເອກ",
                duty: "ບໍລິຫານຈັດການກິດຈະການພາຍໃນວັດທັງໝົດ",
                imageUrl: "images/Monk1.jpg"
            },
            {
                year: "2566",
                id: 202,
                name: "ພະມະຫາພົງສະກອນ ປັນຍາວະຊິໂຣ",
                position: "ຮອງເຈົ້າອາວາດ",
                rankLevel: 2,
                age: 47,
                vassa: 26,
                education: "ນັກທຳຊັ້ນເອກ",
                duty: "ຜູ້ຊ່ວຍວຽກບໍລິຫານ ແລະ ວຽກງານການສຶກສາ",
                imageUrl: "images/Monk2.jpg"
            },
            {
                year: "2566",
                id: 203,
                name: "ພະສົມບູນ ສຸປຸນໂຍ",
                position: "ພະລູກວັດ",
                rankLevel: 4,
                age: 70,
                vassa: 20,
                education: "ນັກທຳຊັ້ນຕີ",
                duty: "ເບິ່ງແຍງຄວາມຮຽບຮ້ອຍທົ່ວໄປ (ມໍລະນະພາບທ້າຍປີ 66)",
                imageUrl: "images/monk_somboon.jpg"
            },
             {
                year: "2566",
                id: 204,
                name: "ທ້າວ ບຸນມາ ຮັກສາສິນ",
                position: "ມັກຄະນາຍົກ",
                rankLevel: 6,
                age: 57,
                vassa: "-",
                education: "ປະລິນຍາຕີ",
                duty: "ນຳສວດມົນ ແລະ ປະສານງານຄາລະວາດ",
                imageUrl: "images/layman1.jpg"
            }
        ];

        const MEMBER_COPY = {
            lo: {
                label: '🇱🇦 ພາສາລາວ',
                navHome: 'ໜ້າຫຼັກ', navGallery: 'ຄັງຮູບພາບ', navMembers: 'ທຳນຽບວັດ',
                eyebrow: 'TEMPLE DIRECTORY', heroTitle: 'ທຳນຽບສະມາຊິກພາຍໃນວັດ',
                heroText: 'ລວບລວມລາຍນາມພຣະສົງ ສາມະເນນ ແລະ ບຸກຄະລາກອນ ແບ່ງຕາມປີ ພ.ສ.',
                directoryKicker: 'HISTORICAL DIRECTORY', directoryTitle: 'ເລືອກປີຂໍ້ມູນ', directoryText: 'ເລືອກປີເພື່ອເບິ່ງທຳນຽບຄະນະວັດໃນແຕ່ລະຊ່ວງເວລາ',
                loading: 'ກຳລັງໂຫຼດຂໍ້ມູນ...', emptyTitle: 'ບໍ່ພົບຂໍ້ມູນສະມາຊິກໃນປີທີ່ເລືອກ', footerText: 'ທຳນຽບປະຫວັດພາຍໃນວັດ',
                era: 'ພ.ສ.', age: 'ອາຍຸ', vassa: 'ພັນສາ', education: 'ວິທະຍະຖານະ', duty: 'ໜ້າທີ່ຮັບຜິດຊອບ', yearUnit: 'ປີ', vassaUnit: 'ພັນສາ', dark: 'ເປີດໂໝດກາງຄືນ', light: 'ກັບສູ່ໂໝດກາງວັນ', top: 'ກັບຂຶ້ນເທິງສຸດ'
            },
            th: {
                label: '🇹🇭 ภาษาไทย',
                navHome: 'หน้าหลัก', navGallery: 'คลังรูปภาพ', navMembers: 'ทำเนียบวัด',
                eyebrow: 'ทำเนียบวัด', heroTitle: 'ทำเนียบสมาชิกภายในวัด',
                heroText: 'รวบรวมรายนามพระสงฆ์ สามเณร และบุคลากรภายในวัด แยกตามปี พ.ศ.',
                directoryKicker: 'ทำเนียบย้อนหลัง', directoryTitle: 'เลือกปีข้อมูล', directoryText: 'เลือกปีเพื่อดูทำเนียบคณะวัดในแต่ละช่วงเวลา',
                loading: 'กำลังโหลดข้อมูล...', emptyTitle: 'ไม่พบข้อมูลสมาชิกในปีที่เลือก', footerText: 'ทำเนียบประวัติภายในวัด',
                era: 'พ.ศ.', age: 'อายุ', vassa: 'พรรษา', education: 'การศึกษา', duty: 'หน้าที่รับผิดชอบ', yearUnit: 'ปี', vassaUnit: 'พรรษา', dark: 'เปิดโหมดกลางคืน', light: 'กลับสู่โหมดกลางวัน', top: 'กลับขึ้นด้านบน'
            },
            en: {
                label: '🇬🇧 English',
                navHome: 'Home', navGallery: 'Gallery', navMembers: 'Temple directory',
                eyebrow: 'TEMPLE DIRECTORY', heroTitle: 'Temple member directory',
                heroText: 'A directory of monks, novices, and temple staff, organised by Buddhist Era year.',
                directoryKicker: 'HISTORICAL DIRECTORY', directoryTitle: 'Choose a record year', directoryText: 'Select a year to view the temple directory for that period.',
                loading: 'Loading information...', emptyTitle: 'No member record was found for the selected year.', footerText: 'Temple historical directory',
                era: 'B.E.', age: 'Age', vassa: 'Vassa', education: 'Education', duty: 'Responsibilities', yearUnit: 'years', vassaUnit: 'vassa', dark: 'Use dark mode', light: 'Use light mode', top: 'Back to top'
            }
        };

        let activeMemberLanguage = localStorage.getItem('preferred_lang') || 'lo';
        let selectedMemberYear = null;

        function getMemberCopy() {
            return MEMBER_COPY[activeMemberLanguage] || MEMBER_COPY.lo;
        }

        function closeMembersLanguageMenu() {
            const menu = document.getElementById('membersLanguageMenu');
            const trigger = document.getElementById('membersLanguageTrigger');
            if (!menu || !trigger) return;
            menu.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        function applyMemberLanguage(language, refreshDirectory = true) {
            activeMemberLanguage = MEMBER_COPY[language] ? language : 'lo';
            const copy = getMemberCopy();
            document.documentElement.lang = activeMemberLanguage;
            document.querySelectorAll('[data-members-i18n]').forEach(element => {
                const key = element.dataset.membersI18n;
                if (copy[key]) element.textContent = copy[key];
            });
            document.getElementById('membersLanguageLabel').textContent = copy.label;
            document.querySelectorAll('[data-members-language]').forEach(button => {
                button.setAttribute('aria-current', String(button.dataset.membersLanguage === activeMemberLanguage));
            });
            updateMembersThemeToggle();
            if (refreshDirectory && selectedMemberYear) {
                const years = [...new Set(membersData.map(item => item.year))].sort((a, b) => b - a);
                renderTabs(years);
                displayMembersByYear(selectedMemberYear);
            }
        }

        function selectMemberLanguage(language) {
            try { localStorage.setItem('preferred_lang', language); } catch (error) {}
            applyMemberLanguage(language);
            closeMembersLanguageMenu();
        }

        function updateMembersThemeToggle() {
            const button = document.getElementById('membersThemeToggle');
            const icon = document.getElementById('membersThemeIcon');
            if (!button || !icon) return;
            const isDark = document.documentElement.classList.contains('dark-mode');
            const copy = getMemberCopy();
            const label = isDark ? copy.light : copy.dark;
            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', label);
            button.title = label;
            icon.className = `fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`;
        }

        function initMembersEnhancements() {
            try {
                const savedTheme = localStorage.getItem('temple_theme');
                document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
            } catch (error) {}
            applyMemberLanguage(activeMemberLanguage);

            document.getElementById('membersLanguageTrigger').addEventListener('click', () => {
                const menu = document.getElementById('membersLanguageMenu');
                const trigger = document.getElementById('membersLanguageTrigger');
                const isOpen = menu.classList.toggle('is-open');
                trigger.setAttribute('aria-expanded', String(isOpen));
            });
            document.querySelectorAll('[data-members-language]').forEach(button => {
                button.addEventListener('click', () => selectMemberLanguage(button.dataset.membersLanguage));
            });
            document.getElementById('membersThemeToggle').addEventListener('click', () => {
                const isDark = !document.documentElement.classList.contains('dark-mode');
                document.documentElement.classList.toggle('dark-mode', isDark);
                try { localStorage.setItem('temple_theme', isDark ? 'dark' : 'light'); } catch (error) {}
                updateMembersThemeToggle();
            });
            document.addEventListener('click', event => {
                if (!event.target.closest('#membersLanguageMenu')) closeMembersLanguageMenu();
            });
            document.addEventListener('keydown', event => {
                if (event.key === 'Escape') closeMembersLanguageMenu();
            });

            const backToTop = document.getElementById('membersBackToTop');
            const toggleBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 420);
            backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', toggleBackToTop, { passive: true });
            toggleBackToTop();
        }

        // ฟังก์ชันหลักที่เริ่มทำงานเมื่อโหลดหน้าเว็บ
        document.addEventListener('DOMContentLoaded', () => {
            // ตั้งค่าปีปัจจุบันใน Footer
            document.getElementById('current-year-footer').textContent = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ. คร่าวๆ

            // ดึงปีทั้งหมดที่มีในระบบ โดยไม่ให้ซ้ำกัน และเรียงจากมากไปน้อย
            const availableYears = [...new Set(membersData.map(item => item.year))].sort((a, b) => b - a);
            
            if(availableYears.length > 0) {
                selectedMemberYear = availableYears[0];
                renderTabs(availableYears);
                // แสดงข้อมูลของปีล่าสุดเป็นค่าเริ่มต้น
                displayMembersByYear(availableYears[0]);
            }
        });

        function renderTabs(years) {
            const tabsContainer = document.getElementById('year-tabs');
            tabsContainer.innerHTML = ''; // เคลียร์ของเก่า

            years.forEach((year, index) => {
                const btn = document.createElement('button');
                btn.className = `tab-btn px-6 py-2 rounded-full border-2 border-gray-300 font-semibold shadow-sm focus:outline-none ${index === 0 ? 'active' : 'text-gray-600 bg-white'}`;
                btn.textContent = `${getMemberCopy().era} ${year}`;
                btn.setAttribute('aria-pressed', String(year === selectedMemberYear));
                btn.onclick = (e) => {
                    // อัพเดทคลาส active
                    document.querySelectorAll('.tab-btn').forEach(b => {
                        b.classList.remove('active');
                        b.classList.add('text-gray-600', 'bg-white');
                        b.classList.remove('text-temple-gold', 'bg-temple-dark', 'border-temple-gold');
                    });
                    
                    btn.classList.add('active');
                    btn.classList.remove('text-gray-600', 'bg-white');
                    
                    selectedMemberYear = year;
                    displayMembersByYear(year);
                };
                tabsContainer.appendChild(btn);
            });
        }

        function createMemberImageFallback() {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="gold" x1="0" x2="1"><stop stop-color="#fff5cb"/><stop offset="1" stop-color="#d4af37"/></linearGradient></defs><rect width="160" height="160" fill="#4a0e17"/><circle cx="80" cy="80" r="58" fill="url(#gold)" opacity=".95"/><path fill="#4a0e17" d="M80 35 89 61l26-9-15 23 23 15-27 3 1 27-22-16-22 16 1-27-27-3 23-15-15-23 26 9z"/></svg>`;
            return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
        }

        function displayMembersByYear(year) {
            const grid = document.getElementById('members-grid');
            const noData = document.getElementById('no-data');
            
            // ทำให้ดูเหมือนกำลังโหลดเพื่อ UX ที่ดี
            grid.innerHTML = '';
            grid.classList.add('hidden');
            noData.classList.add('hidden');
            
            // กรองข้อมูลตามปี
            let filteredMembers = membersData.filter(member => member.year === year);
            
            // เรียงลำดับตามตำแหน่ง (rankLevel จากน้อยไปมาก)
            filteredMembers.sort((a, b) => a.rankLevel - b.rankLevel);

            if (filteredMembers.length === 0) {
                noData.classList.remove('hidden');
                return;
            }

            // สร้างการ์ดสำหรับสมาชิกแต่ละคน
            filteredMembers.forEach((member, index) => {
                const card = document.createElement('div');
                // กำหนดสไตล์ของการ์ด (สีทองสำหรับตำแหน่งระดับสูง สีปกติสำหรับตำแหน่งทั่วไป)
                const isHighRank = member.rankLevel <= 2;
                const badgeColor = isHighRank ? 'bg-temple-gold text-temple-dark' : 'bg-temple-dark text-white';
                const borderColor = isHighRank ? 'border-temple-gold' : 'border-gray-200';
                const copy = getMemberCopy();
                
                // ເພີ່ມ animate-fade-in-up ແລະ ຕັ້ງຄ່າ delay ໃຫ້ກາດແຕ່ລະອັນຂຶ້ນມາບໍ່ພ້ອມກັນ (Staggered effect)
                card.className = `card-hover animate-fade-in-up bg-white rounded-xl overflow-hidden border-t-4 ${borderColor} shadow-md hover:shadow-2xl relative group`;
                card.style.animationDelay = `${index * 100}ms`; // ໄລ່ລະດັບເວລາ 100ms ຕໍ່ 1 ກາດ
                
                // รูปแบบป้ายระบุตำแหน่ง (สามเณร ฆราวาส จีวร จะใช้คนละสีเล็กน้อย)
                let roleIcon = 'fa-user';
                if(member.rankLevel <= 4) roleIcon = 'fa-person-praying';
                else if(member.rankLevel === 5) roleIcon = 'fa-child-reaching';

                card.innerHTML = `
                    <div class="corner-ornament corner-tl"></div>
                    <div class="corner-ornament corner-tr"></div>
                    
                    <div class="p-6 flex flex-col items-center relative z-10">
                        <!-- รูปภาพ -->
                        <div class="relative w-32 h-32 mb-4">
                            <div class="absolute inset-0 rounded-full border-4 border-temple-lightgold opacity-50 transform scale-110 group-hover:scale-105 transition-transform"></div>
                            <img src="${member.imageUrl}" alt="${member.name}" onerror="this.onerror=null;this.src='wat-logo.jpg';"
                                class="w-full h-full object-cover rounded-full border-4 ${isHighRank ? 'border-temple-gold' : 'border-white'} shadow-md">
                        </div>
                        
                        <!-- ชื่อและตำแหน่ง -->
                        <div class="${badgeColor} px-4 py-1 rounded-full text-sm font-bold mb-3 shadow-sm flex items-center gap-2">
                            <i class="fa-solid ${roleIcon}"></i>
                            ${member.position}
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 text-center mb-4 min-h-[56px] flex items-center justify-center">${member.name}</h3>
                        
                        <!-- ข้อมูลรายละเอียด (Divided List) -->
                        <div class="w-full space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                            <div class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500"><i class="fa-solid fa-cake-candles mr-2 opacity-60"></i>ອາຍຸ</span>
                                <span class="font-semibold">${member.age} ປີ</span>
                            </div>
                            <div class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500"><i class="fa-solid fa-hands-praying mr-2 opacity-60"></i>ພັນສາ</span>
                                <span class="font-semibold">${member.vassa !== "-" ? member.vassa + " ພັນສາ" : "-"}</span>
                            </div>
                            <div class="flex justify-between border-b border-gray-50 pb-2">
                                <span class="font-medium text-gray-500"><i class="fa-solid fa-graduation-cap mr-2 opacity-60"></i>ວິທະຍະຖານະ</span>
                                <span class="font-semibold text-right w-1/2 truncate" title="${member.education}">${member.education}</span>
                            </div>
                            <div class="pt-2">
                                <span class="block font-medium text-gray-500 mb-1"><i class="fa-solid fa-briefcase mr-2 opacity-60"></i>ໜ້າທີ່ຮັບຜິດຊອບ</span>
                                <span class="block text-gray-700 bg-orange-50 p-2 rounded text-xs leading-relaxed border border-orange-100 group-hover:bg-orange-100 transition-colors duration-300">
                                    ${member.duty}
                                </span>
                            </div>
                        </div>
                    </div>
                `;

                const fieldLabels = [copy.age, copy.vassa, copy.education, copy.duty];
                card.querySelectorAll('.w-full.space-y-2 .font-medium').forEach((label, labelIndex) => {
                    const textNode = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                    if (textNode) textNode.textContent = ` ${fieldLabels[labelIndex]}`;
                });
                const values = card.querySelectorAll('.w-full.space-y-2 > div > span.font-semibold');
                if (values[0]) values[0].textContent = `${member.age} ${copy.yearUnit}`;
                if (values[1]) values[1].textContent = member.vassa !== '-' ? `${member.vassa} ${copy.vassaUnit}` : '-';

                const memberImage = card.querySelector('img');
                memberImage.onerror = () => {
                    memberImage.onerror = null;
                    memberImage.src = createMemberImageFallback();
                };
                grid.appendChild(card);
            });

            // แสดง Grid หลังจากสร้างการ์ดเสร็จ
            grid.classList.remove('hidden');
        }

        document.addEventListener('DOMContentLoaded', initMembersEnhancements);
