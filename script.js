document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const navbar = document.getElementById('navbar');
  const toggleBurgerOpen = () => {
    burgerLines = Array.from(burgerBtn.children);
    burgerLines.forEach((line) => line.classList.toggle('active'));
    navbar.classList.toggle('active');
  };
  burgerBtn.addEventListener('click', toggleBurgerOpen);
});
