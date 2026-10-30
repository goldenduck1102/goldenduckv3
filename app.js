(() => {
  'use strict';

  function initializeNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const navigation = document.getElementById('main-nav');
    if (!toggle || !navigation) return;

    function setOpen(open, returnFocus = false) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      navigation.classList.toggle('is-open', open);
      if (returnFocus) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });
    const desktop = window.matchMedia('(min-width: 768px)');
    desktop.addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  function initializeGallery() {
    const items = Array.from(document.querySelectorAll('[data-gallery-src]'));
    const dialog = document.getElementById('gallery-dialog');
    const picture = document.getElementById('gallery-image');
    const caption = document.getElementById('gallery-caption');
    const close = document.getElementById('gallery-close');
    const previous = document.getElementById('gallery-prev');
    const next = document.getElementById('gallery-next');
    if (!items.length || !dialog || !picture || !close) return;

    let activeIndex = 0;
    let opener = null;
    let previousOverflow = '';

    function display(index) {
      activeIndex = (index + items.length) % items.length;
      const item = items[activeIndex];
      picture.hidden = false;
      picture.alt = item.dataset.galleryAlt || 'Khoảnh khắc cùng OrcheStars';
      picture.src = item.dataset.gallerySrc;
      if (caption) caption.textContent = (item.dataset.galleryCaption || picture.alt) + (item.dataset.gallerySrc.endsWith('.svg') && window.innerWidth < 768 ? '. Vuốt ngang trên sơ đồ để xem toàn bộ.' : '');
      if (previous) previous.disabled = items.length < 2;
      if (next) next.disabled = items.length < 2;
    }

    function closeGallery() {
      if (dialog.open) dialog.close();
    }

    items.forEach((item, index) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        if (typeof dialog.showModal !== 'function') {
          window.open(item.dataset.gallerySrc, '_blank', 'noopener,noreferrer');
          return;
        }
        opener = item;
        display(index);
        if (!dialog.open) {
          previousOverflow = document.body.style.overflow;
          dialog.showModal();
          document.body.style.overflow = 'hidden';
        }
        close.focus({ preventScroll: true });
      });
    });

    close.addEventListener('click', closeGallery);
    previous?.addEventListener('click', () => display(activeIndex - 1));
    next?.addEventListener('click', () => display(activeIndex + 1));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeGallery();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) closeGallery();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        display(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
    picture.addEventListener('error', () => {
      picture.hidden = true;
      if (caption) caption.textContent = 'Không tải được ảnh. Bạn có thể chuyển sang ảnh tiếp theo hoặc đóng cửa sổ này.';
    });
  }

  function initialize() {
    initializeNavigation();


    initializeGallery();

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, low=0, high=1) => Math.min(high, Math.max(low, value));

function initializeBelt() {
  const belt = document.querySelector('.belt');
  const track = belt.querySelector('.belt-track');
  const originals = [...track.querySelectorAll('.belt-card')];
  const count = originals.length;
  // Three linear copies provide an off-screen buffer at both ends.
  // No visible card is ever moved across the belt to wrap around.
  const cards = [];
  for (let copy = 0; copy < 3; copy++) {
    originals.forEach((original, index) => {
      const card = copy === 0 ? original : original.cloneNode(true);
      if (copy) track.append(card);
      card.dataset.beltItem = String(index);
      card.dataset.beltCopy = String(copy);
      card.querySelector('img').draggable = false;
      cards.push(card);
    });
  }
  let position = count + 2, drag = 0, startX = null, dragged = false;
  let visible = false, moving = false, settleTimer, autoplayTimer;
  belt.tabIndex = 0;
  function render(animate = true) {
    const phone = window.innerWidth < 768;
    const step = phone ? 230 : 300;
    cards.forEach((card, index) => {
      const offset = index - position + drag / step;
      const distance = Math.abs(offset);
      const scale = 1.15 - Math.min(distance, 3) * .15;
      card.style.transition = animate && !reducedMotion.matches ? '' : 'none';
      card.style.transform = `translate3d(${offset * step}px,${distance * 17}px,${-distance * 30}px) rotateY(${clamp(-offset * 24, -42, 42)}deg) scale(${scale})`;
      const w = phone ? 220 : 280, h = phone ? 355 : 455;
      card.style.clipPath = `path('M0 14 Q${w/2} -14 ${w} 14 L${w} ${h-14} Q${w/2} ${h+14} 0 ${h-14} Z')`;
      card.style.zIndex = String(20 - Math.round(distance * 4));
      card.style.opacity = distance > 3.5 ? '0' : '1';
      card.setAttribute('aria-hidden', String(distance > 3.5));
      card.tabIndex = distance <= 1.1 ? 0 : -1;
    });
  }
  function normalize() {
    const next = count + ((position - count) % count + count) % count;
    if (next !== position) {
      position = next;
      render(false);
      // Commit the visually identical copy before transitions resume.
      track.getBoundingClientRect();
    }
    moving = false;
  }
  function settle() {
    clearTimeout(settleTimer);
    if (reducedMotion.matches) {normalize(); return;}
    settleTimer = setTimeout(normalize, 820);
  }
  function advance(step) {
    if (moving) return;
    moving = true; position += step; drag = 0; render(); settle();
  }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    if (!visible || document.hidden || reducedMotion.matches) return;
    autoplayTimer = setInterval(() => {
      if (startX === null) advance(1);
    }, 4000);
  }
  document.querySelectorAll('[data-belt]').forEach(button => button.addEventListener('click', () => {advance(Number(button.dataset.belt));restartAutoplay();}));
  belt.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1);restartAutoplay();
    }
  });
  belt.addEventListener('pointerdown', event => {
    if (moving) return;
    startX = event.clientX; dragged = false;clearInterval(autoplayTimer);
  });
  belt.addEventListener('pointermove', event => {
    if (startX === null) return;
    drag = event.clientX - startX;
    if (Math.abs(drag) > 8) {
      dragged = true; belt.classList.add('is-dragging');
      if (!belt.hasPointerCapture(event.pointerId)) belt.setPointerCapture(event.pointerId);
      render(false);
    }
  });
  function endDrag() {
    if (startX === null) return;
    const step = window.innerWidth < 768 ? 230 : 300;
    if (dragged) position -= Math.round(drag / step);
    startX = null; drag = 0; belt.classList.remove('is-dragging');
    if (dragged) {moving = true; render(); settle();}
    restartAutoplay();
  }
  belt.addEventListener('pointerup', endDrag);
  belt.addEventListener('pointercancel', endDrag);
  belt.addEventListener('click', event => { if (dragged) {event.preventDefault(); dragged = false;} }, true);
  belt.addEventListener('dragstart', event => event.preventDefault());
  new IntersectionObserver(entries => {
    const next=entries[0].isIntersecting;
    if(next!==visible){visible=next;restartAutoplay();}
  }, {threshold: .2}).observe(belt);
  document.addEventListener('visibilitychange',restartAutoplay);
  reducedMotion.addEventListener('change',restartAutoplay);
  window.addEventListener('resize', () => render(false));
  render(false);
}

function initializeScrollLayers() {
  const origin=document.querySelector('.travel-origin');
  const target=document.querySelector('.photo-target');
  const paragraphs=[...document.querySelectorAll('.scroll-intro')].map(paragraph=>{
    const words=paragraph.textContent.trim().split(/\s+/).map(text=>{
      const word=document.createElement('span');
      word.className='intro-word';word.textContent=text;
      return word;
    });
    paragraph.replaceChildren(...words.flatMap((word,i)=>i?[document.createTextNode(' '),word]:[word]));
    paragraph.classList.add('is-scroll-reveal');
    return {paragraph,words};
  });
  const traveler=document.createElement('div');
  traveler.className='photo-traveler';
  traveler.setAttribute('aria-hidden','true');
  const originImage=origin.querySelector('img').cloneNode();
  const targetImage=target.querySelector('img').cloneNode();
  originImage.alt=targetImage.alt='';
  originImage.loading=targetImage.loading='eager';
  traveler.append(originImage,targetImage);
  document.body.append(traveler);
  let pending=false;
  const docTop = element => element.getBoundingClientRect().top + window.scrollY;
  function update() {
    pending=false;
    const y=window.scrollY, vw=window.innerWidth;
    paragraphs.forEach(({paragraph,words})=>{
      const rect=paragraph.getBoundingClientRect();
      const progress=reducedMotion.matches?1:clamp((window.innerHeight*.85-rect.top)/(rect.height+window.innerHeight*.12));
      words.forEach((word,i)=>word.style.opacity=String(.18+.82*clamp(progress*words.length-i)));
    });
    if(!reducedMotion.matches) {
      if(vw>=768){
      const from=origin.getBoundingClientRect(),to=target.getBoundingClientRect();
      const headerHeight=document.querySelector('.site-header').offsetHeight;
      const progress=clamp(y/Math.max(1,docTop(target)-headerHeight-32));
      const moving=progress>0&&progress<1;
      origin.style.opacity=moving?'0':'1';
      target.style.opacity=progress<1?'0':'1';
      traveler.hidden=!moving;
      if(moving){
        const mix=(a,b)=>a+(b-a)*progress;
        traveler.style.width=`${mix(from.width,to.width)}px`;
        traveler.style.height=`${mix(from.height,to.height)}px`;
        traveler.style.transform=`translate3d(${mix(from.left,to.left)}px,${mix(from.top,to.top)}px,0) rotate(${-5*(1-progress)}deg)`;
        targetImage.style.opacity=String(clamp((progress-.25)/.5));
      }
      }else{traveler.hidden=true;origin.style.opacity='1';target.style.opacity='1';}
    } else {traveler.hidden=true;origin.style.opacity='1';target.style.opacity='1';}
  }
  function requestUpdate(){if(!pending){pending=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate);reducedMotion.addEventListener('change',requestUpdate);
  update();
}

  function initializeMasonry() {
    const grid = document.getElementById('christmas-gallery');
    if (!grid) return;
    grid.classList.add('is-masonry');
    function layout() {
      const style = getComputedStyle(grid);
      const row = parseFloat(style.gridAutoRows);
      const gap = parseFloat(style.rowGap);
      grid.querySelectorAll('.gallery-item').forEach(item => {
        if (item.hidden) return;
        const img = item.querySelector('img');
        const height = item.getBoundingClientRect().width * Number(img.getAttribute('height')) / Number(img.getAttribute('width'));
        item.style.gridRowEnd = `span ${Math.ceil((height + gap) / (row + gap))}`;
      });
    }
    let previousWidth = -1;
    new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      if (width !== previousWidth) { previousWidth = width; layout(); }
    }).observe(grid);
    grid.addEventListener('gallery:layout', layout);
    layout();
  }


const eventStart=new Date('2026-12-19T18:00:00+07:00').getTime();
function updateCountdown(){const remaining=Math.max(0,eventStart-Date.now()),s=Math.floor(remaining/1000),p={days:Math.floor(s/86400),hours:Math.floor(s/3600)%24,minutes:Math.floor(s/60)%60,seconds:s%60};for(const [part,value]of Object.entries(p))document.getElementById(`count-${part}`).textContent=String(value).padStart(2,'0');document.getElementById('hero-countdown').textContent=`${p.days} ngày ${String(p.hours).padStart(2,'0')} giờ ${String(p.minutes).padStart(2,'0')} phút`;if(!remaining)document.getElementById('countdown-status').textContent='Đã đến ngày biểu diễn. Xem lịch và thông tin suất diễn trên OrcheStars.';}
initializeBelt();initializeScrollLayers();initializeMasonry();updateCountdown();setInterval(updateCountdown,1000);
