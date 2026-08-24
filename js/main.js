const SITE_CONTACT = {
  phone: "010-4314-1236",
  email: "janpani@naver.com",
  peopleSocietyUrl: "https://www.peoplesociety.kr/",
  administrativeAgentUrl: ""
};

const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');
menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const phoneLink = document.querySelector('#phone-link');
const emailLink = document.querySelector('#email-link');
if (SITE_CONTACT.phone) {
  document.querySelector('#phone-text').textContent = SITE_CONTACT.phone;
  phoneLink.textContent = '바로 전화하기';
  phoneLink.href = `tel:${SITE_CONTACT.phone.replace(/[^0-9+]/g, '')}`;
  phoneLink.removeAttribute('aria-disabled');
  const footerPhone = document.querySelector('#footer-phone');
  footerPhone.textContent = SITE_CONTACT.phone;
  footerPhone.href = `tel:${SITE_CONTACT.phone.replace(/[^0-9+]/g, '')}`;
}
if (SITE_CONTACT.email) {
  document.querySelector('#email-text').textContent = SITE_CONTACT.email;
  emailLink.textContent = '이메일 작성하기';
  emailLink.href = `mailto:${SITE_CONTACT.email}`;
  emailLink.removeAttribute('aria-disabled');
  const footerEmail = document.querySelector('#footer-email');
  footerEmail.textContent = SITE_CONTACT.email;
  footerEmail.href = `mailto:${SITE_CONTACT.email}`;
}

[
  ['#people-society-link', SITE_CONTACT.peopleSocietyUrl]
].forEach(([selector, url]) => {
  if (!url) return;
  const link = document.querySelector(selector);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (link.hasAttribute('aria-disabled')) link.textContent = '홈페이지 방문하기';
  link.removeAttribute('aria-disabled');
});

const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!SITE_CONTACT.email) {
    status.textContent = '문의 수신 이메일이 아직 연결되지 않았습니다. 운영자에게 연락처 등록을 요청해 주세요.';
    status.focus?.();
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = '필수 입력 항목을 확인해 주세요.';
    return;
  }
  const data = new FormData(form);
  const subject = encodeURIComponent(`[법정교육 문의] ${data.get('기관명')} / ${data.get('교육주제')}`);
  const body = encodeURIComponent(Array.from(data.entries()).map(([key, value]) => `${key}: ${value}`).join('\n'));
  window.location.href = `mailto:${SITE_CONTACT.email}?subject=${subject}&body=${body}`;
  status.textContent = '이메일 작성 화면을 열었습니다. 내용을 확인한 뒤 전송해 주세요.';
});
