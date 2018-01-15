import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  fillContentEditable('#text-input', 'Hi there!');
  fillContentEditable('#number-input', 'a123');

  andThen(function() {
    assert.equal(find('#text-output').text(), 'Hi there!', 'content editable text value rendered');
    assert.equal(find('#number-output').text(), '123!', 'content editable number value rendered');
  });
});
