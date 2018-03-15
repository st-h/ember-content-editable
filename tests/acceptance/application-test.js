import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, fillIn } from '@ember/test-helpers';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {

    await visit('/');
    await fillIn('#text-input', 'Hi there!');

    assert.dom('#text-output').hasText('Hi there!');
  });
});
