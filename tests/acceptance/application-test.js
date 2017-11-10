import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

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
