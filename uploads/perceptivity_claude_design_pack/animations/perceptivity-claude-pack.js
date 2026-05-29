// Perceptivity Claude Design Pack animations

(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".pc-reveal");
  if (reduce) {
    revealEls.forEach(el => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.16 });

  revealEls.forEach(el => io.observe(el));

  const parallaxEls = document.querySelectorAll("[data-pc-parallax]");
  let ticking = false;
  const tick = () => {
    const y = window.scrollY || 0;
    parallaxEls.forEach(el => {
      const speed = Number(el.dataset.pcParallax || 0.06);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(tick);
      ticking = true;
    }
  }, { passive:true });
})();
