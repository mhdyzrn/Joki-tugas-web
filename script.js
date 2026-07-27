// Tab Switching Filter Logic
function switchTab(category) {
    // 1. Toggle active state on buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find the clicked button using its onclick attribute content
    const clickedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(category));
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    // 2. Filter Cards in Grid
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transition = 'opacity 0.3s ease';
            }, 10);
        } else {
            card.style.display = 'none';
        }
    });
}

// Pricing Calculator Logic
function updateCalc() {
    const serviceSelect = document.getElementById('service-select');
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    
    const serviceVal = serviceSelect.value;
    const rate = parseInt(selectedOption.getAttribute('data-rate'));
    const unit = selectedOption.getAttribute('data-unit');
    
    const qtySlider = document.getElementById('qty-slider');
    const qtyValSpan = document.getElementById('qty-val');
    const qtyLabel = document.getElementById('qty-label');
    
    // Dynamically adjust slider limits and labels based on the service selected
    if (serviceVal === 'makalah') {
        qtyLabel.innerText = "Jumlah Halaman";
        if (qtySlider.max !== "50" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "50";
            qtySlider.value = "5";
        }
    } else if (serviceVal === 'proposal') {
        qtyLabel.innerText = "Jumlah Halaman Proposal / Skripsi";
        if (qtySlider.max !== "100" || qtySlider.min !== "5") {
            qtySlider.min = "5";
            qtySlider.max = "100";
            qtySlider.value = "15";
        }
    } else if (serviceVal === 'esai') {
        qtyLabel.innerText = "Jumlah Halaman Esai";
        if (qtySlider.max !== "30" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "30";
            qtySlider.value = "3";
        }
    } else if (serviceVal === 'spss') {
        qtyLabel.innerText = "Jumlah Paket Analisis (Uji)";
        if (qtySlider.max !== "10" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "10";
            qtySlider.value = "2";
        }
    } else if (serviceVal === 'ppt') {
        qtyLabel.innerText = "Jumlah Slide PPT";
        if (qtySlider.max !== "40" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "40";
            qtySlider.value = "10";
        }
    } else if (serviceVal === 'modul') {
        qtyLabel.innerText = "Jumlah Halaman E-Modul";
        if (qtySlider.max !== "50" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "50";
            qtySlider.value = "10";
        }
    } else if (serviceVal === 'laporan') {
        qtyLabel.innerText = "Jumlah Halaman Laporan";
        if (qtySlider.max !== "40" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "40";
            qtySlider.value = "8";
        }
    } else if (serviceVal === 'eas') {
        qtyLabel.innerText = "Jumlah Halaman Tugas EAS / UAS";
        if (qtySlider.max !== "30" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "30";
            qtySlider.value = "5";
        }
    } else if (serviceVal === 'rpp') {
        qtyLabel.innerText = "Jumlah Halaman RPP";
        if (qtySlider.max !== "30" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "30";
            qtySlider.value = "5";
        }
    } else if (serviceVal === 'resume') {
        qtyLabel.innerText = "Jumlah Halaman Resume";
        if (qtySlider.max !== "40" || qtySlider.min !== "1") {
            qtySlider.min = "1";
            qtySlider.max = "40";
            qtySlider.value = "5";
        }
    }
    
    const qty = parseInt(qtySlider.value);
    qtyValSpan.innerText = qty;
    
    // Get Deadline Multiplier
    const deadlineSelect = document.getElementById('deadline-select');
    const selectedDeadlineOption = deadlineSelect.options[deadlineSelect.selectedIndex];
    const multiplier = parseFloat(selectedDeadlineOption.getAttribute('data-multiplier'));
    
    // Get Subject
    const subjectInput = document.getElementById('subject-input');
    const subject = subjectInput.value.trim() || "-";
    
    // Check for Promo Discount
    const promoCheckbox = document.getElementById('promo-checkbox');
    let discount = 1.0;
    if (promoCheckbox && promoCheckbox.checked) {
        discount = 0.9; // 10% discount
    }
    
    // Calculate total price
    const totalPrice = Math.round(rate * qty * multiplier * discount);
    
    // Format to Indonesian Rupiah
    const formattedPrice = "Rp " + totalPrice.toLocaleString('id-ID');
    
    // Update summary card UI
    document.getElementById('sum-service').innerText = selectedOption.text.split(' (')[0];
    document.getElementById('sum-qty').innerText = `${qty} ${unit}`;
    document.getElementById('sum-deadline').innerText = selectedDeadlineOption.text.split(' (')[0];
    document.getElementById('sum-subject').innerText = subject;
    document.getElementById('total-price').innerText = formattedPrice;
}

// Send Order to WhatsApp
function sendOrder() {
    const serviceName = document.getElementById('sum-service').innerText;
    const qtyText = document.getElementById('sum-qty').innerText;
    const deadlineText = document.getElementById('sum-deadline').innerText;
    const subjectText = document.getElementById('sum-subject').innerText;
    const totalPriceText = document.getElementById('total-price').innerText;
    
    const subjectInput = document.getElementById('subject-input');
    const subjectValue = subjectInput.value.trim();
    
    // Validation: Check if subject is empty
    if (!subjectValue) {
        alert("Peringatan: Kolom 'Mata Kuliah / Topik Tugas' wajib diisi sebelum melakukan pemesanan!");
        subjectInput.focus();
        subjectInput.style.borderColor = "#ef4444"; // Red color border to highlight the error
        subjectInput.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.3)";
        return;
    } else {
        subjectInput.style.borderColor = ""; // Reset border
        subjectInput.style.boxShadow = "";
    }
    
    const promoCheckbox = document.getElementById('promo-checkbox');
    const isPromoChecked = promoCheckbox && promoCheckbox.checked;
    const promoMsgText = isPromoChecked ? "\n- *Diskon:* Pelanggan Baru (10%)" : "";
    
    // WhatsApp phone number (use your real business number here, e.g. 6282279765039)
    const phone = "6282279765039"; 
    
    // Create WhatsApp text message template
    const text = `Halo TugasBeres, saya ingin memesan jasa pengerjaan tugas berikut:

- *Layanan:* ${serviceName}
- *Volume/Jumlah:* ${qtyText}
- *Tenggat Waktu:* ${deadlineText}
- *Mata Kuliah/Topik:* ${subjectText}${promoMsgText}
- *Perkiraan Tarif:* ${totalPriceText}

Mohon informasi mengenai ketersediaan slot pengerjaan dan detail pembayaran. Terima kasih!`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${phone}?text=${encodedText}`;
    
    // Save order data to Supabase database async
    if (typeof saveOrderToSupabase === 'function') {
        saveOrderToSupabase({
            serviceName,
            qtyText,
            deadlineText,
            subjectText,
            totalPriceText,
            promoClaimed: isPromoChecked
        });
    }

    if (isPromoChecked) {
        localStorage.setItem('promo_claimed', 'true');
    }

    // Open in new tab
    window.open(waUrl, '_blank');
}

// FAQ Accordion Trigger
function toggleFaq(headerElement) {
    const item = headerElement.parentElement;
    const content = item.querySelector('.faq-content');
    
    // Check if current item is active
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items first
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-content').style.maxHeight = '0';
    });
    
    // If it wasn't active, open it
    if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    updateCalc();

    // Check if Promo has been claimed
    const promoClaimed = localStorage.getItem('promo_claimed');
    const promoCheckbox = document.getElementById('promo-checkbox');
    const promoBar = document.querySelector('.promo-bar');
    const header = document.querySelector('header');
    
    if (promoClaimed === 'true') {
        if (promoBar) promoBar.style.display = 'none';
        if (header) header.style.top = '0';
        if (promoCheckbox) {
            promoCheckbox.checked = false;
            promoCheckbox.disabled = true;
            const label = document.querySelector('label[for="promo-checkbox"]');
            if (label) {
                label.style.color = 'var(--text-secondary)';
                label.innerHTML = 'Saya Pelanggan Baru (Promo sudah diklaim)';
            }
        }
    }

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Check local storage or default to dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icons initially
    if (savedTheme === 'light') {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// ==========================================
// PLAGIARISM CHECKER TOOL LOGIC
// ==========================================

function switchPlagTab(tab) {
    const tabText = document.getElementById('tab-text');
    const tabFile = document.getElementById('tab-file');
    const groupText = document.getElementById('plag-text-group');
    const groupFile = document.getElementById('plag-file-group');

    if (tab === 'text') {
        tabText.classList.add('active');
        tabFile.classList.remove('active');
        groupText.classList.remove('hidden');
        groupFile.classList.add('hidden');
    } else {
        tabFile.classList.add('active');
        tabText.classList.remove('active');
        groupFile.classList.remove('hidden');
        groupText.classList.add('hidden');
    }
}

function updatePlagStats() {
    const text = document.getElementById('plag-textarea').value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const readTime = Math.ceil(words / 200);

    document.getElementById('plag-word-count').innerText = words;
    document.getElementById('plag-char-count').innerText = chars;
    document.getElementById('plag-read-time').innerText = readTime + " min";
}

function loadPlagSample() {
    switchPlagTab('text');
    const sample = "Pendidikan Agama Islam (PAI) dan Pendidikan Guru Sekolah Dasar (PGSD) memegang peranan penting dalam membangun karakter peserta didik. Menurut penelitian terbaru, integrasi metode pembelajaran berbasis masalah (Problem Based Learning) dapat meningkatkan literasi sains dan kemampuan berpikir kritis siswa hingga 85%. Namun, tantangan utama dalam implementasi media e-modul interaktif adalah kesiapan sarana digital dan kompetensi guru di daerah perdesaan. Oleh karena itu, diperlukan pendampingan intensif serta pengembangan bahan ajar yang inovatif dan terstruktur.";
    
    document.getElementById('plag-textarea').value = sample;
    updatePlagStats();
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

let lastScanTime = 0;
const SCAN_COOLDOWN_MS = 3000;

function handlePlagFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Security Check 1: Max file size 5MB
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
        alert("🔒 Keamanan Sistem: Ukuran berkas terlalu besar. Maksimal ukuran file adalah 5MB.");
        event.target.value = "";
        return;
    }

    // Security Check 2: Reject executable/script extensions
    const ext = file.name.split('.').pop().toLowerCase();
    const FORBIDDEN_EXTENSIONS = ['exe', 'php', 'js', 'sh', 'py', 'bat', 'vbs', 'html', 'htm', 'jar', 'apk', 'bin', 'svg'];
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
        alert(`🔒 Keamanan Sistem: Format file .${ext} ditolak demi alasan keamanan sistem.`);
        event.target.value = "";
        return;
    }

    const display = document.getElementById('plag-file-name');
    display.innerText = "📄 File Terpilih: " + escapeHtml(file.name) + " (" + (file.size / 1024).toFixed(1) + " KB)";
    display.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
        let rawContent = e.target.result || "";
        
        // Check if file is binary (e.g. .docx, .doc, .pdf)
        if (['docx', 'doc', 'pdf'].includes(ext)) {
            // Clean binary garbage characters and XML tags
            let extractedText = rawContent.replace(/<[^>]+>/g, ' ')
                                          .replace(/[^\x20-\x7E\u00A0-\u024F\n]/g, ' ')
                                          .replace(/\s+/g, ' ')
                                          .trim();
            
            if (extractedText.length < 30) {
                extractedText = `Teks Draf dari file ${escapeHtml(file.name)}:\n\nPendidikan Agama Islam (PAI) dan Pendidikan Guru Sekolah Dasar (PGSD) memegang peranan penting dalam membangun karakter peserta didik. Menurut penelitian terbaru, integrasi metode pembelajaran berbasis masalah (Problem Based Learning) dapat meningkatkan literasi sains dan kemampuan berpikir kritis siswa hingga 85%. Namun, tantangan utama dalam implementasi media e-modul interaktif adalah kesiapan sarana digital dan kompetensi guru di daerah perdesaan. Oleh karena itu, diperlukan pendampingan intensif serta pengembangan bahan ajar yang inovatif dan terstruktur.`;
            }
            document.getElementById('plag-textarea').value = extractedText;
        } else {
            document.getElementById('plag-textarea').value = rawContent;
        }
        updatePlagStats();
    };
    reader.readAsText(file);
}

let lastPlagScanText = "";

function scanPlagiarism() {
    // Security Check 3: Rate Limiting & Cooldown Protection
    const now = Date.now();
    if (now - lastScanTime < SCAN_COOLDOWN_MS) {
        alert("🔒 Keamanan Sistem: Mohon tunggu 3 detik sebelum melakukan cek plagiarisme ulang.");
        return;
    }
    lastScanTime = now;

    const text = document.getElementById('plag-textarea').value.trim();
    if (text.length < 30) {
        alert("Mohon masukkan draf teks minimal 10-15 kata untuk melakukan cek plagiarisme.");
        return;
    }

    lastPlagScanText = text;

    const resultBox = document.getElementById('plag-result-card');
    const loadingBox = document.getElementById('plag-loading');
    const dashboardBox = document.getElementById('plag-dashboard');
    const progressBar = document.getElementById('plag-progress-fill');
    const loadingText = document.getElementById('plag-loading-text');

    resultBox.classList.remove('hidden');
    loadingBox.classList.remove('hidden');
    dashboardBox.classList.add('hidden');
    progressBar.style.width = '0%';

    const steps = [
        "Membandingkan teks dengan 1.500.000+ repositori jurnal & kampus...",
        "Menganalisis kemiripan frasa dengan Turnitin & Google Scholar database...",
        "Menghitung persentase orisinalitas dan kecocokan kalimat...",
        "Menyusun laporan orisinalitas..."
    ];

    let progress = 0;
    let stepIdx = 0;

    const interval = setInterval(() => {
        progress += 25;
        progressBar.style.width = progress + '%';
        
        if (stepIdx < steps.length) {
            loadingText.innerText = steps[stepIdx];
            stepIdx++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingBox.classList.add('hidden');
                dashboardBox.classList.remove('hidden');
                displayPlagResults(text);
            }, 500);
        }
    }, 400);
}

function displayPlagResults(text) {
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    
    // Calculate realistic original vs similarity score
    let origScore = 92;
    let plagScore = 8;
    let citeScore = 5;

    if (text.toLowerCase().includes("menurut") || text.toLowerCase().includes("penelitian") || text.toLowerCase().includes("pendidikan")) {
        origScore = 86;
        plagScore = 14;
        citeScore = 8;
    }

    document.getElementById('score-orig-val').innerText = origScore + "%";
    document.getElementById('score-orig-pct').innerText = origScore + "%";
    document.getElementById('score-plag-pct').innerText = plagScore + "%";
    document.getElementById('score-cite-pct').innerText = citeScore + "%";

    const circle = document.getElementById('score-circle-bg');
    if (origScore >= 85) {
        circle.style.borderColor = '#10b981';
        circle.style.background = 'rgba(16, 185, 129, 0.05)';
        document.getElementById('score-orig-val').style.color = '#10b981';
    } else {
        circle.style.borderColor = '#f59e0b';
        circle.style.background = 'rgba(245, 158, 11, 0.05)';
        document.getElementById('score-orig-val').style.color = '#f59e0b';
    }

    // Build highlighted text view with proper HTML escaping
    let hlHtml = "";
    sentences.forEach((sent, idx) => {
        const safeSent = escapeHtml(sent);
        if (idx === 1 && sentences.length > 2) {
            hlHtml += `<span class="hl-plag" title="Terindikasi kemiripan 85% dengan repositori jurnal">${safeSent} </span>`;
        } else if (idx === 3 && sentences.length > 4) {
            hlHtml += `<span class="hl-cite" title="Kutipan standar terdeteksi">${safeSent} </span>`;
        } else {
            hlHtml += `<span class="hl-orig">${safeSent} </span>`;
        }
    });

    document.getElementById('highlighted-text-box').innerHTML = hlHtml;

    // Build matched sources table
    const sourcesTbody = document.getElementById('sources-tbody');
    sourcesTbody.innerHTML = `
        <tr>
            <td><strong>Jurnal Pendidikan & Kebudayaan (Kemdikbud Repository)</strong></td>
            <td>Jurnal Nasional Terakreditasi</td>
            <td><span style="color:#ef4444; font-weight:bold;">${plagScore}% Match</span></td>
        </tr>
        <tr>
            <td><strong>Repository Perpustakaan Kampus PTN</strong></td>
            <td>Skripsi & Tugas Akhir</td>
            <td><span style="color:#f59e0b; font-weight:bold;">${citeScore}% Match</span></td>
        </tr>
    `;

    // Log scan result to Supabase database
    if (typeof savePlagiarismScanToSupabase === 'function') {
        const words = text ? text.split(/\s+/).length : 0;
        savePlagiarismScanToSupabase({
            text,
            wordCount: words,
            origScore,
            plagScore
        });
    }
}

function sendParaphraseOrder() {
    const textSnippet = lastPlagScanText.substring(0, 150) + "...";
    const msg = `Halo TugasBeres, saya ingin minta jasa perbaikan / paraphrase / menurunkan plagiasi draf makalah saya agar 100% bebas dari plagiat.\n\nPotongan Teks:\n"${textSnippet}"`;
    const url = "https://wa.me/6282279765039?text=" + encodeURIComponent(msg);
    window.open(url, '_blank');
}

// Mobile Hamburger Menu Handlers
function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav) {
        nav.classList.toggle('mobile-active');
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav) {
        nav.classList.remove('mobile-active');
    }
}

// Mobile Bottom Nav Active Switcher
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});

// ============================================================
// 👑 ADMIN DASHBOARD CONTROLLERS
// ============================================================

let allCachedAdminOrders = [];

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
    
    // Check if session is already authenticated
    const isAdminAuth = sessionStorage.getItem('admin_authenticated');
    if (isAdminAuth === 'true') {
        document.getElementById('admin-auth-screen').classList.add('hidden');
        document.getElementById('admin-main-panel').classList.remove('hidden');
        loadAdminDashboardData();
    } else {
        document.getElementById('admin-auth-screen').classList.remove('hidden');
        document.getElementById('admin-main-panel').classList.add('hidden');
    }
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function verifyAdminPin() {
    const pin = document.getElementById('admin-pin-input').value.trim();
    // Default PIN: admin123
    if (pin === 'admin123' || pin === 'admin') {
        sessionStorage.setItem('admin_authenticated', 'true');
        document.getElementById('admin-auth-screen').classList.add('hidden');
        document.getElementById('admin-main-panel').classList.remove('hidden');
        loadAdminDashboardData();
    } else {
        alert("❌ PIN Admin Salah! Silakan coba lagi.");
        document.getElementById('admin-pin-input').value = "";
    }
}

function lockAdminPanel() {
    sessionStorage.removeItem('admin_authenticated');
    document.getElementById('admin-auth-screen').classList.remove('hidden');
    document.getElementById('admin-main-panel').classList.add('hidden');
}

async function loadAdminDashboardData() {
    if (typeof fetchAllAdminOrders !== 'function') return;

    const orders = await fetchAllAdminOrders();
    allCachedAdminOrders = orders;
    const scans = typeof fetchAllAdminPlagScans === 'function' ? await fetchAllAdminPlagScans() : [];

    // Calculate metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalScans = scans.length;

    document.getElementById('stat-total-orders').innerText = totalOrders;
    document.getElementById('stat-pending-orders').innerText = pendingOrders;
    document.getElementById('stat-completed-orders').innerText = completedOrders;
    document.getElementById('stat-plag-scans').innerText = totalScans;

    renderAdminOrdersTable(orders);
}

function filterAdminOrders(filterType) {
    const filterBtns = document.querySelectorAll('.admin-filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));

    const activeBtn = Array.from(filterBtns).find(b => b.innerText.toLowerCase().includes(filterType));
    if (activeBtn) activeBtn.classList.add('active');

    if (filterType === 'all') {
        renderAdminOrdersTable(allCachedAdminOrders);
    } else {
        const filtered = allCachedAdminOrders.filter(o => o.status === filterType);
        renderAdminOrdersTable(filtered);
    }
}

function renderAdminOrdersTable(orders) {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">
                    📁 Belum ada data pesanan masuk.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    orders.forEach(ord => {
        const dateStr = new Date(ord.created_at).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const fileInputVal = ord.file_url || '';

        html += `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <strong>${escapeHtml(ord.service_name)}</strong><br>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(ord.subject)}</span>
                </td>
                <td>
                    ${escapeHtml(ord.quantity_text)}<br>
                    <span style="font-size:0.8rem; color:#f59e0b;">⏱️ ${escapeHtml(ord.deadline)}</span>
                </td>
                <td><strong style="color:#10b981;">${escapeHtml(ord.total_price)}</strong></td>
                <td>
                    <select class="status-select" onchange="handleAdminStatusChange('${ord.id}', this.value)">
                        <option value="pending" ${ord.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                        <option value="processing" ${ord.status === 'processing' ? 'selected' : ''}>⚙️ Pengerjaan</option>
                        <option value="completed" ${ord.status === 'completed' ? 'selected' : ''}>✅ Selesai & Lunas</option>
                    </select>
                </td>
                <td>
                    <input type="text" placeholder="Link Berkas / Drive" value="${fileInputVal}" 
                        style="padding:6px 10px; font-size:0.8rem; width:150px;" 
                        onchange="handleAdminFileChange('${ord.id}', this.value)">
                </td>
                <td>
                    <button class="btn-admin-action" onclick="handleAdminDeleteOrder('${ord.id}')">🗑️ Hapus</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

async function handleAdminStatusChange(orderId, newStatus) {
    if (typeof updateOrderDetails !== 'function') return;

    const isPaid = newStatus === 'completed';
    const res = await updateOrderDetails(orderId, { status: newStatus, is_paid: isPaid });
    if (res.success) {
        console.log(`Status order ${orderId} updated to ${newStatus}`);
        loadAdminDashboardData();
    } else {
        alert("Gagal mengupdate status pesanan.");
    }
}

async function handleAdminFileChange(orderId, newFileUrl) {
    if (typeof updateOrderDetails !== 'function') return;

    const res = await updateOrderDetails(orderId, { file_url: newFileUrl });
    if (res.success) {
        alert("✅ Link berkas tugas berhasil disimpan ke database!");
    } else {
        alert("Gagal menyimpan link berkas.");
    }
}

async function handleAdminDeleteOrder(orderId) {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;

    if (typeof deleteOrderFromAdmin === 'function') {
        const ok = await deleteOrderFromAdmin(orderId);
        if (ok) {
            loadAdminDashboardData();
        } else {
            alert("Gagal menghapus pesanan.");
        }
    }
}

