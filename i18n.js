// ============================================================================
// MyDocDesk — Site configuration, EN/ΕΛ language layer & Anastasia voice clips
// ============================================================================

// ---- Site configuration: change the pilot-call email address here (one place) ----
const SITE_CONFIG = {
  pilotEmail: "hello@mydocdesk.com"
};

const I18N_STORAGE_KEY = "mydocdesk-lang";
const I18N = { lang: "en", missing: new Set() };

(function initLang() {
  let lang = "en";
  try {
    const p = new URLSearchParams(window.location.search).get("lang");
    if (p === "el" || p === "en") {
      lang = p;
      try { localStorage.setItem(I18N_STORAGE_KEY, p); } catch (_) {}
    } else {
      const saved = localStorage.getItem(I18N_STORAGE_KEY);
      if (saved === "el" || saved === "en") lang = saved;
    }
  } catch (_) {}
  I18N.lang = lang;
  document.documentElement.lang = lang;
  if (lang === "el") document.documentElement.classList.add("lang-el");
})();

function i18nNorm(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
}

/** Translate a whole English UI/data string (exact match, whitespace-normalised). */
function tr(s) {
  if (I18N.lang !== "el" || s == null) return s;
  const dict = window.I18N_EL || {};
  const k = i18nNorm(s);
  if (Object.prototype.hasOwnProperty.call(dict, k)) return dict[k];
  if (/[A-Za-z]{3,}/.test(k)) I18N.missing.add(k);
  return s;
}

/** Inline bilingual template helper: L(english, greek). */
function L(en, el) {
  return I18N.lang === "el" ? el : en;
}

function isGreekUI() {
  return I18N.lang === "el";
}

// ---------------------------------------------------------------------------
// Static page translation (runs once on load when Greek is active)
// ---------------------------------------------------------------------------
const I18N_SKIP_IDS = new Set([
  "call-transcript-list", "wa-messages-list", "case-note-grid", "execution-logs-list",
  "doctor-schedule-list", "gesy-queue-box", "marketplace-doctors-grid",
  "caller-phone-display", "call-status-label", "case-id-badge", "case-note-coverage",
  "triage-prio-pill", "triage-prio-headline", "abcd-digest-preview-text", "abcd-sim-badge",
  "abcd-sim-status", "triage-subcal-strip", "topbar-tagline", "topbar-domain-pill",
  "topbar-brand-html", "roi-calls-val", "roi-fee-val", "roi-gesy-val", "roi-hours-saved",
  "roi-missed-rev", "roi-slots-saved", "kpi-total-bookings", "kpi-total-sub", "kpi-urgent-slots",
  "kpi-urgent-sub", "kpi-gesy-count", "kpi-gesy-sub", "schedule-clinic-title", "schedule-clinic-sub",
  "call-clinic-title", "wa-clinic-title", "wa-clinic-phone", "active-brand-pill", "lang-switch"
]);
const I18N_INLINE_TAGS = new Set(["STRONG", "EM", "B", "I", "CODE", "BR", "A", "SMALL", "SUP", "SUB", "U", "ABBR"]);
const I18N_INTERACTIVE = "button, input, select, textarea, img, svg, form, iframe, video, audio";

function i18nIsInline(el) {
  const tag = el.tagName;
  const inlineSpan = tag === "SPAN" && (!el.className || /\bjs-brand-name\b/.test(el.className));
  if (!I18N_INLINE_TAGS.has(tag) && !inlineSpan) return false;
  return [...el.children].every(i18nIsInline);
}

function i18nSkip(el) {
  if (!el || el.nodeType !== 1) return true;
  if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) return true;
  if (el.id && I18N_SKIP_IDS.has(el.id)) return true;
  if (el.hasAttribute("data-no-i18n")) return true;
  return false;
}

function i18nTranslateTextNodes(el) {
  const dict = window.I18N_EL || {};
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      const k = i18nNorm(n.textContent);
      if (!k || !/[A-Za-z]/.test(k)) return;
      if (Object.prototype.hasOwnProperty.call(dict, k)) {
        const lead = /^\s/.test(n.textContent) ? " " : "";
        const trail = /\s$/.test(n.textContent) ? " " : "";
        n.textContent = lead + dict[k] + trail;
      } else {
        I18N.missing.add(k);
      }
    } else if (n.nodeType === 1) {
      i18nTranslateTree(n);
    }
  });
}

function i18nTranslateTree(el) {
  if (i18nSkip(el)) return;
  i18nTranslateAttrs(el);
  const dict = window.I18N_EL || {};
  const hasDirectText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const inlineOnly = [...el.children].every(i18nIsInline);
  const text = i18nNorm(el.textContent);
  if ((hasDirectText || inlineOnly) && text) {
    if (!/[A-Za-z]/.test(text)) return;
    if (Object.prototype.hasOwnProperty.call(dict, text) && !el.querySelector(I18N_INTERACTIVE)) {
      el.innerHTML = dict[text];
      el.querySelectorAll("*").forEach(i18nTranslateAttrs);
      return;
    }
    if (inlineOnly && !hasDirectText) {
      [...el.children].forEach(i18nTranslateTree);
      return;
    }
    if (el.querySelector(I18N_INTERACTIVE) || !inlineOnly) {
      i18nTranslateTextNodes(el);
      return;
    }
    // Fallback: dynamic content (e.g. live counters) — translate the static text nodes individually
    const dictHasNode = [...el.childNodes].some((n) => n.nodeType === 3 && Object.prototype.hasOwnProperty.call(dict, i18nNorm(n.textContent)));
    if (dictHasNode) {
      i18nTranslateTextNodes(el);
      return;
    }
    I18N.missing.add(text);
    return;
  }
  [...el.children].forEach(i18nTranslateTree);
}

function i18nTranslateAttrs(el) {
  ["placeholder", "aria-label", "title", "alt", "data-tour-label"].forEach((a) => {
    const v = el.getAttribute && el.getAttribute(a);
    if (v && /[A-Za-z]{2,}/.test(v)) {
      const t = tr(v);
      if (t !== v) el.setAttribute(a, t);
    }
  });
}

function i18nApplyHead() {
  if (!isGreekUI()) return;
  const set = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  };
  const desc = "Το MyDocDesk δίνει στους γιατρούς και οδοντιάτρους της Κύπρου μια AI ιατρική γραμματέα, την Αναστασία, που απαντά σε κλήσεις και μηνύματα WhatsApp, ταξινομεί κατά επείγον, συντάσσει σημείωμα πριν από την επίσκεψη και προστατεύει το πρόγραμμα του γιατρού.";
  set('meta[name="description"]', "content", desc);
  set('meta[property="og:locale"]', "content", "el_GR");
}

// ---------------------------------------------------------------------------
// Language switch (EN / ΕΛ) — reloads with ?lang= so every view is consistent
// ---------------------------------------------------------------------------
function setSiteLanguage(lang) {
  if (lang !== "el" && lang !== "en") return;
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch (_) {}
  if (lang === I18N.lang) return;
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  const activeTab = document.querySelector(".nav-tab.active")?.dataset.tab;
  if (activeTab && activeTab !== "simulator") url.searchParams.set("tab", activeTab);
  else url.searchParams.delete("tab");
  window.location.assign(url.toString());
}

function i18nSyncSwitch() {
  document.querySelectorAll(".lang-switch-btn").forEach((b) => {
    const on = b.dataset.lang === I18N.lang;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

// ---------------------------------------------------------------------------
// Pilot-call CTA (mailto built from SITE_CONFIG.pilotEmail)
// ---------------------------------------------------------------------------
function buildPilotMailto() {
  const subject = L("MyDocDesk pilot call", "MyDocDesk — πιλοτική κλήση");
  const body = L(
    "Hi Christos,\n\nI'd like to book a 15-minute MyDocDesk pilot call.\n\nClinic name & specialty:\nCity:\nLandline or mobile used for appointments:\nBest days/times to talk:\n\nThank you,\n",
    "Γεια σας Χρίστο,\n\nΘα ήθελα να κλείσω μια 15λεπτη πιλοτική κλήση για το MyDocDesk.\n\nΌνομα ιατρείου & ειδικότητα:\nΠόλη:\nΣταθερό ή κινητό για ραντεβού:\nΚαλύτερες ημέρες/ώρες για επικοινωνία:\n\nΕυχαριστώ,\n"
  );
  return `mailto:${SITE_CONFIG.pilotEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function i18nWirePilotLinks() {
  const href = buildPilotMailto();
  document.querySelectorAll(".js-pilot-cta").forEach((a) => a.setAttribute("href", href));
}

// ---------------------------------------------------------------------------
// Anastasia voice: pre-generated neural clips with speechSynthesis fallback
// ---------------------------------------------------------------------------
function voiceClipKey(text, lang) {
  // FNV-1a 32-bit over UTF-16 code units of "<lang>|<normalised text>"
  const s = `${(lang || "en-GB").slice(0, 2).toLowerCase()}|${i18nNorm(text)}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${s.slice(0, 2)}-${h.toString(16).padStart(8, "0")}`;
}

const VOICE_PLAYER = { audio: null };

function stopAnastasiaVoice() {
  if (VOICE_PLAYER.audio) {
    try { VOICE_PLAYER.audio.pause(); } catch (_) {}
    VOICE_PLAYER.audio = null;
  }
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (_) {}
  }
}

function speakWithBrowserVoice(text, lang) {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

function speakAnastasiaText(text, lang = "en-GB") {
  stopAnastasiaVoice();
  const plain = String(text || "").replace(/<[^>]+>/g, "");
  const key = voiceClipKey(plain, lang);
  const clips = window.VOICE_CLIPS || {};
  if (!clips[key]) {
    speakWithBrowserVoice(plain, lang);
    return;
  }
  try {
    const audio = new Audio(`./assets/voice/${key}.mp3`);
    audio.preload = "auto";
    VOICE_PLAYER.audio = audio;
    let fellBack = false;
    const fallback = () => {
      if (fellBack || VOICE_PLAYER.audio !== audio) return;
      fellBack = true;
      VOICE_PLAYER.audio = null;
      speakWithBrowserVoice(plain, lang);
    };
    audio.addEventListener("error", fallback);
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(fallback);
  } catch (_) {
    speakWithBrowserVoice(plain, lang);
  }
}

// ---------------------------------------------------------------------------
// Boot: translate before app.js renders (this listener is registered first)
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  i18nSyncSwitch();
  i18nWirePilotLinks();
  if (isGreekUI()) {
    i18nApplyHead();
    i18nTranslateTree(document.body);
  }
  document.documentElement.classList.remove("i18n-pending");
});
