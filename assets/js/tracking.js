!(function (w, d, s, u, n, a, b) {
  if (w[n]) return;
  a = w[n] = {
    q: [],
    t: +new Date(),
    s: [],
    o: u,
    track: function () {
      a.q.push([+new Date()].concat([].slice.call(arguments)));
    },
    setScope: function () {
      a.s = [].slice.call(arguments).filter(function (x) {
        return typeof x === "string";
      });
      a.q.push([+new Date(), "setScope"].concat(a.s));
    },
    scope: function () {
      var c = [].slice.call(arguments);
      return {
        track: function () {
          a.q.push(
            [+new Date()]
              .concat([].slice.call(arguments))
              .concat([{ __scope: c }]),
          );
        },
      };
    },
  };
  b = d.createElement(s);
  b.async = 1;
  b.src = u + "/s.js";
  d.getElementsByTagName(s)[0].parentNode.insertBefore(
    b,
    d.getElementsByTagName(s)[0],
  );
})(window, document, "script", "https://t.whop.tw", "whop");
whop.setScope("biz_ZWtfEcddSAJb77");
whop.track("page");

(function () {
  var SESSION_PV_COUNT_KEY = "cvg_session_pv_count";
  var FIRED_PV2_KEY = "cvg_fired_pv2";
  var FIRED_PV3_KEY = "cvg_fired_pv3";
  var SCROLL_25_KEY = "cvg_scroll_25";
  var SCROLL_50_KEY = "cvg_scroll_50";
  var SCROLL_75_KEY = "cvg_scroll_75";

  var OUTBOUND_EVENTS = [
    { domain: "getreyou.com", eventName: "TBB Reyou Click" },
    { domain: "pacagen.com", eventName: "TBB Pacagen Click" },
    { domain: "drinkwildtype.com", eventName: "TBB Wildtype Click" },
  ];

  var eventQueue = [];
  var retryInterval = null;

  function drainQueue() {
    if (
      typeof window.cvg === "undefined" ||
      typeof window.cvg.process !== "function"
    )
      return;
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }
    while (eventQueue.length > 0) {
      window.cvg(eventQueue.shift());
    }
  }

  function safeTrack(data) {
    eventQueue.push(data);
    if (
      typeof window.cvg !== "undefined" &&
      typeof window.cvg.process === "function"
    ) {
      drainQueue();
    } else if (!retryInterval) {
      retryInterval = setInterval(drainQueue, 200);
    }
  }

  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  }

  // --------------------------------------------------------------------
  // Centralized attribution utility (window.TBBTracking)
  //
  // Main-site domains are the partner domains already configured in
  // OUTBOUND_EVENTS above (pacagen.com, getreyou.com, drinkwildtype.com,
  // plus their subdomains). Only links to those hosts are rewritten.
  //
  // path_source semantics are UNCHANGED from the original implementation:
  // getPathSource() derives it from the page slug, e.g.
  // /pages/face-mists-worth-the-hype.html -> "face-mists-worth-the-hype".
  // What is new is persistence: the slug (or an explicit path_source
  // arriving on the landing URL) is captured once, stored with the Meta
  // parameters for 30 days, and reused on later WL pages instead of being
  // recomputed from every subsequent page. Every inbound query parameter
  // is captured, persisted, and transferred to main-domain CTAs. Exceptions:
  // - utm_source: persisted as-is, but sent as "channel"; outbound
  //   utm_source is always this site's initials ("tbb").
  // - Internal Converge identity keys (__cvg_*) are never persisted;
  //   appendCvgParams still forwards live cookie values separately.
  // ---------------------------------------------------------------------
  var SITE_SOURCE = "tbb";
  // Keys used only to detect a genuinely new ad visit (replace vs merge).
  var ATTRIBUTION_ID_KEYS = [
    "fbclid",
    "tw_adid",
    "cvg_adid",
    "cvg_cid",
    "utm_id",
    "campaign_id",
    "ad_id",
  ];
  var ATTRIBUTION_STORAGE_KEY = "tbb_attribution_v1";
  var ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  var memoryAttribution = null;

  // Page slug used as the path_source value on partner CTAs, e.g.
  // /pages/face-mists-worth-the-hype.html -> "face-mists-worth-the-hype".
  function getPathSource() {
    var segments = (window.location.pathname || "")
      .split("/")
      .filter(function (s) {
        return s;
      });
    var slug = segments.length ? segments[segments.length - 1] : "index";
    slug = slug.replace(/\.html?$/i, "");
    return slug || "index";
  }

  // Partner domains whose CTAs get tracking params: Pacagen, RE:YOU, WildType.
  function isPartnerUrl(url) {
    if (!url || typeof url !== "string") return false;
    var host = "";
    try {
      host = new URL(url, window.location.href).hostname;
    } catch (x) {
      return false;
    }
    if (!host) return false;
    for (var i = 0; i < OUTBOUND_EVENTS.length; i++) {
      var d = OUTBOUND_EVENTS[i].domain;
      if (host === d || host.endsWith("." + d)) return true;
    }
    return false;
  }

  // Valid = present, non-empty, and not an unresolved Meta macro such as
  // "{{ad.id}}" (also rejected in its percent-encoded form, which
  // URLSearchParams decodes back to braces before we see it).
  function isValidTrackingValue(value) {
    if (typeof value !== "string") return false;
    var v = value.trim();
    if (!v) return false;
    if (
      v.indexOf("{{") !== -1 ||
      v.indexOf("}}") !== -1 ||
      v.indexOf("{") !== -1 ||
      v.indexOf("}") !== -1
    )
      return false;
    var lower = v.toLowerCase();
    if (lower === "null" || lower === "undefined") return false;
    return true;
  }

  // Skip internal / identity params that must not be persisted from the
  // landing URL (Converge cookies are re-attached live on click).
  function shouldCaptureParam(key) {
    if (!key) return false;
    if (key.indexOf("__cvg_") === 0) return false;
    return true;
  }

  // Capture every valid query parameter from a URL (default: current page).
  function parseTrackingParams(source) {
    var params = {};
    var search = "";
    if (typeof source === "string" && source) {
      try {
        search = new URL(source, window.location.href).search;
      } catch (x) {
        var q = source.indexOf("?");
        search = q === -1 ? "" : source.slice(q).split("#")[0];
      }
    } else if (window.location && typeof window.location.search === "string") {
      search = window.location.search;
    }
    var query;
    try {
      query = new URLSearchParams(search);
    } catch (x) {
      return params;
    }
    query.forEach(function (value, key) {
      if (!shouldCaptureParam(key)) return;
      if (isValidTrackingValue(value)) params[key] = value.trim();
    });
    return params;
  }

  function copyValidParams(from) {
    var out = {};
    if (!from || typeof from !== "object") return out;
    Object.keys(from).forEach(function (key) {
      if (!shouldCaptureParam(key)) return;
      if (isValidTrackingValue(from[key])) out[key] = String(from[key]).trim();
    });
    return out;
  }

  function readStoredAttribution() {
    // 1) localStorage
    try {
      var raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (x) {
      /* storage blocked: fall through */
    }
    // 2) first-party cookie fallback
    var cookie = "";
    try {
      cookie = getCookie(ATTRIBUTION_STORAGE_KEY);
    } catch (x) {
      /* ignore */
    }
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie));
      } catch (x) {
        /* ignore */
      }
    }
    // 3) in-memory fallback (blocked storage still works for this page)
    return memoryAttribution;
  }

  function writeStoredAttribution(attr) {
    memoryAttribution = attr;
    var raw = JSON.stringify(attr);
    try {
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, raw);
      return;
    } catch (x) {
      /* fall through to cookie */
    }
    try {
      var expires = new Date(attr.expiresAt).toUTCString();
      document.cookie =
        ATTRIBUTION_STORAGE_KEY +
        "=" +
        encodeURIComponent(raw) +
        "; expires=" +
        expires +
        "; path=/; SameSite=Lax";
    } catch (x) {
      /* memory only */
    }
  }

  function clearStoredAttribution() {
    memoryAttribution = null;
    try {
      window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
    } catch (x) {
      /* ignore */
    }
    try {
      document.cookie =
        ATTRIBUTION_STORAGE_KEY +
        "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    } catch (x) {
      /* ignore */
    }
  }

  // Returns the stored attribution, discarding it if expired or malformed.
  function loadAttribution(now) {
    now = typeof now === "number" ? now : Date.now();
    var attr = readStoredAttribution();
    if (
      !attr ||
      typeof attr !== "object" ||
      !attr.params ||
      typeof attr.params !== "object"
    )
      return null;
    if (typeof attr.expiresAt !== "number" || attr.expiresAt <= now) {
      clearStoredAttribution();
      return null;
    }
    return {
      params: copyValidParams(attr.params),
      capturedAt: attr.capturedAt || now,
      expiresAt: attr.expiresAt,
    };
  }

  // Capture every inbound query param from a URL (default: current page)
  // and persist them. Missing/empty/invalid values never overwrite stored
  // ones. A conflicting ad identifier means a genuinely new ad visit, so
  // the old attribution is replaced rather than combined with the new one.
  function captureAttribution(source, now) {
    now = typeof now === "number" ? now : Date.now();
    var incoming = parseTrackingParams(source);
    var stored = loadAttribution(now);

    var isNewVisit = false;
    if (stored) {
      for (var i = 0; i < ATTRIBUTION_ID_KEYS.length; i++) {
        var idKey = ATTRIBUTION_ID_KEYS[i];
        if (
          incoming[idKey] &&
          stored.params[idKey] &&
          incoming[idKey] !== stored.params[idKey]
        ) {
          isNewVisit = true;
          break;
        }
      }
    }

    var params;
    var capturedAt;
    if (!stored || isNewVisit) {
      params = copyValidParams(incoming);
      // Establish the original path_source using the existing slug
      // implementation when the landing URL did not carry one.
      if (!params.path_source) params.path_source = getPathSource();
      capturedAt = now;
    } else {
      params = copyValidParams(stored.params);
      var hasIncoming = false;
      Object.keys(incoming).forEach(function (mergeKey) {
        params[mergeKey] = incoming[mergeKey];
        hasIncoming = true;
      });
      if (!params.path_source) params.path_source = getPathSource();
      // Refresh the 30-day window only when new valid data arrived;
      // plain navigation keeps the original capture time and expiry.
      capturedAt = hasIncoming ? now : stored.capturedAt;
      var merged = {
        params: params,
        capturedAt: capturedAt,
        expiresAt: hasIncoming ? now + ATTRIBUTION_TTL_MS : stored.expiresAt,
      };
      writeStoredAttribution(merged);
      memoryAttribution = merged;
      return merged;
    }

    var fresh = {
      params: params,
      capturedAt: capturedAt,
      expiresAt: now + ATTRIBUTION_TTL_MS,
    };
    writeStoredAttribution(fresh);
    return fresh;
  }

  // Append every available, valid, unexpired persisted parameter to a
  // main-domain URL. Existing destination params are preserved; tracking
  // params already on the destination are updated, never duplicated.
  // Encoding is handled by URL/URLSearchParams, so a stored path_source is
  // encoded exactly once. Non-partner, mailto:, tel: and other non-HTTP
  // links are returned untouched.
  //
  // utm_source is ALWAYS set to this site's initials ("tbb") on main-domain
  // CTAs. The utm_source captured from incoming traffic is moved to
  // "channel" (e.g. incoming utm_source=facebook goes out as
  // utm_source=tbb&channel=facebook).
  function withTrackingParams(url, now) {
    if (!isPartnerUrl(url)) return url;
    var attr = loadAttribution(now);
    var params = attr ? attr.params : {};
    var parsed;
    try {
      parsed = new URL(url, window.location.href);
    } catch (x) {
      return url;
    }
    Object.keys(params).forEach(function (key) {
      // utm_source / channel are applied below with site-source rules.
      if (key === "utm_source" || key === "channel") return;
      var value = params[key];
      if (isValidTrackingValue(value)) parsed.searchParams.set(key, value);
    });
    // Always stamp this WL site as the source on every main-domain CTA.
    parsed.searchParams.set("utm_source", SITE_SOURCE);
    if (isValidTrackingValue(params.utm_source)) {
      parsed.searchParams.set("channel", params.utm_source);
    } else if (isValidTrackingValue(params.channel)) {
      parsed.searchParams.set("channel", params.channel);
    }
    if (!isValidTrackingValue(parsed.searchParams.get("path_source"))) {
      parsed.searchParams.set("path_source", getPathSource());
    }
    return parsed.toString();
  }

  // Backwards-compatible helper: same as withTrackingParams (path_source
  // is included); kept so existing call sites keep working unchanged.
  function withPathSource(url) {
    return withTrackingParams(url);
  }

  // Tag every partner anchor already in the DOM so the params show on
  // hover / open-in-new-tab, not just after the click handler runs.
  function tagPartnerLinks(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var links = scope.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      if (isPartnerUrl(links[i].getAttribute("href") || "")) {
        links[i].href = withTrackingParams(links[i].href);
      }
    }
    // The root itself may be a partner anchor added dynamically.
    if (
      root &&
      root.tagName === "A" &&
      root.getAttribute("href") &&
      isPartnerUrl(root.getAttribute("href"))
    ) {
      root.href = withTrackingParams(root.href);
    }
  }

  // Client-side navigation (history API): re-capture without overwriting
  // the original attribution, then re-tag partner links.
  function handleClientNavigation() {
    captureAttribution();
    tagPartnerLinks(document);
  }

  window.TBBTracking = {
    siteSource: SITE_SOURCE,
    storageKey: ATTRIBUTION_STORAGE_KEY,
    ttlMs: ATTRIBUTION_TTL_MS,
    getPathSource: getPathSource,
    isPartnerUrl: isPartnerUrl,
    isValidTrackingValue: isValidTrackingValue,
    parseTrackingParams: parseTrackingParams,
    capture: captureAttribution,
    getAttribution: loadAttribution,
    clear: clearStoredAttribution,
    buildPartnerUrl: withTrackingParams,
    withPathSource: withPathSource,
    tagPartnerLinks: tagPartnerLinks,
    handleClientNavigation: handleClientNavigation,
  };

  // Capture on initial page load, before tagging any links.
  captureAttribution();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      tagPartnerLinks(document);
    });
  } else {
    tagPartnerLinks(document);
  }
  // Product cards / ads are injected after load, so keep tagging new nodes.
  if (window.MutationObserver && document.body) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
          var node = mutations[i].addedNodes[j];
          if (node.nodeType === 1) tagPartnerLinks(node);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener("popstate", handleClientNavigation);
  window.addEventListener("hashchange", handleClientNavigation);
  if (window.history && typeof window.history.pushState === "function") {
    var originalPushState = window.history.pushState;
    var originalReplaceState = window.history.replaceState;
    window.history.pushState = function () {
      var result = originalPushState.apply(this, arguments);
      setTimeout(handleClientNavigation, 0);
      return result;
    };
    window.history.replaceState = function () {
      var result = originalReplaceState.apply(this, arguments);
      setTimeout(handleClientNavigation, 0);
      return result;
    };
  }

  // Forward Converge identity onto partner domains. Inserts before any hash
  // so links like /pages/science#clinical-trial stay intact.
  function appendCvgParams(url) {
    url = withPathSource(url);
    var uid = getCookie("__cvg_uid");
    var sid = getCookie("__cvg_sid");
    var params = [];
    if (uid && url.indexOf("__cvg_uid=") === -1)
      params.push("__cvg_uid=" + encodeURIComponent(uid));
    if (sid && url.indexOf("__cvg_sid=") === -1)
      params.push("__cvg_sid=" + encodeURIComponent(sid));
    if (!params.length) return url;

    var hash = "";
    var hashIdx = url.indexOf("#");
    if (hashIdx !== -1) {
      hash = url.slice(hashIdx);
      url = url.slice(0, hashIdx);
    }
    return (
      url + (url.indexOf("?") !== -1 ? "&" : "?") + params.join("&") + hash
    );
  }

  function matchOutbound(url) {
    var host = "";
    try {
      host = new URL(url, window.location.href).hostname;
    } catch (x) {
      return null;
    }
    for (var i = 0; i < OUTBOUND_EVENTS.length; i++) {
      var d = OUTBOUND_EVENTS[i].domain;
      if (host === d || host.endsWith("." + d)) return OUTBOUND_EVENTS[i];
    }
    return null;
  }

  function handleOwnedClick(url) {
    var match = matchOutbound(url);
    var finalUrl = appendCvgParams(url);
    if (match) {
      safeTrack({
        method: "track",
        eventName: match.eventName,
        properties: { outbound_url: url },
      });
    }
    setTimeout(function () {
      window.location.href = finalUrl;
    }, 200);
    return false;
  }
  window.f = handleOwnedClick;

  // 1. Outbound click tracking
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    var host = "";
    try {
      host = new URL(link.href).hostname;
    } catch (x) {
      return;
    }
    for (var i = 0; i < OUTBOUND_EVENTS.length; i++) {
      var d = OUTBOUND_EVENTS[i].domain;
      if (host === d || host.endsWith("." + d)) {
        var finalUrl = appendCvgParams(link.href);
        safeTrack({
          method: "track",
          eventName: OUTBOUND_EVENTS[i].eventName,
          properties: {
            outbound_url: link.href,
          },
        });

        // Let modified clicks (new tab, etc.) proceed, with params already on the href.
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          link.href = finalUrl;
          break;
        }

        e.preventDefault();
        var pendingWin =
          link.target === "_blank" ? window.open("", "_blank") : null;
        if (pendingWin) pendingWin.opener = null;
        setTimeout(function () {
          if (pendingWin) {
            pendingWin.location.href = finalUrl;
          } else {
            window.location.href = finalUrl;
          }
        }, 200);
        break;
      }
    }
  });

  // 2. Scroll depth 25 / 50 / 75 — once per session per threshold
  var maxScroll = 0;
  function readScrollDepth() {
    var total = document.documentElement.scrollHeight;
    if (total <= 0) return 0;
    return Math.min(1, (window.scrollY + window.innerHeight) / total);
  }
  function checkScrollThresholds() {
    var depth = readScrollDepth();
    if (depth > maxScroll) maxScroll = depth;
    var d = maxScroll;
    if (d >= 0.25 && !sessionStorage.getItem(SCROLL_25_KEY)) {
      sessionStorage.setItem(SCROLL_25_KEY, "1");
      safeTrack({ method: "track", eventName: "Scroll Depth 25%" });
    }
    if (d >= 0.5 && !sessionStorage.getItem(SCROLL_50_KEY)) {
      sessionStorage.setItem(SCROLL_50_KEY, "1");
      safeTrack({ method: "track", eventName: "Scroll Depth 50%" });
    }
    if (d >= 0.75 && !sessionStorage.getItem(SCROLL_75_KEY)) {
      sessionStorage.setItem(SCROLL_75_KEY, "1");
      safeTrack({ method: "track", eventName: "Scroll Depth 75%" });
    }
  }
  window.addEventListener("scroll", checkScrollThresholds, { passive: true });
  checkScrollThresholds();

  // 3. Session pageview milestones
  var raw = sessionStorage.getItem(SESSION_PV_COUNT_KEY);
  var prev = raw ? parseInt(raw, 10) : 0;
  var next = isFinite(prev) ? prev + 1 : 1;
  sessionStorage.setItem(SESSION_PV_COUNT_KEY, String(next));

  if (next === 2 && !sessionStorage.getItem(FIRED_PV2_KEY)) {
    sessionStorage.setItem(FIRED_PV2_KEY, "1");
    safeTrack({
      method: "track",
      eventName: "Session Pageviews 2",
      properties: { session_page_views: 2 },
    });
  }
  if (next === 3 && !sessionStorage.getItem(FIRED_PV3_KEY)) {
    sessionStorage.setItem(FIRED_PV3_KEY, "1");
    safeTrack({
      method: "track",
      eventName: "Session Pageviews 3",
      properties: { session_page_views: 3 },
    });
  }
})();
