export default class Header {
  /**
   * Creates an instance of Header.
   */
  constructor() {
    this.Menu();
    this.Sticky();
    this.itLink();
    Sidebar();
  }
  closest = (el, selector) => {
    let matchesFn, parent;
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some((fn) => {
      if (typeof document.body[fn] == 'function') {
        matchesFn = fn;
        return true;
      }
      return false;
    })
    while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
        return parent;
      }
      el = parent;
    }
    return null;
  }
  itLink = () => {
    const link = window.location.pathname;
    const hMenu = document.querySelector('.header__nav');
    const elem = hMenu.querySelectorAll('li a');
    const hamburger = document.querySelector('.header__hamburger');
    elem.forEach((el) => {
      const hr = el.getAttribute('href');
      if (hr === link || hr === link.split('#')[0]) {
        el.parentElement.classList.add('active');
      }
      if (link !== '/' && link.includes(hr)) {
        el.parentElement.classList.add('active');
        if (hr === '/') {
          el.parentElement.classList.remove('active');
        }
      }
      el.addEventListener('click', () => {
        if(!el.parentElement.classList.contains('active')){
          if (window.innerWidth < 769) {
            hamburger.classList.remove('active');
            hMenu.classList.remove('active');
            document.body.style.overflow = 'inherit';
          }
        } else{
          el.parentElement.classList.remove('active');
        }
      });
      const reset = () => {
        if(el.parentElement.classList.contains('active')){
          if (window.innerWidth < 769) {
            el.parentElement.classList.remove('active');
          }
        }
      }
      reset();
      window.addEventListener('resize', reset, false);
    });
  }
  Menu = () => {
    let _target = document.getElementById('iconNav');
    let _nav = document.getElementById('navBar');
    let sub = document.querySelectorAll('.evt');
    
    _target.addEventListener('click', () => {
      if (_target.classList.contains('active')) {
        _target.classList.remove('active');
        _nav.classList.remove('active');
        document.body.style.overflow = 'inherit';
      } else {
        _target.classList.add('active');
        _nav.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
    sub.forEach(function(el) {
      el.addEventListener('click', function() {
        let parent = el.parentElement;
        let child = parent.querySelector('.subMenu__lst');
        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          child.style.maxHeight = '';
        } else {
          parent.classList.add('active');
          child.style.maxHeight = child.scrollHeight + "px";
        }
      })
    });
    const reset = () => {
      if (_target.classList.contains('active')){
        if(window.innerWidth > 768){
          _target.classList.remove('active');
          _nav.classList.remove('active');
          document.body.style.overflow = 'inherit';
          sub.forEach(function(el) {
            let parent = el.parentElement;
            el.classList.remove('active');
            parent.classList.remove('active');
            parent.querySelector('.subMenu__lst').removeAttribute('style');
          });
        }
        else {
          _nav.classList.add('active');
          sub.forEach(function(el) {
            let child = el.parentElement.querySelector('.subMenu__lst');
            if (el.classList.contains('active')) {
              child.style.maxHeight = child.scrollHeight + "px";
            }
          })
        }
      }
    }
    reset();
    window.addEventListener('resize', reset, false);
  }
  Sticky = () => {
    let _header = document.getElementById('header');
    let lastScrollTop = 0;
    
    const _forSp = () => {
      _header.removeAttribute('style');
    }
    
    const _forPc = (top,left,direction) => {
      if (top > _header.clientHeight + 20) {
        _header.style.left = -left + "px";
        _header.classList.add('fixed');
        _header.classList.remove('is-large');
      } else{
        if(direction === 'down') {
          _header.classList.remove('fixed');
          _header.classList.remove('is-hide');
          _header.removeAttribute('style');
        }
        if(direction === 'up') {
          if(top <= 0) {
            setTimeout(() => {
              _header.classList.remove('fixed');
            }, 500);
            _header.classList.add('is-hide');
            setTimeout(() => {
              _header.classList.add('is-large');
            }, 500);
            _header.removeAttribute('style');
          }
        }
      }
    }
    
    const _hand = (direction) => {
    let _top = document.documentElement.scrollTop || document.body.scrollTop;
    let _left = document.documentElement.scrollLeft || document.body.scrollLeft;
    
    if (window.innerWidth > 769) {
      _forPc( _top, _left, direction);
      } else {
        _forSp();
      }
    }
    window.addEventListener('scroll', ()=> {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      let direction = 'down'
      if (st > lastScrollTop){
        direction = 'down'
      } else {
        direction = 'up'
      }
      lastScrollTop = st <= 0 ? 0 : st;
      _hand(direction);
    }, false);
    window.addEventListener('resize', _hand('down'), false);
    window.addEventListener('load', _hand('down'), false);
  }
    
}

const Sidebar = () => {
  let sidebar = document.querySelector('.fixed__lst');
  const SidebarFixed = () => {
    let ScrollY = window.pageYOffset;
    let HeightWindow = window.innerHeight;
    let TopFooter = document.getElementById('footer').offsetTop;
    
    let TopScroll = ScrollY + HeightWindow;
    if ( TopScroll >= TopFooter) {
      sidebar.classList.add('out');
    }else{
      sidebar.classList.remove('out');
    }
  }
  window.addEventListener('load', SidebarFixed, false);
  setTimeout(function(){
    window.addEventListener('scroll', SidebarFixed, false);
    window.addEventListener('resize', SidebarFixed, false);
  }, 500);
}