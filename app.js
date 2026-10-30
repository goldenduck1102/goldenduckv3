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
      picture.alt = item.dataset.galleryAlt || 'Khoảnh khắc cùng Orchestars';
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
  const cards = [...belt.querySelectorAll('.belt-card')];
  let active = 2, drag = 0, startX = null, dragged = false, visible = false, paused = false;
  belt.tabIndex = 0;
  cards.forEach(card => card.querySelector('img').draggable = false);
  function render() {
    const step = window.innerWidth < 768 ? 230 : 300;
    cards.forEach((card, i) => {
      let offset = ((i - active + cards.length * 1.5) % cards.length) - cards.length / 2;
      offset += drag / step;
      const distance = Math.abs(offset);
      const scale = 1.15 - Math.min(distance, 3) * .15;
      const rotate = clamp(-offset * 24, -42, 42);
      card.style.transform = `translate3d(${offset * step}px,${distance * 17}px,${-distance * 30}px) rotateY(${rotate}deg) scale(${scale})`;
      const w=window.innerWidth<768?220:280,h=window.innerWidth<768?355:455;
      card.style.clipPath=`path('M0 14 Q${w/2} -14 ${w} 14 L${w} ${h-14} Q${w/2} ${h+14} 0 ${h-14} Z')`;
      card.style.zIndex = String(20 - Math.round(distance * 4));
      card.style.opacity = distance > 3.2 ? '0' : '1';
      card.tabIndex = distance <= 1.1 ? 0 : -1;
    });
  }
  function advance(step) { active = (active + step + cards.length) % cards.length; drag = 0; render(); }
  document.querySelectorAll('[data-belt]').forEach(button => button.addEventListener('click', () => advance(Number(button.dataset.belt))));
  belt.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault();advance(event.key === 'ArrowRight' ? 1 : -1);}
  });
  belt.addEventListener('pointerdown', event => {startX = event.clientX;dragged = false;paused = true;});
  belt.addEventListener('pointermove', event => {
    if (startX === null) return;
    drag = event.clientX - startX;
    if (Math.abs(drag) > 8) {dragged = true;belt.classList.add('is-dragging');if (!belt.hasPointerCapture(event.pointerId)) belt.setPointerCapture(event.pointerId);render();}
  });
  function endDrag() {
    if (startX === null) return;
    const step = window.innerWidth < 768 ? 230 : 300;
    if (dragged) active = (active - Math.round(drag / step) + cards.length * 100) % cards.length;
    startX = null;drag=0;belt.classList.remove('is-dragging');render();paused=false;
  }
  belt.addEventListener('pointerup', endDrag);belt.addEventListener('pointercancel', endDrag);
  belt.addEventListener('click', event => {if(dragged){event.preventDefault();dragged=false;}},true);
  belt.addEventListener('dragstart', event => event.preventDefault());
  belt.addEventListener('mouseenter',()=>paused=true);belt.addEventListener('mouseleave',()=>paused=false);
  belt.addEventListener('focusin',()=>paused=true);belt.addEventListener('focusout',()=>paused=false);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.2}).observe(belt);
  setInterval(()=>{if(visible&&!paused&&!document.hidden&&!reducedMotion.matches)advance(1);},4200);
  window.addEventListener('resize',render);render();
}

function initializeScrollLayers() {
  const origin=document.querySelector('.travel-origin');
  const target=document.querySelector('.photo-target');
  const about=document.querySelector('.about');
  const experience=document.querySelector('.experience');
  const cards=[...document.querySelectorAll('.experience-card')];
  const visit=document.querySelector('.visit');
  const panels=[...document.querySelectorAll('.visit-panel')];
  const dots=[...document.querySelectorAll('[data-visit]')];
  const traveler=document.createElement('img');
  traveler.src='/assets/ttc2026-banner.webp';traveler.alt='';traveler.className='photo-traveler';traveler.setAttribute('aria-hidden','true');
  document.body.append(traveler);
  let pending=false;
  const docTop = element => element.getBoundingClientRect().top + window.scrollY;
  function update() {
    pending=false;
    const y=window.scrollY, vh=window.innerHeight, vw=window.innerWidth;
    if(!reducedMotion.matches) {
      if(vw>=768) {
      const a=origin.getBoundingClientRect(), b=target.getBoundingClientRect();
      const end=docTop(about), progress=clamp(y/end);
      const eased=progress*progress*(3-2*progress);
      const interpolate=(first,last)=>first+(last-first)*eased;
      if(progress>0.01 && progress<1) {
        traveler.style.display='block';
        traveler.style.width=`${interpolate(a.width,b.width)}px`;
        traveler.style.height=`${interpolate(a.height,b.height)}px`;
        traveler.style.transform=`translate3d(${interpolate(a.left,b.left)}px,${interpolate(a.top,b.top)}px,0)`;
        origin.style.opacity='0';target.style.opacity='0';
      } else {traveler.style.display='none';target.style.opacity=progress>=1?'1':'0';origin.style.opacity='1';}
      } else {traveler.style.display='none';target.style.opacity='1';origin.style.opacity='1';}
      const ep=clamp((y-docTop(experience))/(experience.offsetHeight-vh));
      cards.forEach((card,i)=>{
        if(vw<768){const offset=i-ep*2;card.style.transform=`translate3d(${offset*vw*.82}px,${Math.abs(offset)*18}px,0) rotate(${offset*7}deg)`;card.style.zIndex=String(10-Math.round(Math.abs(offset)*3));}
        else {const spread=clamp(ep*1.5);const x=(i-1)*(80+(vw/3-80)*spread);const angle=(i-1)*(-12)*(1-spread);card.style.transform=`translate3d(${x}px,${(1-spread)*Math.abs(i-1)*20}px,0) rotate(${angle}deg)`;card.style.zIndex=String(5+i);}
      });
      const vp=clamp((y-docTop(visit))/(visit.offsetHeight-vh))*3;
      panels.forEach((panel,i)=>{const weight=clamp(1-Math.abs(vp-i));panel.style.opacity=String(weight);panel.style.transform=`translateY(${(i-vp)*24}px)`;panel.style.pointerEvents=weight>.5?'auto':'none';panel.querySelector('img').style.transform=`scale(${1.08-weight*.03})`;panel.setAttribute('aria-hidden',weight>.5?'false':'true');});
      dots.forEach((dot,i)=>{dot.classList.toggle('active',Math.round(vp)===i);dot.setAttribute('aria-pressed',String(Math.round(vp)===i));});
    } else {traveler.style.display='none';target.style.opacity='1';origin.style.opacity='1';panels.forEach(panel=>panel.removeAttribute('aria-hidden'));}
  }
  function requestUpdate(){if(!pending){pending=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate);reducedMotion.addEventListener('change',requestUpdate);
  dots.forEach(dot=>dot.addEventListener('click',()=>{const index=Number(dot.dataset.visit);window.scrollTo({top:docTop(visit)+(visit.offsetHeight-innerHeight)*index/3,behavior:reducedMotion.matches?'instant':'smooth'});}));
  update();
}

function initializeMoreGallery() {
 const button=document.getElementById('gallery-toggle'), gallery=document.getElementById('christmas-gallery');
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));gallery.hidden=!open;button.textContent=open?'Thu gọn khoảnh khắc ↑':'Xem đủ 17 khoảnh khắc ↗';});
}
const eventStart=new Date('2026-12-19T18:00:00+07:00').getTime();
function updateCountdown(){const remaining=Math.max(0,eventStart-Date.now()),s=Math.floor(remaining/1000),p={days:Math.floor(s/86400),hours:Math.floor(s/3600)%24,minutes:Math.floor(s/60)%60,seconds:s%60};for(const [part,value]of Object.entries(p))document.getElementById(`count-${part}`).textContent=String(value).padStart(2,'0');document.getElementById('hero-countdown').textContent=`${p.days}d ${String(p.hours).padStart(2,'0')}h ${String(p.minutes).padStart(2,'0')}m`;if(!remaining)document.getElementById('countdown-status').textContent='Đã đến ngày hẹn Giáng Sinh. Xem lịch diễn trên OrcheStars.';}
initializeBelt();initializeScrollLayers();initializeMoreGallery();updateCountdown();setInterval(updateCountdown,1000);
