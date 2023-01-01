export default async function decorateCarousel(block) {
  // Convert block to ordered list
  const carousel = document.createElement('ol');
  var currentSlide = 0;

  [...block.children].forEach((row) => {
    const paragraphs = row.querySelectorAll('p');
    if (paragraphs.length == 3) {
      const comment = document.createElement('div');
      comment.className = 'carousel-item-body';

      const stars = document.createElement('div');
      stars.textContent = paragraphs[0].innerText;
      comment.append(stars);

      const quote = document.createElement('blockquote');
      const text = document.createElement('p');
      text.innerHTML = paragraphs[1].innerHTML;
      quote.append(text);
      const author = document.createElement('cite');
      author.textContent = paragraphs[2].innerHTML;
      quote.append(author);
      comment.append(quote);

      const slide = document.createElement('li');
      slide.append(comment);
      carousel.append(slide);
    }
  });

  block.textContent = '';
  block.append(carousel);

  // Buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-previous-button';
  prevButton.innerHTML = '<';
  block.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-next-button';
  nextButton.innerHTML = '>';
  block.append(nextButton);

  let slides = carousel.querySelectorAll('li');

  // Next Carousel
  const nextCarousel = () => {
    if (currentSlide > slides.length) {
      currentSlide = 0;
      carousel.scrollTo(0, 0);
    }
    currentSlide++;
    carousel.scrollBy(300, 0);
  };

  nextButton.addEventListener('click', e => {
    nextCarousel();
  });

  // Previous Carousel
  const prevCarousel = () => {
    if (currentSlide === 0) {
      currentSlide = slides.length - 1;
      carousel.scrollTo(4800, 0);
    }
    currentSlide--;
    carousel.scrollBy(-300, 0);
  };

  prevButton.addEventListener('click', e => {
    prevCarousel();
  });

  const intervalTime = 5000;
  let sliderInterval;

  const auto = window.innerWidth > 1200;
  if (auto) {
    sliderInterval = setInterval(nextCarousel, intervalTime);
  }

  carousel.addEventListener('mouseover', (stopInterval) => {
    clearInterval(sliderInterval);
  });

  carousel.addEventListener('mouseleave', (startInterval) => {
    if (auto) {
      sliderInterval = setInterval(nextCarousel, intervalTime);
    }
  });

  // For mobile events
  carousel.addEventListener('touchstart', (stopIntervalT) => {
    clearInterval(sliderInterval);
  });
  carousel.addEventListener('touchend', (startIntervalT) => {
    if (auto) {
      sliderInterval = setInterval(nextCarousel, intervalTime);
    }
  });

  // Debounce
  var previousCall;
  window.addEventListener('resize', () => {
    if (previousCall >= 0) {
      clearTimeout(previousCall);
    }
    previousCall = setTimeout(() => {
      carousel.scrollBy(-300, 0);
    }, 200);
  });
}