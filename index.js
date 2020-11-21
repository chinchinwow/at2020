$(".custom-select").each(function() {
  var classes = $(this).attr("class"),
      id      = $(this).attr("id"),
      name    = $(this).attr("name");
  var template =  '<div class="' + classes + '">';
      template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
      template += '<div class="custom-options">';
      $(this).find("option").each(function() {
        template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
      });
  template += '</div></div>';
  
  $(this).wrap('<div class="custom-select-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option:first-of-type").hover(function() {
  $(this).parents(".custom-options").addClass("option-hover");
}, function() {
  $(this).parents(".custom-options").removeClass("option-hover");
});
$(".custom-select-trigger").on("click", function() {
  $('html').one('click',function() {
    $(".custom-select").removeClass("opened");
  });
  $(this).parents(".custom-select").toggleClass("opened");
  event.stopPropagation();
});
$(".custom-option").on("click", function() {
  $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
  $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
  $(this).addClass("selection");
  $(this).parents(".custom-select").removeClass("opened");
  $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
});




class CpAccordionGroup extends HTMLElement {
  static get observedAttributes() {
    return ['cp-heading-level', 'cp-size'];
  }

  constructor() {
    super();
    
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('cpAccordionGroup');
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._accordions = Array.from(this.querySelectorAll('cp-accordion'));
    this._setIndexOfFirstAndLastAccordion();
  }
  
  _setIndexOfFirstAndLastAccordion() {
    this._accordions[0].setAttribute('cp-index', 'first');
    this._accordions[this._accordions.length - 1].setAttribute('cp-index', 'last');
  }
  
  connectedCallback() {}
  
  detachedCallback() {}
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'cp-heading-level': {
        this._accordions.forEach((elm, ind, arr) => {
          elm.setAttribute('cp-heading-level', newValue);
        });
        break;
      }
      case 'cp-size': {
        this._accordions.forEach((elm, ind, arr) => {
          elm.setAttribute('cp-size', newValue);
        });
        break;
      }
    }
  }
}

class CpAccordion extends HTMLElement {
  static get observedAttributes() {
    return [
      'cp-open',
      'cp-disabled',
      'cp-primary-content',
      'cp-secondary-content',
      'cp-index',
      'cp-heading-level',
      'cp-size',
    ];
  }
  
  get open() { return this._group.getAttribute('cp-open'); }
  set open(val) { this.setAttribute('cp-open', val); }

  constructor() {
    super();
    
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('cpAccordion');
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._group = this.shadowRoot.querySelector('[cp-js-group]');
    this._header = this.shadowRoot.querySelector('cp-accordion-header');
    this._body = this.shadowRoot.querySelector('cp-accordion-body');
    
    this._addListeners();
    this._generateIDs();
    
    if (this.open ==='true') {
      this._body.inert = true;
    } else {
      this._body.inert = false;
    }
  }
  
  _addListeners() {
    this._group.addEventListener('click', (e) => {
      if (e.target === this._header) {
        if (this.open === 'true') {
          this.open = 'false';
          this._body.inert = true;
        } else {
          this.open = 'true';
          this._body.inert = false;
        }
      }
    })
  }
  
  _generateIDs() {
    const id = new GUIDService().generate();
    this._header.setAttribute('cp-id', id);
    this._body.setAttribute('cp-id', id);
  }
  
  connectedCallback() {}
  
  detachedCallback() {}
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'cp-open': {
        this._group.setAttribute(name, newValue);
        this._header.setAttribute(name, newValue);
        this._body.setAttribute(name, newValue);
        break;
      }
      case 'cp-primary-content':
      case 'cp-secondary-content': {
        this._header.setAttribute(name, newValue);
        break;
      }
      case 'cp-index': {
        this._group.setAttribute(name, newValue);
        break;
      }
      case 'cp-heading-level': {
        this._header.setAttribute(name, newValue);
        break;
      }
      case 'cp-size': {
        this._header.setAttribute(name, newValue);
        break;
      }
    }
  }
}

class CpAccordionHeader extends HTMLElement {
  static get observedAttributes() {
    return [
      'cp-open',
      'cp-primary-content',
      'cp-secondary-content',
      'cp-heading-level',
      'cp-id',
      'cp-size',
    ];
  }
  
  constructor() {
    super();
    
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('cpAccordionHeader');
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._header = this.shadowRoot.querySelector('[cp-js-header]');
    this._button = this.shadowRoot.querySelector('[cp-js-button]');
    this._textContainer = this.shadowRoot.querySelector('[cp-js-text-container]');
    this._textPrimary = this.shadowRoot.querySelector('[cp-js-primary-text]');
    this._textSecondary = this.shadowRoot.querySelector('[cp-js-secondary-text]');
    this._chevron = this.shadowRoot.querySelector('[cp-js-chevron]');
  }
  
  connectedCallback() {}
  
  detachedCallback() {}
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'cp-primary-content': {
        this._textPrimary.innerText = newValue;
        this._textPrimary.setAttribute('title', newValue);
        break;
      }
      case 'cp-secondary-content': {
        this._textSecondary.innerText = newValue;
        this._textSecondary.setAttribute('title', newValue);
        break;
      }
      case 'cp-open': {
        this._header.setAttribute('cp-open', newValue);
        if (newValue === 'false') {this._button.setAttribute('aria-expanded', !newValue)}
        else {this._button.setAttribute('aria-expanded', newValue)};
        break;
      }
      case 'cp-heading-level': {
        this._header.setAttribute('aria-level', newValue);
        break;
      }
      case 'cp-id': {
        this._button.id = `header${newValue}`;
        this._button.setAttribute('aria-controls', `body${newValue}`);
        break;
      }
      case 'cp-size': {
        this._textContainer.setAttribute(name, newValue);
        break;
      }
    }
  }
}

class CpAccordionBody extends HTMLElement {
  static get observedAttributes() {
    return ['cp-open', 'cp-id'];
  }

  constructor() {
    super();
    
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('cpAccordionBody');
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._body = this.shadowRoot.querySelector('[cp-js-body]');
  }
  
  connectedCallback() {}
  
  detachedCallback() {}
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'cp-open': {
        this._body.setAttribute('cp-open', newValue);
        if (newValue === 'true') this._openBody();
        else this._closeBody();
        break;
      }
      case 'cp-id': {
        this._body.id = `body${newValue}`;
        this._body.setAttribute('aria-labelledby', `header${newValue}`);
        break;
      }
    }
  }
  
  _openBody() {
    const maxHeight = this._body.scrollHeight;
    this._body.style.maxHeight = `${maxHeight}px`;
    this._body.style.opacity = '1';
  }
  
  _closeBody() {
    this._body.style.maxHeight = `0px`;
    this._body.style.opacity = '0';
  }
}

class GUIDService {
  constructor() {
    this.allGUIDs = [];
  }
  
  generate() {
    const tempGUID = `${Math.random().toString(36).substr(2, 5)}`;
    
    if (this._checkIfGUIDExists(tempGUID)) {
      this.generate();
    }
    
    this.addGUID(tempGUID);
    
    return tempGUID;
  }
  
  addGUID(guid) {
    if (this._checkIfGUIDExists(guid)) {
      return false;
    }
    
    this.allGUIDs.push(guid);
    return true;
  }
  
  removeGUID(guid) {
    if (this.allGUIDs.includes(guid)) {
      const index = this.allGUIDs.indexOf(guid);
      if (index > -1) {
        this.allGUIDs.splice(index, 1);
        return true;
      } else {
        return false;
      }
    }
  }
  
  _checkIfGUIDExists(guid) {
    if (this.allGUIDs.length) {
      return this.allGUIDs.includes(guid);
    } else {
      return false;
    }
  }
}

defineCustomElement = () => {
  window.customElements.define('cp-accordion-group', CpAccordionGroup);
  window.customElements.define('cp-accordion', CpAccordion);
  window.customElements.define('cp-accordion-header', CpAccordionHeader);
  window.customElements.define('cp-accordion-body', CpAccordionBody);
  
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      const target = entries[0].target;
      if (rect.width <= 504) {
        target.setAttribute('cp-size', 'small')
      } else {
        target.removeAttribute('cp-size');
      }
    });

    ro.observe(document.querySelector('cp-accordion-group'));
  }
}

showNoSupport = () => {
  console.warn('Custom Elements are not supported');
  
  const span = document.createElement('SPAN');
  
  span.innerText = 'Your Browser Does not support ';
  
  const anchor = document.createElement('A');
  
  anchor.href = 'https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements';
  anchor.target = '_blank';
  anchor.innerText = 'Custom Elements';
  
  const main = document.querySelector('main.container');
  const customElement = document.querySelector('cp-accordion-group');
  const header = document.querySelector('h1');
  
  main.removeChild(customElement);
  main.removeChild(header);
  main.appendChild(span);
  main.setAttribute('js-no-support', '');
  
  span.appendChild(anchor);
  main.appendChild(span);
}

document.addEventListener('DOMContentLoaded', _ => { 
  console.clear();
  
  const supportsCustomElementsV1 = 'customElements' in window;

  if (supportsCustomElementsV1) defineCustomElement();
  else showNoSupport();
}, false);