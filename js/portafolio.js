(() => {
  const filterButtons = document.querySelectorAll('.portfolio__filter-btn');
  const cards = document.querySelectorAll('#portfolio-grid .projects__card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach((card) => {
        const matches = filter === 'todo' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
})();
