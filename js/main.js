// ============================================
// ANALYTICS HELPER (GA4)
// ============================================
// Sends an event to GA4 if gtag is loaded. Safe no-op otherwise.
function track(event, params) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params || {});
    }
    // Debug (remove in production if desired)
    // console.debug('[track]', event, params);
  } catch (_) {}
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyCode(code, btn) {
  const firm = (btn && btn.closest('[data-firm]')) ? btn.closest('[data-firm]').getAttribute('data-firm') : (document.body.getAttribute('data-firm') || 'unknown');
  const onSuccess = () => {
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2000);
    }
    showToast('Code copied: ' + code);
    track('copy_code', { firm: firm, code: code, location: location.pathname });
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(onSuccess).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const el = document.createElement('textarea');
    el.value = code;
    el.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(el);
    onSuccess();
  }
}

function copyWallet(address, btn) {
  const onSuccess = () => {
    showToast('Wallet address copied!');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 2000);
    }
    const chain = /^0x/i.test(address) ? 'ethereum' : 'solana';
    track('crypto_support_copy', { chain: chain, address: address, location: location.pathname });
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(address).then(onSuccess).catch(() => {
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(el);
      onSuccess();
    });
  }
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============================================
// AUTO-WIRE CLICK TRACKING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Logo fallback
  document.querySelectorAll('img.firm-logo, img.firm-page-logo, img.fcv-logo, img.fd-v-logo, img.rf-logo').forEach(img => {
    img.addEventListener('error', function () {
      const fallback = this.nextElementSibling;
      if (fallback && /logo-fallback|logo-fb/.test(fallback.className)) {
        fallback.style.display = 'flex';
      }
      this.style.display = 'none';
    });
  });

  // Affiliate / claim discount CTAs — any outbound link with [data-track="claim"] OR any external link that points to a firm site
  document.querySelectorAll('a[data-track="claim"], a.btn-primary[target="_blank"][href^="http"]').forEach(a => {
    a.addEventListener('click', () => {
      const firm = a.getAttribute('data-firm') || (document.body.getAttribute('data-firm')) || new URL(a.href).hostname;
      track('claim_discount', { firm: firm, url: a.href, location: location.pathname });
    });
  });

  // TikTok follow
  document.querySelectorAll('a.btn-tiktok, a[href*="tiktok.com"]').forEach(a => {
    a.addEventListener('click', () => track('tiktok_click', { url: a.href, location: location.pathname }));
  });

  // Nav CTA
  document.querySelectorAll('a.nav-cta, a[data-track="nav-cta"]').forEach(a => {
    a.addEventListener('click', () => track('nav_cta_click', { href: a.getAttribute('href'), location: location.pathname }));
  });

  // Top promo bar
  document.querySelectorAll('.promo-bar a').forEach(a => {
    a.addEventListener('click', () => track('promo_bar_click', { href: a.getAttribute('href') }));
  });

  // FAQ expand
  document.querySelectorAll('.faq-item summary, details.faq-item').forEach(el => {
    el.addEventListener('toggle', () => track('faq_toggle', { open: el.open }));
  });
});
