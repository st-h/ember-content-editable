import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['extraClass'],
  attributeBindings: ['contenteditable', 'placeholder'],
  contenteditable: true,

  setup: Ember.on('didInsertElement', function() {
    this.$().html(this.get('value'));
  }),

  stringInterpolator(s) { return s; },

  updateValue: Ember.on('keyUp', function(event) {
    this.set('value', this.stringInterpolator(this.$().text()));
    this.handleKeyUp(event);
  }),

  handleKeyUp(event) {
    this.sendAction('keyUp', this.get('value'), event);

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
