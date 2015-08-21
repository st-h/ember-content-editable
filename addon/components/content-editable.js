import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['extraClass'],
  attributeBindings: ['contenteditable', 'placeholder', "spellcheck", "tabindex"],
  contenteditable: true,
  editable: Ember.computed.alias('contenteditable'),
  spellcheck: false,
  isText: null,
  type: null,

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
  }),

  _observeValue: true,
  valueChanged: Ember.observer('value', function() {
    if (this.get('_observeValue')) {
      this.setValue();
    }
  }),

  setValue() {
    if (this.element) {
      this.$().html(this.get('value'));
    }
  },

  stringInterpolator(s) { return s; },

  _getInputValue() {
    if (this.get('inputType') === "text") {
      return this.element.innerText || this.element.textContent;
    } else {
      return this.$().html();
    }
  },

  _processInput() {
    this.set('_observeValue', false);

    let val = this._getInputValue();
    val = this.stringInterpolator(val);

    if (this.get('inputType') === "html") {
      val = Ember.String.htmlSafe(val);
    }

    this.set('value', val);
    this.set('_observeValue', true);
  },

  updateValue: Ember.on('keyUp', function(event) {
    this._processInput();
    this.handleKeyUp(event);
  }),

  handleKeyUp(event) {
    this.sendAction('key-up', this.get('value'), event);

    if (event.keyCode === 27) {
      // Escape
      this.sendAction('escape-press', this, event);
    } else if (event.keyCode === 13) {
      // Enter
      this.sendAction('enter', this, event);
      this.sendAction('insert-newline', this, event);
    }
  },

  /* Events */
  keyDown(event) {
    this.sendAction('key-down', this.get('value'), event);
  },

  keyPress(event) {
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
