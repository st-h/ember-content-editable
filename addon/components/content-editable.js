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

    if (typeof this.get('value') === 'number') {
      throw new Error("ember-content-editable does not support a Number for parameter 'value', as rendering and " +
        "modifying numbers directly is unreliable. Please provide a String instead.");
    }
    // register an observer on mutations of this component's dom
    const observer = new MutationObserver(this.domChanged.bind(this));
    observer.observe(this.element, {attributes: false, childList: true, characterData: true, subtree: true});

    this.updateDom();

    if (this.get('autofocus')) {
      this.element.focus();
    }
  },

  domChanged() {
    once('render', ()=> {
      const rawText = this.element.innerText;
      // execute user defined stringInterpolator
      const text = this.stringInterpolator(rawText);
      // sanitize the text (e.g. remove everything that is not a number when type is number)
      const sanitizedText = this.sanitizeInput(text);

      if (sanitizedText != rawText) {
        // text has been modified and we need to update the dom
        let selection = window.getSelection();
        let oldRange, start, end, container;
        // capture the old range
        if (selection.rangeCount > 0) {
          oldRange = selection.getRangeAt(0);
          start = oldRange.startOffset;
          end = oldRange.endOffset;
          container = oldRange.startContainer;
        }
        // we need to store the current value that is rendered to the dom, as we need to modify both the internal values
        // as what is rendered to the dom. However, updating the dom will trigger another change, so we catch
        // that when the value from last run is the same as this run and we will do nothing
        if (this.get('_previous') !== this.element.innerText) {
          this.element.innerText = sanitizedText;
        }
        this.set('_previous', this.element.innerText);

        // now that everything is updated we do our best to recreate the previous range so the caret does not jump around
        const range = document.createRange();
        if (oldRange &&
              start > 0 &&
              end > 0 &&
              end < this.element.innerText.length &&
              start < this.element.innerText.length) {
            range.setStart(container, start - 1);
            range.setEnd(container, end - 1);
        } else {
          // just select the whole node and we will collapse to the end later
          range.selectNodeContents(this.element);
        }
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // dom already shows
        this.setProperties({
          value: sanitizedText,
          _internalValue: text
        });
      }
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
    this.element.innerText = this.sanitizeInput(this.get('value'));
  },

  stringInterpolator(s) { return s; },

  sanitizeInput(value) {
    if (value === undefined || value === null) {
      return value;
    }
    if (this.get('type') === 'number') {
       return value.toString().replace(/[^0-9]/g, '');
    } else {
      return value;
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
  }
});
