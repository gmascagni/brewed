// Google Analytics 4 (GA4) & Custom Event Helper for G-VT2YZ4KHHB

export const GA_MEASUREMENT_ID = 'G-VT2YZ4KHHB';

export const initGA = (measurementId = GA_MEASUREMENT_ID) => {
  if (typeof window === 'undefined' || !measurementId) return;

  // Check if gtag is already present from index.html
  if (!window.gtag) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);
  }

  // Setup global event delegation for all outbound Amazon affiliate links
  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (anchor && anchor.href && anchor.href.includes('amazon.com')) {
        const productName = anchor.getAttribute('data-product-name') || anchor.textContent.trim() || 'Amazon Product';
        const linkId = anchor.getAttribute('data-link-id') || anchor.id || 'amazon_link';
        const context = anchor.getAttribute('data-context') || 'general_app';

        trackAffiliateClick({
          link_id: linkId,
          product_name: productName,
          page_path: window.location.pathname,
          educational_context: context,
          target_url: anchor.href
        });
      }
    });
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.log(`[Analytics Event]: ${eventName}`, params);
  }
};

export const trackAffiliateClick = ({ link_id, product_name, page_path, educational_context, target_url }) => {
  const eventParams = {
    event_category: 'ecommerce_affiliate',
    link_id: link_id || 'amazon_affiliate_link',
    product_name: product_name || 'Amazon Product',
    page_path: page_path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    educational_context: educational_context || 'educational_guide',
    target_url: target_url || '',
    value: 1.0
  };

  // Fire both standard GA4 affiliate_click and custom amazon_click
  trackEvent('affiliate_click', eventParams);
  trackEvent('amazon_click', eventParams);
};
