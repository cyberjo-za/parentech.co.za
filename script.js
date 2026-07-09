/* =========================================================
   PARENTECH - Global Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initHeaderScroll();
  initMobileNav();
  setActiveNavLink();
  initRevealAnimations();
  initSubscribeForm();
  initContactForm();
  initJoinAsCards();
  prefillFromQueryString();
  setFooterYear();
});

/* Add a shadow to the header once the page is scrolled */
function initHeaderScroll() {
  var header = document.getElementById('siteHeader');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* Mobile hamburger navigation */
function initMobileNav() {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Highlight the current page in the navigation menu */
function setActiveNavLink() {
  var links = document.querySelectorAll('.main-nav a');
  var path = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var page = link.getAttribute('data-page');
    if (page === path) {
      link.classList.add('active');
    }
  });
}

/* Fade/slide elements into view as the user scrolls */
function initRevealAnimations() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
}

/* Generic helper to validate a required field */
function validateField(field) {
  var group = field.closest('.form-group');
  if (!group) return true;
  var valid = field.checkValidity();
  group.classList.toggle('invalid', !valid);
  return valid;
}

/* Subscribe page form handling (early access waitlist) */
function initSubscribeForm() {
  var form = document.getElementById('subscribeForm');
  if (!form) return;

  var successPanel = document.getElementById('subscribeSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var requiredFields = form.querySelectorAll('[required]');
    var allValid = true;
    requiredFields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      var firstInvalid = form.querySelector('.invalid input, .invalid select, .invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      name: form.fullName.value,
      email: form.email.value,
      role: form.roleType.value,
      plan: form.planInterest.value,
      savedAt: new Date().toISOString()
    };

    try {
      var existing = JSON.parse(localStorage.getItem('parentechWaitlist') || '[]');
      existing.push(data);
      localStorage.setItem('parentechWaitlist', JSON.stringify(existing));
    } catch (err) {
      /* localStorage may be unavailable, this is not critical to the demo */
    }

    form.style.display = 'none';
    if (successPanel) {
      successPanel.classList.add('show');
      successPanel.setAttribute('tabindex', '-1');
      successPanel.focus();
    }
  });
}

/* Contact page form handling */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var successPanel = document.getElementById('contactSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var requiredFields = form.querySelectorAll('[required]');
    var allValid = true;
    requiredFields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      var firstInvalid = form.querySelector('.invalid input, .invalid select, .invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    form.style.display = 'none';
    if (successPanel) {
      successPanel.classList.add('show');
      successPanel.setAttribute('tabindex', '-1');
      successPanel.focus();
    }
  });
}

/* "Join As" cards on the contact page: pre-select the enquiry type and scroll to the form */
function initJoinAsCards() {
  var cards = document.querySelectorAll('[data-role]');
  var select = document.getElementById('enquiryType');
  var formPanel = document.getElementById('contactFormPanel');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var role = card.getAttribute('data-role');
      if (select && role) {
        select.value = role;
      }
      if (formPanel) {
        formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* Read ?as=parent / ?as=professional etc. from the URL to pre-select a field */
function prefillFromQueryString() {
  var params = new URLSearchParams(window.location.search);
  var as = params.get('as');
  if (!as) return;

  var subscribeSelect = document.getElementById('roleType');
  var contactSelect = document.getElementById('enquiryType');

  if (subscribeSelect) {
    var optionExists = Array.from(subscribeSelect.options).some(function (o) { return o.value === as; });
    if (optionExists) subscribeSelect.value = as;
  }
  if (contactSelect) {
    var optionExistsC = Array.from(contactSelect.options).some(function (o) { return o.value === as; });
    if (optionExistsC) contactSelect.value = as;
  }
}

/* Keep the footer year current */
function setFooterYear() {
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}