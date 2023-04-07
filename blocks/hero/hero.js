export default async function decorate(block) {
  const title = block.children[0].querySelector('h1');
  const words = title.innerHTML.split(' ');
  const temp = document.createElement('div');
  var i = 1;
  const wordsLength = words.length;
  words.forEach(
    (word) => {
      const span = document.createElement('span');
      span.innerHTML = word;
      span.style.animation = 'fade-in ' + (2 * wordsLength / 10) + 's ' + (2 * i++ / 10) + 's forwards cubic-bezier(0.6, 0, 1, 1)';
      temp.append(span);
    }
  );
  title.innerHTML = temp.innerHTML;
}
