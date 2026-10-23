document.addEventListener('DOMContentLoaded', function () {
  const chartGroup = document.querySelector('[data-assay-charts]');
  if (chartGroup) {
    const tablist = chartGroup.querySelector('[role="tablist"]');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = [...chartGroup.querySelectorAll('.assay-chart')];
    function selectTab(index, focus) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    }
    panels.forEach((panel, i) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[i].id);
      panel.tabIndex = 0;
    });
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(i, false));
      tab.addEventListener('keydown', event => {
        const index = event.key === 'ArrowRight' ? (i + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length
          : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
        if (index !== null) {
          event.preventDefault();
          selectTab(index, true);
        }
      });
    });
    selectTab(0, false);
    tablist.hidden = false;
  }

  if (typeof insertReviewWrite === 'function') {
    insertReviewWrite('#comments-section', { storageKey: 'tbb-nutrafol-vs-novogro', comments: [] });
  }
  if (typeof insertNewsletter === 'function') {
    insertNewsletter('#newsletter-placeholder', { tagline: 'We expose what brands hide. Get the real story every week.', pageType: 'blog' });
  }
  const sideAd = document.getElementById('ad-side-placeholder');
  if (sideAd && typeof createAdSide === 'function') {
    sideAd.innerHTML = createAdSide({ pageType: 'blog', mode: 'desktop', image: 'veronica_vertical.png' });
    function positionSideAd() {
      const article = document.querySelector('.article-shell');
      const rect = article.getBoundingClientRect();
      const hasSpace = window.innerWidth > 768 && window.innerWidth - rect.right >= 176;
      sideAd.style.display = hasSpace ? '' : 'none';
      if (hasSpace) {
        sideAd.style.left = `${rect.right + 16}px`;
        sideAd.style.top = `${Math.max(rect.top, 16)}px`;
      }
    }
    positionSideAd();
    window.addEventListener('resize', positionSideAd);
    window.addEventListener('scroll', positionSideAd, { passive: true });
  }
});
