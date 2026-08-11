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

        // ฟังก์ชันหลักที่เริ่มทำงานเมื่อโหลดหน้าเว็บ
        document.addEventListener('DOMContentLoaded', () => {
            // ตั้งค่าปีปัจจุบันใน Footer
            document.getElementById('current-year-footer').textContent = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ. คร่าวๆ

            // ดึงปีทั้งหมดที่มีในระบบ โดยไม่ให้ซ้ำกัน และเรียงจากมากไปน้อย
            const availableYears = [...new Set(membersData.map(item => item.year))].sort((a, b) => b - a);
            
            if(availableYears.length > 0) {
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
                btn.textContent = `ພ.ສ. ${year}`;
                btn.onclick = (e) => {
                    // อัพเดทคลาส active
                    document.querySelectorAll('.tab-btn').forEach(b => {
                        b.classList.remove('active');
                        b.classList.add('text-gray-600', 'bg-white');
                        b.classList.remove('text-temple-gold', 'bg-temple-dark', 'border-temple-gold');
                    });
                    
                    btn.classList.add('active');
                    btn.classList.remove('text-gray-600', 'bg-white');
                    
                    displayMembersByYear(year);
                };
                tabsContainer.appendChild(btn);
            });
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
                grid.appendChild(card);
            });

            // แสดง Grid หลังจากสร้างการ์ดเสร็จ
            grid.classList.remove('hidden');
        }
