import { createOptimizedPicture } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const maxWidth = 500;

  const container = block.children[0];
  if (container.children.length === 2) {
    container.className = 'before-after-container';

    // Replace images with optimized pictures
    container.querySelectorAll('img').forEach((img, index) => {
      var eager = (index % 2) != 0; // To make sure the right image is not lazy loaded
      console.log('eager', index, eager);
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, eager, [{ width: maxWidth }])
      );
      img.width = maxWidth + 'px';
    });

    // Decorate images
    [...container.children].forEach((row) => {
      row.className = 'before-after-image';
      row.style.width = maxWidth + 'px';
    });
    container.children[1].className += ' before-after-image-overlay';

    // Slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    slider.style.width = (maxWidth + 40) + 'px';
    slider.oninput = adjustOverlay;
    container.append(slider);
    adjustOverlay();

    function adjustOverlay() {
      const image = slider.parentElement.querySelectorAll('.before-after-image-overlay')[0];
      image.style.clipPath = 'polygon(' + slider.value + '% 0, 100% 0, 100% 100%, ' + slider.value + '% 100%)';
    }
  }
}
