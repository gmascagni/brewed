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
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.log(`[Analytics Event]: ${eventName}`, params);
  }
};
