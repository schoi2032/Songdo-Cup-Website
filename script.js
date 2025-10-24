const field = document.getElementById('field');

const defaultPositions = [
  { x: 10, y: 45, name: 'GK' },
  { x: 30, y: 20, name: 'DEF1' },
  { x: 30, y: 70, name: 'DEF2' },
  { x: 50, y: 35, name: 'MID1' },
  { x: 50, y: 55, name: 'MID2' },
  { x: 70, y: 30, name: 'FWD1' },
  { x: 70, y: 60, name: 'FWD2' },
];

defaultPositions.forEach(p => createPlayer(p.x, p.y, p.name));

function createPlayer(x, y, name) {
  const player = document.createElement('div');
  player.classList.add('player');
  player.style.left = `${x}%`;
  player.style.top = `${y}%`;
  player.textContent = name;
  field.appendChild(player);

  // Dragging logic
  let offsetX, offsetY, isDragging = false;

  player.addEventListener('mousedown', startDrag);
  player.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    isDragging = true;
    const rect = player.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = field.getBoundingClientRect();
    let left = ((clientX - rect.left - offsetX) / rect.width) * 100;
    let top = ((clientY - rect.top - offsetY) / rect.height) * 100;
    left = Math.min(95, Math.max(0, left));
    top = Math.min(95, Math.max(0, top));
    player.style.left = `${left}%`;
    player.style.top = `${top}%`;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
  }

  // Rename logic
  player.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    input.className = 'name-edit';
    input.value = player.textContent;
    input.style.left = player.style.left;
    input.style.top = player.style.top;
    field.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      player.textContent = input.value || player.textContent;
      input.remove();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') input.blur();
    });
  });
}

