gsap.registerPlugin(ScrollTrigger);

// if ('scrollRestoration' in window.history) {
//   window.history.scrollRestoration = 'manual';
// }
// window.addEventListener('load', function () {
//   window.scrollTo(0, 0);
// });

/****************************************************************************
Match Height JS
****************************************************************************/

function matchHeights(selector) {
  const elements = document.querySelectorAll(selector);
  let maxHeight = 0;

  // Reset heights first
  elements.forEach(el => {
    el.style.height = 'auto';
  });

  // Get the max height
  elements.forEach(el => {
    const height = el.offsetHeight;
    if (height > maxHeight) maxHeight = height;
  });

  // Apply the max height
  elements.forEach(el => {
    el.style.height = maxHeight + 'px';
  });
}

const elementSelectors = [
  '.overview-blocks .block-description',
  '.overview-blocks .block-card-point',
  '.overview-blocks .block-heading',
  '.overview-blocks .block-subheading',
  '.image-card-carousel .card-slide'
];

function applyHeightMatching() {
  elementSelectors.forEach(selector => matchHeights(selector));
}

document.addEventListener("DOMContentLoaded", applyHeightMatching);
window.addEventListener("resize", applyHeightMatching);

window.addEventListener("resize", () => {
  setTimeout(() => applyHeightMatching(), 100);
});

// Cart checkout button disable

document.addEventListener("DOMContentLoaded", function() {
  // Select all agreement checkboxes and all checkout buttons
  const agreementCheckboxes = document.querySelectorAll(".cart__agreement .cart__agreement-checkbox");
  const checkoutButtons = document.querySelectorAll(".cart__checkout-button");
  const agreementFields = document.querySelectorAll(".cart__agreement-value");

  // Disable all checkout buttons by default
  checkoutButtons.forEach(button => button.disabled = true);

  function updateAllCheckboxes(isChecked) {
    // Update all checkboxes
    agreementCheckboxes.forEach(checkbox => checkbox.checked = isChecked);

    // Enable/disable all checkout buttons
    if(window.eligibleStates) {
      if(isChecked && window.checkZipCode) {
      checkoutButtons.forEach(button => button.disabled = false);
      } else {
        checkoutButtons.forEach(button => button.disabled = true);
      }
    } else {
      if(isChecked){
        checkoutButtons.forEach(button => button.disabled = false);
      } else {
        checkoutButtons.forEach(button => button.disabled = true);
      }
    }

    // Update value of all agreement fields
    agreementFields.forEach(field => field.value = isChecked ? "true" : "");
  }

  agreementCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
      updateAllCheckboxes(this.checked);
    });
  });

  // --- BIRTH DATE LOGIC ---

  const birthDateInputs = document.querySelectorAll(".cart__birthdate");
  const birthDateFields = document.querySelectorAll(".cart__birthdate-value");

  function updateAllBirthdates(value) {
    birthDateInputs.forEach(input => input.value = value);
    birthDateFields.forEach(field => field.value = value);
  }

  birthDateInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      updateAllBirthdates(this.value);
    });
  });
});

jQuery(function ($) {
  const debounce = (func, wait) => {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
  };
  const createFocusTrap = (focusableElements, onEscapePress) => {
    const firstFocusable = focusableElements.first();
    const lastFocusable = focusableElements.last();
    if (!firstFocusable.length || !lastFocusable.length) return () => {};

    firstFocusable.focus();

    return (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable[0]) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable[0]) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      } else if (e.key === 'Escape') {
        onEscapePress();
      }
    }
  }
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const caret = '<svg class="icon icon-caret" viewBox="0 0 10 6" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" clip-rule="evenodd"/></svg>';
  const prevArrow = `<button type="button" class="slick-prev slick-arrow" aria-label="Previous slide">${caret}</button>`;
  const nextArrow = `<button type="button" class="slick-next slick-arrow" aria-label="Next slide">${caret}</button>`;

  /*
  *  GLightbox initialization
  */

  const lightbox = GLightbox({
    touchNavigation: true,
    closeOnEsc: true,
    autoplayVideos: true
  });

  /*
  *  Footer slider
  */

  $('.footer__testimonials').slick({
    slidesToShow: 4,
    infinite: false,
    focusOnChange: true,
    variableWidth: true,
    swipeToSlide: true,
    edgeFriction: 0.15,
    prevArrow,
    nextArrow,
    responsive: [
      {
        breakpoint: 749,
        settings: {
          slidesToShow: 1,
          swipeToSlide: false,
          focusOnChange: false,
          arrows: false
        }
      }
    ]
  });
  const matchFooterHeights = () => matchHeights('.footer__testimonials .slick-slide');
  setTimeout(matchFooterHeights, 100);

  let footerTimer;
  window.addEventListener('resize', () => {
    clearTimeout(footerTimer);
    footerTimer = setTimeout(matchFooterHeights, 100);
  });

  /*
  *  Footer disclosure accordion & list reveal blocks
  */

  $('button.footer__disclosure-header, button.block-list-reveal__button').on('click', function () {
    const content = $(this).next('.footer__disclosure-content, .block-list-reveal__reveal-content');
    const caret = $(this).find('.icon-caret');
    const isOpen = content.hasClass('is-open');

    if (isOpen) {
      content.slideUp(150).removeClass('is-open').attr('aria-hidden', 'true');
      $(this).attr('aria-expanded', 'false');
      caret.css('transform', 'rotate(0deg)');
    } else {
      content.slideDown(150).addClass('is-open').attr('aria-hidden', 'false');
      $(this).attr('aria-expanded', 'true');
      caret.css('transform', 'rotate(180deg)');
    }
  });

  /*
  *  Block list reveal width setting
  */

  const setBlockListWidths = () => {
    $('.block-list').each(function () {
      const list = $(this);
      const contents = list.find('.block-list-reveal__reveal-content');
      const originalDisplays = [];

      if (!contents.length) return;

      contents.each(function (i) {
        const content = $(this);
        originalDisplays[i] = content.css('display');
        if (!content.hasClass('is-open')) {
          content.css('display', 'none');
        }
      });

      const parentWidth = list.parent().outerWidth();
      list.css({ 'width': `${parentWidth}px`, 'max-width': `${parentWidth}px` });

      contents.each(function (i) {
        if (originalDisplays[i] !== 'none') {
          $(this).css('display', originalDisplays[i]);
        }
      });
    });
  };
  setTimeout(setBlockListWidths, 100);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setBlockListWidths, 100);
  });

  /*
  *  Tabs blocks
  */

  $('.block-tabs').each(function () {
    const block = $(this);
    const contents = block.find('.block-tab');
  
    contents.each(function (i) {
      const content = $(this);
      const label = content.data('tab-label') || `Tab ${i + 1}`;
      const navItem = $(`<button class="tab-button" role="tab" aria-selected="false"><span>${label}</span></button>`);

      if (i === 0) {
        navItem.addClass('active').attr({ 'aria-selected': 'true' });
        content.addClass('active').attr('aria-hidden', 'false');
      } else {
        content.attr('aria-hidden', 'true');
      }

      navItem.on('click', function () {
        block.find('.tab-button').removeClass('active').attr({ 'aria-selected': 'false' });
        contents.removeClass('active').attr('aria-hidden', 'true');

        $(this).addClass('active').attr({ 'aria-selected': 'true' });
        content.addClass('active').attr('aria-hidden', 'false');
  
        content.find('.slick-initialized').each(function () {
          const slider = $(this);
          const options = slider.slick('getSlick').options;

          slider.slick('unslick');
          slider.slick(options);
        });

        setTimeout(setBlockListWidths, 50);
      });
  
      block.find('.tabs-navigation').append(navItem);
    });
  });

  /*
  *  Slider blocks
  */

  // remove scroll animation classes from slide children
  $('.block-slider .scroll-trigger.animate--slide-in').removeClass('scroll-trigger animate--slide-in');

  $('.block-slider').each(function () {
    const slider = $(this);
    const autoplay = !prefersReducedMotion() && slider.data('auto-rotate');
    const autoplaySpeed = (slider.data('auto-rotate-speed') || 4) * 1000;

    slider.slick({
      autoplay,
      autoplaySpeed,
      speed: 1000,
      slidesToShow: 1,
      arrows: true,
      accessibility: true,
      focusOnSelect: true,
      prevArrow,
      nextArrow,
      pauseOnFocus: true,
      pauseOnHover: true,
      onAfterChange: function (slick, currentSlide) {
        const statusRegion = $(slick.$slider).next('.slider-sr-status');
        if (statusRegion.length) {
          statusRegion.text(`Slide ${currentSlide + 1} of ${slick.slideCount}`);
        }
      }
    });
  });

  $(window).on('resize', debounce(function () {
    $('.slick-initialized').slick('setPosition');
  }, 250));

  /*
  *  Gallery blocks
  */

  $('[data-gallery-view]').each(function () {
    const gallery = $(this);
    const container = gallery.closest('.block-gallery-container');
    const images = container.find('.block-gallery-image');

    // data-auto-rotate and data-auto-rotate-speed 
    if (!images.length) return;

    const src = images[0].getAttribute('src');
    const alt = images[0].getAttribute('alt') ?? '';
    const width = images[0].getAttribute('width') ?? 'auto';
    const height = images[0].getAttribute('height') ?? 'auto';
    const image = $(`<img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy"/>`);

    const setImage = function (image) {
      const src = image?.getAttribute('src');
      const alt = image?.getAttribute('alt') ?? '';
      gallery.find('img').attr({ src, alt });
    };

    gallery.append(image);

    let rotateTimer;

    if (container.data('auto-rotate') && !prefersReducedMotion()) {
      let imageIndex = 1;
      const images = container.find('.block-gallery-image');

      const rotateImages = () => {
        rotateTimer = setTimeout(() => {
          setImage(images[imageIndex]);
          imageIndex = (imageIndex + 1) % images.length;
          rotateImages();
        }, container.data('auto-rotate-speed') ?? 4000);
      }

      rotateImages();
    }

    images.closest('.block-gallery-image-wrapper').on('click', function () {
      clearTimeout(rotateTimer); // stop auto-rotation
      setImage($(this).find('.block-gallery-image')[0]);
    });
  });

  /*
  *  FAQ model
  */

  $('[data-faq-modal]').on('click', function (e) {
    e.preventDefault();
    $('body').addClass('no-scroll');

    const modal = $('#faq-modal');
    const closeModal = () => {
      modal.closest('#faq-modal-container').removeClass('is-open').attr('aria-hidden', 'true');
      $(document).off('keydown', trapFocus);
      $('body').removeClass('no-scroll');
    }

    modal.closest('#faq-modal-container').addClass('is-open').attr('aria-hidden', 'false');

    const focusableElements = modal.find('a, button, .faq-modal__close, .faq-item__question')
    const trapFocus = createFocusTrap(focusableElements, closeModal);

    modal.on('click', function (e) {
      e.stopPropagation();
    });

    modal.find('.faq-modal__close').on('click', closeModal);

    $(document).on('keydown', trapFocus);
    modal.closest('#faq-modal-container').on('click', closeModal);
  });

  $('.faq-item__question').on('click', function () {
    const caret = $(this).find('.icon-caret');
    caret.toggleClass('is-open');
    $(this).attr('aria-expanded', caret.hasClass('is-open') ? 'true' : 'false');
  });

  /*
  *  Rotating Text Effect
  */
  
  $('[data-rotate-text]').each(function() {
    const element = $(this);
    const rotateText = element.data('rotate-text');
    
    if (!rotateText || prefersReducedMotion()) return;
    
    const words = rotateText.split(',').map(word => word.trim()).filter(word => word);
    if (words.length === 0) return;

    const emElement = element.find('em');
    if (!emElement.length) return;
    
    let currentIndex = 0;
    let isAnimating = false;

    emElement.text(words[currentIndex]);
    emElement.addClass('rotating-text').attr('aria-hidden', 'true');

    const rotateToNext = () => {
      if (isAnimating) return;
      isAnimating = true;

      emElement.addClass('rotating-text--exit');
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;

        emElement.text(words[currentIndex]);
        emElement.css('transition', 'none');
        emElement.removeClass('rotating-text--exit').addClass('rotating-text--enter');
        emElement[0].offsetHeight;

        emElement.css('transition', '');

        setTimeout(() => {
          emElement.removeClass('rotating-text--enter');
          
          setTimeout(() => {
            isAnimating = false;
          }, 400); // CSS transition duration
          
        }, 10);
        
      }, 200); // CSS transition duration / 2 for exit animation
    };

    setInterval(rotateToNext, 3200);
  });

  /*
  *  Scroll-triggered animations
  */

  const SCROLL_ANIMATION_TRIGGER_CLASSNAME = 'scroll-trigger';
  const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = 'scroll-trigger--offscreen';

  const initializeScrollAnimationTrigger = (rootEl = document, isDesignModeEvent = false) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animationTriggerElements = Array.from(rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME));
    if (animationTriggerElements.length === 0) return;

    if (isDesignModeEvent) {
      animationTriggerElements.forEach((element) => {
        element.classList.add('scroll-trigger--design-mode');
      });
      return;
    }

    animationTriggerElements.forEach((element, index) => {
      element.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);

      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom+=75px',
        once: true,
        onEnter() {
          element.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
          if (element.hasAttribute('data-cascade')) {
            element.setAttribute('style', `--animation-order: ${index};`);
          }
          setBlockListWidths();
        },
      });
    });
  }


  if (window.ANIMATIONS_REVEAL_ON_SCROLL && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initializeScrollAnimationTrigger();

    const blocker = document.getElementById('animation-blocker');
    if (blocker) blocker.remove();

    if (Shopify.designMode) {
      document.addEventListener('shopify:section:load', (event) => initializeScrollAnimationTrigger(event.target, true));
      document.addEventListener('shopify:section:reorder', () => initializeScrollAnimationTrigger(document, true));
    }
  }

  /*
  *  Reduced motion
  */

  const handleReduceMotionCheck = () => {
    if (prefersReducedMotion()) {
      $('.scroll-trigger.animate--slide-in').removeClass('scroll-trigger animate--slide-in');
      setTimeout(setBlockListWidths, 50);
    }
  }
  handleReduceMotionCheck()
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReduceMotionCheck);
});
