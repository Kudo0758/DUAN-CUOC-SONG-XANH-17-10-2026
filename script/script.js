// ===== Sống Xanh — logic điều hướng trang (SPA theo #hash), hiệu ứng cuộn, form =====
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = Array.from(document.querySelectorAll('[data-page]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  function setActiveNav(hash){
    navLinks.forEach(a => {
      if (a.getAttribute('href') === hash) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
  }

  function showPage(hash){
    hash = hash && document.querySelector(`[data-page="${hash}"]`) ? hash : '#/';
    const match = document.querySelector(`[data-page="${hash}"]`);
    const current = sections.find(s => !s.hidden);
    if (current === match) { setActiveNav(hash); return; }
    setActiveNav(hash);
    if (reduceMotion || !current) {
      sections.forEach(s => s.hidden = true);
      match.hidden = false;
      window.scrollTo(0,0);
      return;
    }
    current.classList.add('page-out');
    setTimeout(() => {
      current.hidden = true;
      current.classList.remove('page-out');
      match.hidden = false;
      match.classList.add('page-in');
      window.scrollTo({top:0, behavior:'smooth'});
      setTimeout(() => match.classList.remove('page-in'), 450);
    }, 180);
  }

  window.addEventListener('hashchange', () => showPage(location.hash));
  showPage(location.hash || '#/');

  // Hiệu ứng xuất hiện khi cuộn trang
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // Nút hiện/ẩn mật khẩu
  document.querySelectorAll('[data-toggle-pw]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.getAttribute('data-toggle-pw'));
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      btn.textContent = show ? '🙈' : '👁️';
    });
  });

  // Form liên hệ (trang Hỗ trợ khách hàng) — chưa có máy chủ thật
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('form-msg').textContent = 'Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.';
    contactForm.reset();
  });

  // Form đăng nhập — demo, chưa kết nối máy chủ
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('login-msg').textContent = 'Đây là bản demo — chức năng đăng nhập thật sẽ được kết nối sau.';
  });

  // Form đăng ký — kiểm tra mật khẩu khớp, chưa kết nối máy chủ
  const signupForm = document.getElementById('signup-form');
  if (signupForm) signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('su-pw').value;
    const pw2 = document.getElementById('su-pw2').value;
    const msg = document.getElementById('signup-msg');
    if (pw !== pw2) {
      msg.textContent = 'Mật khẩu xác nhận chưa khớp, vui lòng kiểm tra lại.';
      msg.style.color = 'var(--accent)';
    } else if (pw.length < 8) {
      msg.textContent = 'Mật khẩu cần ít nhất 8 ký tự.';
      msg.style.color = 'var(--accent)';
    } else {
      msg.textContent = 'Đăng ký thành công! (bản demo — chưa kết nối máy chủ thật)';
      msg.style.color = 'var(--primary)';
      signupForm.reset();
    }
  });
})();
