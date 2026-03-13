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

// ===== ОТПРАВКА ФОРМЫ =====
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Показываем сообщение о загрузке
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.textContent = '⏳ Отправка...';
            formMessage.style.backgroundColor = '#e3f2fd';
            formMessage.style.color = '#0d47a1';
        }
        
        // ВАЛИДАЦИЯ
        const nameInput = bookingForm.querySelector('input[name="name"]');
        const phoneInput = bookingForm.querySelector('input[name="phone"]');
        const dateInput = bookingForm.querySelector('input[name="date"]');
        const timeInput = bookingForm.querySelector('input[name="time"]');
        const guestsSelect = bookingForm.querySelector('select[name="guests"]');
        
        if (!nameInput.value.trim()) {
            if (formMessage) {
                formMessage.textContent = '❌ Пожалуйста, введите имя';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                setTimeout(() => { formMessage.style.display = 'none'; }, 3000);
            }
            nameInput.focus();
            return;
        }
        
        if (!phoneInput.value.trim()) {
            if (formMessage) {
                formMessage.textContent = '❌ Пожалуйста, введите телефон';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                setTimeout(() => { formMessage.style.display = 'none'; }, 3000);
            }
            phoneInput.focus();
            return;
        }
        
        // Собираем данные в FormData
        const formData = new FormData();
        formData.append('name', nameInput.value.trim());
        formData.append('phone', phoneInput.value.trim());
        formData.append('date', dateInput.value);
        formData.append('time', timeInput.value);
        formData.append('guests', guestsSelect.value);
        
        // ОТЛАДКА: посмотри в консоли, что отправляется
        console.log('Отправляю данные:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        try {
            // ⚠️ ЗАМЕНИ НА СВОЙ URL ВОРКЕРА
            const WORKER_URL = 'https://uslada-bot.lenya-stepanov-07.workers.dev';
            
            console.log('Отправка на:', WORKER_URL);
            
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                body: formData
            });
            
            console.log('Статус ответа:', response.status);
            
            const result = await response.json();
            console.log('Ответ сервера:', result);
            
            if (result.success) {
                if (formMessage) {
                    formMessage.textContent = '✅ Спасибо! Заявка отправлена. Мы скоро перезвоним.';
                    formMessage.style.backgroundColor = '#d4edda';
                    formMessage.style.color = '#155724';
                }
                bookingForm.reset();
                
                // Скрываем сообщение через 5 секунд
                setTimeout(() => {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(result.error || 'Неизвестная ошибка');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            if (formMessage) {
                formMessage.textContent = '❌ Ошибка: ' + error.message;
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                
                setTimeout(() => {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            }
        }
    });
}

// Минимальная дата
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;
}

// Маска для телефона
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length > 11) value = value.slice(0, 11);
            let formattedValue = '+7';
            if (value.length > 1) {
                formattedValue += ' ' + value.slice(1);
            }
            e.target.value = formattedValue;
        }
    });
}