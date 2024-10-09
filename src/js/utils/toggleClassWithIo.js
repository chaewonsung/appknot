export default function toggleClassWithIo(targetNode, className, options) {
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio) {
        targetNode.classList.toggle(className);
      }
    });
  }, options).observe(targetNode);
}
