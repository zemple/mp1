const navbar = document.querySelector('.navbar');
const sections = [...document.querySelectorAll('.page-section')];
const navLinks = [...document.querySelectorAll('.nav-links a')];

function updateNavigation() {
  const navBottom = navbar.getBoundingClientRect().bottom;
  let current = sections[0].id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= navBottom + 1) current = section.id;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1].id;
  }

  navbar.classList.toggle('navbar--small', window.scrollY > 20);
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

let frameRequested = false;
window.addEventListener('scroll', () => {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(() => {
    updateNavigation();
    frameRequested = false;
  });
});
window.addEventListener('resize', updateNavigation);
updateNavigation();

const track = document.querySelector('.carousel__track');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel__dots button')];
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, slideIndex) => {
    slide.setAttribute('aria-hidden', slideIndex !== currentSlide);
  });
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === currentSlide;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', active);
  });
}

document.querySelector('.carousel__arrow--prev').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.carousel__arrow--next').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

const notes = {
  snow: ['Snow is shelter', 'Fresh snow can hold more than 90 percent air. Beneath the surface, a sheltered pocket called the subnivean zone stays far warmer and calmer than the exposed tundra above.'],
  light: ['The long day', 'Above the Arctic Circle, the sun can remain above the horizon for weeks. Plants use this uninterrupted light to complete an entire growing season in a remarkably short window.'],
  ocean: ['Life below ice', 'Microscopic algae grows in channels under sea ice. It feeds tiny grazers, which support fish, seabirds, seals, and whales—making ice an active habitat rather than a frozen barrier.'],
};
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('#modal-title');
const modalCopy = document.querySelector('#modal-copy');
const closeModalButton = document.querySelector('.modal__close');
let modalTrigger;

function openModal(key, trigger) {
  [modalTitle.textContent, modalCopy.textContent] = notes[key];
  modalTrigger = trigger;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeModalButton.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (modalTrigger) modalTrigger.focus();
}

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.modal, button));
});
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});
