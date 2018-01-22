import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { fillContentEditable } from '../helpers/fill-content-editable'
import { visit } from '@ember/test-helpers';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {

    await visit('/');
    await fillContentEditable('#text-input', 'Hi there!');

    assert.dom('#text-output').hasText('Hi there!');
  });
});
