import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['extraClass'],
  attributeBindings: [
    'contenteditable',
    'placeholder',
    'spellcheck',
    'tabindex',
    'readonly',
    'disabled'
  ],
  contenteditable: Ember.computed('editable', 'disabled', function() {
    if (this.get('editable') !== null) {
      if (this.get('editable')) {
        Ember.deprecate("You set editable=true on content-editable, " +
            "but this has been deprecated in favour of disabled=false");
      } else {
        Ember.deprecate("You set editable=false on content-editable, " +
            "but this has been deprecated in favour of disabled=true");
      }
      return this.get('editable');
    } else {
      return !this.get('disabled');
    }
  }),
  editable: null,
  disabled: null,
  spellcheck: null,
  isText: null,
  type: null,
  readonly: null,
  allowNewlines: true,

  inputType: Ember.computed('type', 'isText', function() {
    if (this.get('isText') !== null) {
      if (this.get('isText')) {
        Ember.deprecate("You set isText=true on content-editable, " +
            "but this has been deprecated in favour of type='text'");
        return "text";
      } else {
        Ember.deprecate("You set isText=false on content-editable, " +
            "but this has been deprecated in favour of type='html'");
        return "html";
      }
    } else {
      return this.get('type') || "html";
    }
  }),

  setup: Ember.on('didInsertElement', function() {
    this.setValue();
    Ember.run.once(() => this._processInput());

    this.$().on('paste', (event) => {
      this.handlePaste(event, this);
    });
  }),

  tidy: Ember.on('willDestroyElement', function() {
    this.$().off('paste');
  }),

  _observeValue: true,
  valueChanged: Ember.observer('value', function() {
    if (this.get('_observeValue')) {
      this.setValue();
    }
  }),

  setValue() {
    if (this.element) {
      this.$().text(this.get('value') || '');
    }
  },

  stringInterpolator(s) { return s; },

  _getInputValue() {
    if (this.get('inputType') === "html") {
      // Deocde html entities
      let val = this.$().html();
      val = this.$('<div/>').html(val).text();
      return val;
    } else {
      return this.element.innerText || this.element.textContent;
    }
  },

  _processInput() {
    let val = this._getInputValue();
    val = this.stringInterpolator(val);
    val = this.htmlSafe(val);

    this.set('_observeValue', false);
    this.set('value', val);
    this.set('_observeValue', true);
  },

  htmlSafe(val) {
    if (this.get('inputType') === "html") {
      return Ember.String.htmlSafe(val).toString();
    } else {
      return val;
    }
  },

  isUnderMaxLength(val) {
    return (
        Ember.isEmpty(this.get('maxlength')) ||
        val.length < this.get('maxlength')
    );
  },

  updateValue: Ember.on('keyUp', function(event) {
    this._processInput();
    this.handleKeyUp(event);
  }),

  handleKeyUp(event) {
    if (this.get('readonly')) {
      event.preventDefault();
      return false;
    }

    this.sendAction('key-up', this.get('value'), event);
  },

  /* Events */
  handlePaste(event, _this) {
    let content = event.originalEvent.clipboardData.getData('text');
    const currentVal = _this._getInputValue();

    if (!Ember.isEmpty(_this.get('maxlength'))) {
      event.preventDefault();

      if (window.getSelection().rangeCount > 0) {
        let start = window.getSelection().getRangeAt(0).startOffset;
        let end = window.getSelection().getRangeAt(0).endOffset;

        let freeSpace = _this.get('maxlength') - currentVal.length + (end - start);
        content = content.substring(0, freeSpace);

        let newVal = currentVal.substring(0, start) + content + currentVal.substring(end, _this.get('maxlength'));
        _this.set('value', newVal);

        var range = document.createRange();
        range.setStart(_this.element.childNodes[0], start + content.length);
        var sel = window.getSelection();
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    var value = this.get('value');
    this.set('_observeValue', false);

    if (!this.get('allowNewlines')) {
      value = value.toString().replace(/\n/g, ' ');
    }

    if (this.get('type') === 'number') {
      value = value.toString().replace(/[^0-9]/g, '');
    }

    this.set('value', value);
    this.set('_observeValue', true);
  },

  keyDown(event) {
    if (this.get('readonly')) {
      event.preventDefault();
      return false;
    }

    if (event.keyCode === 27) {
      // Escape
      this.sendAction('escape-press', this, event);
    } else if (event.keyCode === 13) {
      // Enter
      this.sendAction('enter', this, event);
      if (this.get('allowNewlines')) {
        this.sendAction('insert-newline', this, event);
      } else {
        event.preventDefault();
        return false;
      }
    }

    this.sendAction('key-down', this.get('value'), event);
  },

  keyPress(event) {
    if (this.get('readonly')) {
      event.preventDefault();
      return false;
    }

    let val = this._getInputValue();
    if (!this.isUnderMaxLength(val)) {
      // Check if text is selected (typing will replace)
      if (window.getSelection().rangeCount > 0) {
        let start = window.getSelection().getRangeAt(0).startOffset;
        let end = window.getSelection().getRangeAt(0).endOffset;
        if (start === end) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }

    if (this.get('type') === 'number') {
      const key = event.which || event.keyCode;
      if (key < 48 || key >= 58) {
        event.preventDefault();
        return false;
      }
    }

    this.sendAction('key-press', this, event);
  },

  focusIn(event) {
    this.sendAction('focus-in', this, event);
  },

  focusOut(event) {
    this.sendAction('focus-out', this, event);
  },

  mouseEnter(event) {
    this.sendAction('mouse-enter', this, event);
  },

  mouseLeave(event) {
    this.sendAction('mouse-leave', this, event);
  },
});
