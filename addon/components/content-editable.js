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

  updateValue: Ember.on('keyUp', function() {
    this.set('value', this.stringInterpolator(this.$().text()));
  })
});
