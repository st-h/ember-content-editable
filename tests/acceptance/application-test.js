import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /', function(assert) {

  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  fillContentEditable('#text-input', 'Hi there!');

  andThen(function() {
    assert.equal(find('#text-output').text(), 'Hi there!', 'content editable text value rendered');
  });
});
