export function animateJeanMichel(duration) {
  const maxX = 1100;
  const maxY = -450;
  const keyframes = Array.from({ length: 15 }, () => ({
    translateY: Math.floor(Math.random() * maxY) + 1,
    translateX: Math.floor(Math.random() * maxX) + 1
  }));

  return anime({
    targets: '#jeanmichel',
    keyframes,
    duration,
    easing: 'easeInOutSine',
    direction: 'alternate'
  });
}
