import { once } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['clearPlaceholderOnFocus:clear-on-focus'],
  attributeBindings: [
    'contenteditable',
    'placeholder',
    'spellcheck',
    'tabindex',
    'readonly',
    'disabled'
  ],

  disabled: false,
  spellcheck: null,
  isText: null,
  type: 'text',
  readonly: null,
  allowNewlines: true,
  autofocus: false,
  clearPlaceholderOnFocus: false,

  didInsertElement() {
    this._super(...arguments)

    // register an observer on mutations of this component's dom
    const observer = new MutationObserver(this.domChanged.bind(this));
    observer.observe(this.element, {attributes: false, childList: true, characterData: true, subtree: true});

    this.updateDom();

    if (this.get('autofocus')) {
      this.element.focus();
    }
    window.addEventListener('paste', this.set('_paste_function', this.pasteHandler.bind(this)), false);
  },

  willDestroyElement: function() {
    window.removeEventListener('paste', this.get('_paste_function'), false);
  },

  domChanged() {
    once('render', ()=> {
      const text = this.element.innerText;
      this.setProperties({
        value: text,
        _internalValue: text
      });
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('contenteditable', !this.get('disabled'));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    // if update has been initiated by a change of the dom (user entered something) we don't do anything because
    // - value has already been updated by domChanged
    // - the rendered text already shows the current value
    if (this.get('value') != this.get('_internalValue')) {
      this.updateDom();
    }
  },

  updateDom() {
    this.element.innerText = this.get('value');
  },

  keyPress(event) {
    if (this.get('maxlength') && this.element.innerText.length >= this.get('maxlength')) {
      event.preventDefault();
      this.sendAction('length-exceeded', this, event);
      return false;
    }
  },

  keyDown(event) {
    if (event.keyCode === 13) {
      if (this.get('allowNewlines')) {
        this.sendAction('insert-newline', this, event);
      } else {
        event.preventDefault();
        return false;
      }
    }
  },

  pasteHandler(event) {
    event.preventDefault();
    // replace any html formatted text with its plain text equivalent
    const text = event.clipboardData.getData("text/plain");
    if (this.get('maxlength') && (text.length + this.element.innerText.length) > this.get('maxlength')) {
      this.sendAction('length-exceeded', this, event);
      return false;
    }
    document.execCommand("insertHTML", false, text);
  }
});
