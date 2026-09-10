// contact.js - simple form handler with honeypot
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending…';

    // Honeypot check
    const hp = contactForm.querySelector('input[name="hp"]');
    if (hp && hp.value) {
      formStatus.textContent = 'Spam detected.';
      return;
    }

    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {method:contactForm.method,body:data,headers:{'Accept':'application/json'}});
      if (res.ok) {
        formStatus.textContent = 'Thanks — your message was sent.';
        contactForm.reset();
      } else {
        const json = await res.json().catch(()=>null);
        formStatus.textContent = json?.error || 'There was a problem sending your message.';
      }
    } catch (err) {
      formStatus.textContent = 'Network error — please try again later.';
    }
  });
}
