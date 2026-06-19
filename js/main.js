const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const form = document.querySelector('[data-contact-form]');
const formNote = document.querySelector('[data-form-note]');

const syncHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  header.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name') || 'there';
  const submitButton = form.querySelector('button[type="submit"]');

  if (form.action.includes('YOUR_FORM_ID')) {
    formNote.textContent = 'Add your Formspree form ID in index.html to activate enquiries.';
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  formNote.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    formNote.textContent = `Thanks, ${name}. Our admissions team will contact you shortly.`;
    form.reset();
  } catch (error) {
    formNote.textContent = 'Sorry, the enquiry could not be sent. Please call or email us directly.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Enquiry';
  }
});
