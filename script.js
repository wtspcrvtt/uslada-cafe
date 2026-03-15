// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Кнопка "Наверх"
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Бургер-меню
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

if (burger && mobileNav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        const spans = burger.querySelectorAll('span');
        if (burger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            
            const spans = burger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===== МАСКА ТЕЛЕФОНА =====
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Если начинается с 7 или 8, оставляем только цифры
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.slice(1);
        }
        
        // Ограничиваем длину (максимум 10 цифр после +7)
        if (value.length > 10) value = value.slice(0, 10);
        
        // Форматируем
        let formattedValue = '+7';
        
        if (value.length > 0) {
            // Первая цифра после +7 должна быть 9
            let firstDigit = value[0];
            if (firstDigit !== '9') {
                // Если не 9, принудительно ставим 9
                value = '9' + value.slice(1);
            }
            
            formattedValue += ' (' + value.slice(0, 3);
            
            if (value.length > 3) {
                formattedValue += ') ' + value.slice(3, 6);
                
                if (value.length > 6) {
                    formattedValue += '-' + value.slice(6, 8);
                    
                    if (value.length > 8) {
                        formattedValue += '-' + value.slice(8, 10);
                    }
                }
            }
        }
        
        e.target.value = formattedValue;
    });

    // Принудительно ставим +7 в начале, если поле пустое и получает фокус
    phoneInput.addEventListener('focus', (e) => {
        if (!e.target.value) {
            e.target.value = '+7 (9';
        }
    });
}


// ===== ЗАКАЗ ЗВОНКА =====
document.addEventListener('DOMContentLoaded', function() {
    const callbackForm = document.getElementById('callbackForm');
    const formMessage = document.getElementById('formMessage');
    
    if (callbackForm) {
        callbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nameInput = callbackForm.querySelector('input[name="name"]');
            const phoneInput = callbackForm.querySelector('input[name="phone"]');
            
            // Проверяем телефон (обязательно)
            if (!phoneInput.value.trim()) {
                alert('Введите номер телефона');
                phoneInput.focus();
                return;
            }
            
            // Проверяем, что номер полный (10 цифр после +7)
            const phoneClean = phoneInput.value.replace(/\D/g, '');
            if (phoneClean.length < 11) { // +7 + 10 цифр = 11 символов
                alert('Введите полный номер телефона (10 цифр)');
                phoneInput.focus();
                return;
            }
            
            // Получаем имя (или ставим прочерк, если не ввели)
            const name = nameInput.value.trim() || 'Не указано';
            
            // Показываем сообщение о отправке
            if (formMessage) {
                formMessage.style.display = 'block';
                formMessage.textContent = '⏳ Отправка...';
                formMessage.style.backgroundColor = '#e3f2fd';
                formMessage.style.color = '#0d47a1';
            }
            
            try {
                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxACWvejGUgmcNlb_sTiXYgqxGjp6gcnGeTlw6bHhDu_TLWE69oS3wGI4Duei5SAXsc_Q/exec';
                
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // важно для Google Script
                    body: JSON.stringify({
                        name: name,
                        phone: phoneInput.value,
                        type: 'callback' 
                    })
                });
                

                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.textContent = `✅ Спасибо${name !== 'Не указано' ? ', ' + name.split(' ')[0] : ''}! Мы перезвоним.`;
                    formMessage.style.backgroundColor = '#d4edda';
                    formMessage.style.color = '#155724';
                }
                
                callbackForm.reset();
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.textContent = '❌ Ошибка. Позвоните нам: +7 (960) 191-74-34';
                    formMessage.style.backgroundColor = '#f8d7da';
                    formMessage.style.color = '#721c24';
                }
            }
            
            setTimeout(() => {
                if (formMessage) formMessage.style.display = 'none';
            }, 4000);
            
            return false;
        });
    }
});

async function loadNews() {
    try {
        const container = document.getElementById('news-container');
        if (!container) return;

        container.innerHTML = '⏳ Загрузка...';

        // ID твоей опубликованной таблицы
        const SHEET_ID = '2PACX-1vQHBkZfhFacteoqo59DFY3_E_9-hH17BDmYRQ_Cn_BfsZJitnnL8kYX0zyq0V3H8jxznfX_QZEQxQMR';
        
        // Простейший запрос к CSV
        const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // Просто показываем, что вернул сервер
        container.innerHTML = `<pre style="text-align:left; background:#f0f0f0; padding:10px;">${text}</pre>`;
        
    } catch (error) {
        container.innerHTML = 'Ошибка: ' + error.message;
    }
}