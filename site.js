/* MyDocDesk multi-page: mobile hamburger menu */
(function () {
  var btn = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }
  btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  var root = document.documentElement;
  var inner = nav.parentNode;
  function fits() {
    // Measure the inline (desktop) layout: every link must fit between the brand and the actions.
    root.classList.remove("nav-compact");
    if (getComputedStyle(nav).position === "fixed") return true; // CSS breakpoint already collapsed it
    var over = nav.scrollWidth > nav.clientWidth + 1 || inner.scrollWidth > inner.clientWidth + 1;
    var links = nav.querySelectorAll(".site-nav-link");
    var actions = inner.querySelector(".site-header-actions");
    var brand = inner.querySelector(".site-brand");
    if (links.length && actions && brand) {
      var first = links[0].getBoundingClientRect(), last = links[links.length - 1].getBoundingClientRect();
      if (last.right > actions.getBoundingClientRect().left - 4 || first.left < brand.getBoundingClientRect().right + 4) over = true;
    }
    return !over;
  }
  function checkFit() {
    var ok = fits();
    root.classList.toggle("nav-compact", !ok);
    if (ok && getComputedStyle(nav).position !== "fixed") setOpen(false);
  }
  window.mdNavCheckFit = checkFit;
  window.addEventListener("resize", checkFit);
  window.addEventListener("load", checkFit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkFit);
  new MutationObserver(checkFit).observe(root, { attributes: true, attributeFilter: ["lang"] });
  checkFit();
})();
