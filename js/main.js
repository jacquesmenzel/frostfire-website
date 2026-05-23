/* Frost Fire HVACR — Main JS */
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Animate on scroll (simple intersection observer)
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .review-card, .why-card, .blog-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Contact form -> CRM website lead intake
  const form = document.getElementById('contact-form');
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const attributionApi = window.FrostFireAttribution || null;
      const buildContext =
        attributionApi && typeof attributionApi.getContext === 'function'
          ? attributionApi.getContext.bind(attributionApi)
          : null;
      const trackEvent =
        attributionApi && typeof attributionApi.trackEvent === 'function'
          ? attributionApi.trackEvent.bind(attributionApi)
          : null;
      const trackLead =
        attributionApi && typeof attributionApi.trackLead === 'function'
          ? attributionApi.trackLead.bind(attributionApi)
          : null;
      const formData = new FormData(form);
      const lead = {
        context: buildContext ? buildContext() : {
          website: 'frostfire',
          session_key: sessionStorage.getItem('ff_session_key') || 'manual-session',
          page_url: window.location.href,
          page_path: window.location.pathname,
          page_title: document.title,
          page_type: 'contact',
          user_agent: navigator.userAgent,
        },
        lead_channel: 'form',
        full_name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim() || null,
        phone: String(formData.get('phone') || '').trim() || null,
        service_requested: String(formData.get('service') || '').trim() || null,
        city: null,
        address: String(formData.get('address') || '').trim() || null,
        message: String(formData.get('message') || '').trim() || null,
        details: {
          source_page: window.location.pathname,
          cta_type: 'contact_form',
        },
      };

      if (!lead.full_name || !lead.phone || !lead.service_requested) {
        alert('Please provide your name, phone number, and service needed.');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      try {
        if (trackLead) {
          await trackLead(lead);
        } else {
          await fetch('/api/v1/public/website/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          });
        }
        if (trackEvent) {
          trackEvent('form_submit', { lead_channel: 'form', cta_type: 'contact_form' });
        }
        alert('Thanks! Your request is now in our CRM and the team can follow up. For immediate service, call (919) 230-4439.');
        form.reset();
      } catch (error) {
        alert('We hit a temporary issue submitting your request. Please call (919) 230-4439 so we can help right away.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Request';
        }
      }
    });
  }
});
