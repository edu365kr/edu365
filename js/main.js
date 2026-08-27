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
const submitButton = document.querySelector('#inquiry-submit');
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY_PLACEHOLDER = 'YOUR_WEB3FORMS_ACCESS_KEY';

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = '필수 입력 항목을 확인해 주세요.';
    status.className = 'form-status error';
    return;
  }

  const formData = new FormData(form);
  const accessKey = String(formData.get('access_key') || '').trim();
  const messageFields = [
    ['기관명', '기관명'],
    ['담당자명', '담당자명'],
    ['연락처', '연락처'],
    ['이메일', '이메일'],
    ['교육대상', '교육대상'],
    ['예상인원', '예상 인원'],
    ['교육주제', '교육주제'],
    ['희망교육일', '희망 교육일'],
    ['희망교육시간', '희망 교육시간'],
    ['예산', '예산'],
    ['문의내용', '문의내용']
  ];
  const message = messageFields
    .map(([label, fieldName]) => `${label}: ${String(formData.get(fieldName) || '').trim()}`)
    .join('\n');
  const data = new FormData();
  data.set('access_key', accessKey);
  data.set('from_name', '법정교육연구소 홈페이지');
  data.set('subject', `[법정교육 문의] ${formData.get('기관명')} / ${formData.get('교육주제')}`);
  data.set('replyto', String(formData.get('이메일') || '').trim());
  data.set('message', message);
  if (formData.get('botcheck')) data.set('botcheck', String(formData.get('botcheck')));

  submitButton.disabled = true;
  submitButton.textContent = '전송 중...';
  status.textContent = '';
  status.className = 'form-status';

  try {
    if (!accessKey || accessKey === WEB3FORMS_KEY_PLACEHOLDER) {
      throw new Error('Web3Forms Access Key가 설정되지 않았습니다.');
    }

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || '문의 전송 실패');
    }

    form.reset();
    status.textContent = '교육문의가 정상적으로 접수되었습니다. 빠른 시간 내 연락드리겠습니다.';
    status.className = 'form-status success';
  } catch (error) {
    console.error('교육문의 전송 오류:', error);
    status.textContent = '문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 010-4314-1236으로 연락해 주세요.';
    status.className = 'form-status error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '교육문의 보내기';
  }
});
