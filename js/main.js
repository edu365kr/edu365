const SITE_CONTACT = {
  phone: "010-4314-1236",
  email: "janpani@naver.com",
  peopleSocietyUrl: "https://www.peoplesociety.kr/",
  administrativeAgentUrl: ""
};

// 상단 메뉴(모바일) — 이 스크립트는 홈페이지와 /column/·/privacy·404 페이지에서 함께 쓴다.
const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const yearElement = document.querySelector('#year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

const phoneLink = document.querySelector('#phone-link');
const phoneText = document.querySelector('#phone-text');
if (SITE_CONTACT.phone && phoneLink && phoneText) {
  phoneText.textContent = SITE_CONTACT.phone;
  phoneLink.textContent = '바로 전화하기';
  phoneLink.href = `tel:${SITE_CONTACT.phone.replace(/[^0-9+]/g, '')}`;
  phoneLink.removeAttribute('aria-disabled');
  const footerPhone = document.querySelector('#footer-phone');
  if (footerPhone) {
    footerPhone.textContent = SITE_CONTACT.phone;
    footerPhone.href = `tel:${SITE_CONTACT.phone.replace(/[^0-9+]/g, '')}`;
  }
}
const emailLink = document.querySelector('#email-link');
const emailText = document.querySelector('#email-text');
if (SITE_CONTACT.email && emailLink && emailText) {
  emailText.textContent = SITE_CONTACT.email;
  emailLink.textContent = '이메일 작성하기';
  emailLink.href = `mailto:${SITE_CONTACT.email}`;
  emailLink.removeAttribute('aria-disabled');
  const footerEmail = document.querySelector('#footer-email');
  if (footerEmail) {
    footerEmail.textContent = SITE_CONTACT.email;
    footerEmail.href = `mailto:${SITE_CONTACT.email}`;
  }
}

[
  ['#people-society-link', SITE_CONTACT.peopleSocietyUrl]
].forEach(([selector, url]) => {
  if (!url) return;
  const link = document.querySelector(selector);
  if (!link) return;
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

if (form && status && submitButton) {
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
}

// 현장 강연·방송 출연 영상(2026-11-21): 포스터를 누르면 같은 자리에서 바로 재생
document.querySelectorAll('.video-poster').forEach(poster => {
  poster.addEventListener('click', event => {
    const embed = poster.closest('.video-embed');
    const videoId = embed && embed.dataset.videoId;
    if (!videoId) return;
    event.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&playsinline=1`;
    iframe.title = poster.dataset.title || '영상 재생';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allowfullscreen', '');
    embed.appendChild(iframe);
    if (poster.parentElement === embed) poster.remove();
    if (typeof iframe.focus === 'function') iframe.focus({ preventScroll: true });
  });
});

// 첫 화면 '최신 교육 실무 가이드' 3칸(2026-11-22)
// 매일 새벽 자동 발행이 education-articles.json 을 갱신하므로, 화면의 카드도 그 목록의 최신 3편으로 맞춘다.
// 자바스크립트가 없거나 요청이 실패하면 HTML에 적힌 카드가 그대로 남는다.
(() => {
  const grid = document.querySelector('#guide-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.guide-card'));
  if (cards.length !== 3) return;

  const formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date).reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});
    if (!parts.year || !parts.month || !parts.day) return '';
    return `${parts.year}.${parts.month}.${parts.day}`;
  };

  const applyPost = (card, post) => {
    const timeElement = card.querySelector('time');
    const badge = card.querySelector('.guide-badge');
    const titleLink = card.querySelector('h3 a');
    const description = card.querySelector('p');
    const moreLink = card.querySelector('.guide-more');
    const dateText = formatDate(post.published);
    const path = String(post.path || '');
    if (!titleLink || !path) return;

    if (timeElement && dateText) {
      timeElement.textContent = dateText;
      timeElement.setAttribute('datetime', dateText.replace(/\./g, '-'));
    }
    if (badge && post.organization) badge.textContent = post.organization;
    titleLink.textContent = post.title || titleLink.textContent;
    titleLink.href = path;
    if (description && post.description) description.textContent = post.description;
    if (moreLink) moreLink.href = path;
  };

  fetch('/education-articles.json', { cache: 'no-store' })
    .then(response => (response.ok ? response.json() : null))
    .then(data => {
      const posts = data && Array.isArray(data.posts) ? data.posts.slice(0, 3) : [];
      if (posts.length !== 3) return;
      posts.forEach((post, index) => applyPost(cards[index], post));
    })
    .catch(() => { /* HTML에 적힌 최신 3편을 그대로 둔다 */ });
})();
