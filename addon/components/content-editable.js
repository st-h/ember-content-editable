import Component from '@ember/component';
import { run } from "@ember/runloop";

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
    const observer = this.set('_mutationObserver', new MutationObserver(this.domChanged.bind(this)));
    observer.observe(this.element, {attributes: false, childList: true, characterData: true, subtree: true});

    this.updateDom();

    if (this.get('autofocus')) {
      this.element.focus();
    }
    window.addEventListener('paste', this.set('_paste_function', this.pasteHandler.bind(this)), false);
  },

  willDestroyElement: function() {
    window.removeEventListener('paste', this.get('_paste_function'), false);
    this.get('_mutationObserver').disconnect();
  },

  domChanged() {
    run(()=> {
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
    const value = this.get('value');
    if (value === undefined) {
      this.element.innerText = '';
    } else {
      this.element.innerText = value;
    }
  },

  keyUp(event) {
    this.sendAction('key-up', event);
  },

  keyPress(event) {
    const newLength = this.element.innerText.length - this.getSelectionLength();
    if (this.get('maxlength') && newLength >= this.get('maxlength')) {
      event.preventDefault();
      this.sendAction('length-exceeded', this.element.innerText.length + 1);
      return false;
    }
    this.sendAction('key-press', event);
  },

  keyDown(event) {
    if (event.keyCode === 27) {
      this.sendAction('escape-press', event);
    } else if (event.keyCode === 13) {
      this.sendAction('enter', event);
      if (this.get('allowNewlines')) {
        this.sendAction('insert-newline', event);
      } else {
        event.preventDefault();
        return false;
      }
    }
    this.sendAction('key-down', event);
  },

  getSelectionLength() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.endOffset - range.startOffset;
    }
    return 0;
  },

  pasteHandler(event) {
    event.preventDefault();
    // replace any html formatted text with its plain text equivalent
    const text = event.clipboardData.getData("text/plain");
    // check max length
    if (this.get('maxlength')) {
      // a selection will be replaced. substract the length of the selection from the total length
      const selectionLength = this.getSelectionLength();
      const afterPasteLength = text.length + this.element.innerText.length - selectionLength;
      if (afterPasteLength > this.get('maxlength')) {
        this.sendAction('length-exceeded', afterPasteLength);
        return false;
      }
    }
    document.execCommand("insertHTML", false, text);
  }
});
