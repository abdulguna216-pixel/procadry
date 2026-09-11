// SCROLL TO ID
function scrollToId(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// HEADER SCROLL EFFECT
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// MOBILE MENU
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('open');
});

menuClose.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

// PHONE FORMATTING
function formatPhone(rawValue) {
  const digits = rawValue.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  const normalized = digits.startsWith('7') ? digits : `7${digits}`;
  const trimmed = normalized.slice(0, 11);
  const p1 = trimmed.slice(1, 4);
  const p2 = trimmed.slice(4, 7);
  const p3 = trimmed.slice(7, 9);
  const p4 = trimmed.slice(9, 11);
  
  let result = '+7';
  if (p1) result += ` (${p1}`;
  if (p1.length === 3) result += ')';
  if (p2) result += ` ${p2}`;
  if (p3) result += `-${p3}`;
  if (p4) result += `-${p4}`;
  return result;
}

function isValidPhone(value) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
}

// PHONE INPUT HANDLERS
const quickPhoneInput = document.getElementById('quickPhone');
if (quickPhoneInput) {
  quickPhoneInput.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
  });
}

const contactPhoneInput = document.getElementById('contactPhone');
if (contactPhoneInput) {
  contactPhoneInput.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
  });
}

// STATS COUNTER
function animateCounter(elementId, targetValue, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;

  let current = 0;
  const duration = 1400;
  const started = performance.now();

  function tick(time) {
    const progress = Math.min((time - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(targetValue * eased);
    element.textContent = new Intl.NumberFormat('ru-RU').format(current);
    
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(tick);
      observer.disconnect();
    }
  }, { threshold: 0.7 });

  observer.observe(element.parentElement);
}

animateCounter('stat1', 5);
animateCounter('stat2', 3000);
animateCounter('stat3', 150);

// QUICK FORM SUBMISSION
const quickForm = document.getElementById('quickForm');
if (quickForm) {
  quickForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const staffCount = document.getElementById('staffCount').value;
    const personnelType = document.getElementById('personnelType').value;
    const term = document.getElementById('term').value;
    const region = document.getElementById('region').value.trim();
    const phone = document.getElementById('quickPhone').value;
    const comment = document.getElementById('comment').value;

    const messageDiv = document.getElementById('quickMessage');
    messageDiv.textContent = '';
    messageDiv.className = 'form-message';

    if (!region || region.length < 2) {
      messageDiv.textContent = 'Проверьте город/регион и формат телефона.';
      messageDiv.className = 'form-message error';
      return;
    }

    if (!isValidPhone(phone)) {
      messageDiv.textContent = 'Проверьте город/регион и формат телефона.';
      messageDiv.className = 'form-message error';
      return;
    }

    const submitBtn = document.getElementById('quickSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      if (Math.random() < 0.08) {
        throw new Error('Ошибка сети. Попробуйте еще раз.');
      }

      messageDiv.textContent = 'Спасибо! Заявка отправлена.';
      messageDiv.className = 'form-message success';

      // Reset form
      document.getElementById('staffCount').value = '20';
      document.getElementById('personnelType').value = 'Комплектовщики';
      document.getElementById('term').value = '1–3 месяца';
      document.getElementById('region').value = '';
      document.getElementById('quickPhone').value = '+7';
      document.getElementById('comment').value = '';

    } catch (error) {
      messageDiv.textContent = error.message;
      messageDiv.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Получить расчет';
      submitBtn.innerHTML = 'Получить расчет<svg class="arrow-icon" viewBox="0 0 24 24"><path class="svg-stroke" d="M5 12h14M13 6l6 6-6 6" /></svg>';
    }
  });
}

// CONTACT FORM SUBMISSION
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear all errors first
    document.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });

    const formData = {
      name: document.getElementById('contactName').value.trim(),
      company: document.getElementById('contactCompany').value.trim(),
      phone: document.getElementById('contactPhone').value,
      email: document.getElementById('contactEmail').value.trim(),
      city: document.getElementById('contactCity').value.trim(),
      count: document.getElementById('contactCount').value.trim(),
      type: document.getElementById('contactType').value.trim(),
      comment: document.getElementById('contactComment').value.trim(),
      agree: document.getElementById('contactAgree').checked
    };

    const errors = {};

    if (!formData.name) errors.name = 'Введите имя';
    if (!formData.company) errors.company = 'Введите компанию';
    if (!isValidPhone(formData.phone)) errors.phone = 'Телефон в формате +7 (999) 999-99-99';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Проверьте email';
    if (!formData.city) errors.city = 'Введите город';
    if (!formData.count) errors.count = 'Укажите количество сотрудников';
    if (!formData.type) errors.type = 'Укажите тип персонала';
    if (!formData.agree) errors.agree = 'Нужно согласие на обработку данных';

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.classList.add('show');
        }
      });
      return;
    }

    const submitBtn = document.getElementById('contactSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const messageDiv = document.getElementById('contactMessage');
    messageDiv.textContent = '';
    messageDiv.className = 'form-message';

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (Math.random() < 0.08) {
        throw new Error('Ошибка сети. Попробуйте еще раз.');
      }

      messageDiv.textContent = 'Заявка отправлена! Спасибо! Специалист ПРОКАДРЫ свяжется с вами для уточнения деталей.';
      messageDiv.className = 'form-message success';

      // Reset form
      contactForm.reset();
      document.getElementById('contactPhone').value = '+7';

    } catch (error) {
      messageDiv.textContent = error.message;
      messageDiv.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      submitBtn.innerHTML = 'Отправить заявку<svg class="arrow-icon" viewBox="0 0 24 24"><path class="svg-stroke" d="M5 12h14M13 6l6 6-6 6" /></svg>';
    }
  });
}

// REVIEWS SLIDER
const testimonials = [
  {
    company: 'ООО ЛОГИСТИК',
    name: 'Алексей Петров',
    role: 'Операционный директор',
    text: 'Команда ПРОКАДРЫ быстро закрыла смены в сезонный пик. Особенно ценим прозрачную коммуникацию и контроль выхода персонала.'
  },
  {
    company: 'ООО МЕТАЛЛПРОМ',
    name: 'Ирина Смирнова',
    role: 'Директор по персоналу',
    text: 'Получили стабильную команду на производственный участок в сжатые сроки. Процессы организованы четко и без лишней нагрузки на наш HR-отдел.'
  },
  {
    company: 'ООО ТЕХНОЛОГИЯ',
    name: 'Дмитрий Орлов',
    role: 'Руководитель логистики',
    text: 'ПРОКАДРЫ помогли быстро масштабировать персонал под рост объемов. Важный плюс - готовность оперативно заменять сотрудников.'
  }
];

let currentSlide = 0;

function updateReview() {
  const review = testimonials[currentSlide];
  document.getElementById('reviewText').textContent = review.text;
  document.getElementById('reviewCompany').textContent = review.company;
  document.getElementById('reviewName').textContent = `${review.name}, ${review.role}`;
  document.getElementById('reviewCounter').textContent = currentSlide + 1;

  // Update dots
  document.querySelectorAll('.review-dot').forEach((dot, idx) => {
    if (idx === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextReview() {
  currentSlide = (currentSlide + 1) % testimonials.length;
  updateReview();
}

function previousReview() {
  currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
  updateReview();
}

// Initialize reviews
const reviewsDots = document.getElementById('reviewsDots');
if (reviewsDots) {
  testimonials.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `review-dot ${idx === 0 ? 'active' : ''}`;
    dot.onclick = () => {
      currentSlide = idx;
      updateReview();
    };
    reviewsDots.appendChild(dot);
  });

  updateReview();

  // Auto rotate reviews
  setInterval(() => {
    nextReview();
  }, 6500);
}

// PRELOAD HERO IMAGE
const heroImg = new Image();
heroImg.src = 'prokadry-01-hero.jpg';
