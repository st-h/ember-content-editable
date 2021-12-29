import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | content-editable', function (hooks) {
  setupRenderingTest(hooks);

  test('rendered value updates', async function (assert) {
    this.value = 'first value';
    await render(hbs`<div {{content-editable value=this.value}}></div>`);

    let editable = this.element.querySelector('.ember-content-editable');
    assert.equal(editable.innerText, 'first value');

    this.set('value', 'second value');
    assert.equal(editable.innerText, 'second value');
  });

  test('updating the dom, calls onChange', async function (assert) {
    assert.expect(1);

    this.onChange = (value) => assert.equal(value, 'updated');

    await render(hbs`<div {{content-editable onChange=this.onChange}}></div>`);

    await fillIn('.ember-content-editable', 'updated');
  });
});
