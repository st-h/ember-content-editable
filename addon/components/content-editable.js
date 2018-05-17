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
    'disabled'
  ],

  disabled: false,
  spellcheck: null,
  allowNewlines: true,
  autofocus: false,
  clearPlaceholderOnFocus: false,

  init() {
    this._super();
    this.set('keyWhitelist', [
      8,  // backspace
      27, // escape
      37, // left arrow
      38, // up arrow
      39, // right arrow
      40  // down arrow
    ])
    this._pasteHandler = run.bind(this, this.pasteHandler);
  },

  didInsertElement() {
    this._super(...arguments)

    this.updateDom();
    this._mutationObserver = new MutationObserver(run.bind(this, this.domChanged));
    this._mutationObserver.observe(this.element, {attributes: false, childList: true, characterData: true, subtree: true});

    if (this.get('autofocus')) {
      this.element.focus();
    }

    this.element.addEventListener('paste', this._pasteHandler);
  },

  willDestroyElement() {
    this.element.removeEventListener('paste', this._pasteHandler);
    this._mutationObserver.disconnect();
  },

  domChanged() {
    const text = this.element.innerText;
    this.setProperties({
      value: text,
      _internalValue: text
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
    if (value === undefined || value === null) {
      this.element.innerText = '';
    } else {
      this.element.innerText = value;
    }
  },

  keyUp(event) {
    this.get('key-up')(event);
  },

  keyPress(event) {
    // Firefox seems to call this method on backspace and cursor keyboard events, whereas chrome does not.
    // Therefore we keep a whitelist of keyCodes that we allow in case it is necessary.
    const newLength = this.element.innerText.length - this.getSelectionLength();
    if (this.get('maxlength') && newLength >= this.get('maxlength') && !this.get('keyWhitelist').includes(event.keyCode)) {
      event.preventDefault();
      this.get('length-exceeded')(this.element.innerText.length + 1);
      return false;
    }
    this.get('key-press')(event);
  },

  keyDown(event) {
    if (event.keyCode === 27) {
      this.get('escape-press')(event);
    } else if (event.keyCode === 13) {
      this.get('enter')(event);
      if (this.get('allowNewlines')) {
          this.get('insert-newline')(event);
      } else {
        event.preventDefault();
        return false;
      }
    }
    this.get('key-down')(event);
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
    let text = '';
    if (event.clipboardData) {
      text = event.clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('Text');
    }

    // check max length
    if (this.get('maxlength')) {
      // a selection will be replaced. substract the length of the selection from the total length
      const selectionLength = this.getSelectionLength();
      const afterPasteLength = text.length + this.element.innerText.length - selectionLength;
      if (afterPasteLength > this.get('maxlength')) {
        this.get('length-exceeded')(afterPasteLength);
        return false;
      }
    }

    crossSupportInsertText(text);
    this.get('paste')(text);
  },

  enter() { },

  'escape-press'() { },

  'key-up'() { },

  'key-press'() { },

  'key-down'() { },

  'length-exceeded'() { },

  'insert-newline'() { },

  paste() { }

}).reopenClass({
  positionalParams: ['value']
});

function crossSupportInsertText(text) {
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);

    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
