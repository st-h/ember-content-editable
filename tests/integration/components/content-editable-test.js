import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('content-editable', 'Integration | Component | content editable', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{content-editable}}`);

  assert.equal(this.$().text(), '');
  assert.equal(this.$('.ember-content-editable').length, 1);


  // Template block usage:
  this.render(hbs`
    {{#content-editable}}
      template block text
    {{/content-editable}}
  `);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'template block text');
  });
});
