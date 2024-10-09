export default function splitTextIntoSpan(selector) {
  const targetElem = document.querySelectorAll(selector);
  if (!targetElem) {
    return;
  }

  targetElem.forEach((elem) => {
    const targetText = elem.textContent;
    
    let result = '';

    for (let i = 0; i < targetText.length; i++) {
      if (targetText[i] === ' ') {
        result += `<span>&nbsp</span>`;
        continue;
      }
      result += `<span>${targetText[i]}</span>`;
    }

    elem.innerHTML = result;
  });

  return targetElem;
}
