import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  fillContentEditable('.jsTest-textInput', 'Hi there!');

  andThen(function() {
    assert.equal(find('input').val(), 'Hi there!', 'content editable text bound to input');
    assert.equal(find('.jsTest-textOutput').text().trim(), 'Hi there!', 'content editable html bound to p');
  });

});
