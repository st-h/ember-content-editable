import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';

var application;

module('Acceptance | application', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  fillContentEditable('div.ember-content-editable', 'Hi there!');

  andThen(function() {
    assert.equal(find('input').val(), 'Hi there!', 'content editable html bound to input');
    assert.equal(find('p').text().trim(), 'Hi there!', 'content editable html bound to p');
  });
});
