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
        qtyLabel.innerText = "Jumlah Halaman Proposal";
        if (qtySlider.max !== "50" || qtySlider.min !== "5") {
            qtySlider.min = "5";
            qtySlider.max = "50";
            qtySlider.value = "10";
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
