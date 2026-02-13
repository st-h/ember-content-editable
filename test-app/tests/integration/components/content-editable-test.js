import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  fillIn,
  triggerEvent,
  triggerKeyEvent,
  focus,
  blur,
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function getPlaceholderContent(element) {
  let placeholderContent = window.getComputedStyle(element, '::before').content;
  if (placeholderContent == 'none') {
    return '';
  }
  return placeholderContent.replace(/"/g, ''); // presence of quotes varies in phantomjs vs chrome
}

//Make mock event
const pasteEvent = document.createEvent('CustomEvent');
pasteEvent.initCustomEvent('paste', true, true, null);
pasteEvent.clipboardData = {
  getData() {
    return 'Pasted text';
  },
};
pasteEvent.preventDefault = function () {
  //do nothing
};

module('Integration | Component | content editable', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test('it renders', async function (assert) {
    await render(hbs`<ContentEditable @value="hello editable"/>`);

    assert.dom('.ember-content-editable').hasText('hello editable');
    assert.dom('.ember-content-editable').exists({ count: 1 });
  });

  test('placeholder renders and stays on focus until the element has content', async function (assert) {
    this.set('value', '');
    await render(
      hbs`<ContentEditable @value={{this.value}} @placeholder="bananas"/>`,
    );

    assert
      .dom('.ember-content-editable')
      .hasAttribute('placeholder', 'bananas');

    const editable = this.element.getElementsByClassName(
      'ember-content-editable',
    )[0];
    assert.strictEqual(
      getPlaceholderContent(editable),
      'bananas',
      'CSS before:content matches placeholder',
    );

    await focus('.ember-content-editable');

    assert
      .dom('.ember-content-editable')
      .hasAttribute('placeholder', 'bananas');
    assert.strictEqual(
      getPlaceholderContent(editable),
      'bananas',
      'CSS before:content matches placeholder',
    );

    // Check placeholder hidden when value is present
    this.set('value', 'zebra');

    assert.strictEqual(
      getPlaceholderContent(editable),
      '',
      'Placeholder not shown when content present',
    );
  });

  test('`clearPlaceholderOnFocus` option removes placeholder on intial focus', async function (assert) {
    this.set('value', '');
    await render(
      hbs`<ContentEditable tabindex="0" @value={{this.value}} @placeholder="bananas" @clearPlaceholderOnFocus={{true}}/>`,
    );

    const editable = this.element.getElementsByClassName(
      'ember-content-editable',
    )[0];

    assert.strictEqual(
      getPlaceholderContent(editable),
      'bananas',
      'CSS before:content matches placeholder',
    );

    await focus(editable);
    assert.strictEqual(
      getPlaceholderContent(editable),
      '',
      'CSS before: placeholder content removed when `clearPlaceholderOnFocus` is used',
    );
  });

  test('onChange is called when input changes', async function (assert) {
    assert.expect(2);
    this.set('value', '');
    this.onChange = (value) => {
      assert.strictEqual(value, 'gif not jif');
    };
    await render(
      hbs`<ContentEditable @value={{this.value}} @onChange={{this.onChange}}/>`,
    );

    assert.strictEqual(this.value, '', 'Initial value is correct');

    await fillIn('.ember-content-editable', 'gif not jif');
  });

  test('input updated when value changes', async function (assert) {
    this.set('value', '');
    await render(
      hbs`<ContentEditable @value={{this.value}} @placeholder="bananas"/>`,
    );

    assert.dom('.ember-content-editable').hasText('');

    this.set('value', 'cheese');

    assert.dom('.ember-content-editable').hasText('cheese');
  });

  test('basic key events triggered', async function (assert) {
    assert.expect(1);
    this.set('onKey', function () {
      assert.ok(true, 'onKey triggered');
    });

    await render(hbs`
        <ContentEditable @value="test" @placeholder="bananas" @onKey={{this.onKey}}/>
    `);

    await triggerEvent('.ember-content-editable', 'keydown');
    await triggerEvent('.ember-content-editable', 'keypress');
    await triggerEvent('.ember-content-editable', 'keyup');
  });

  test('specific key events triggered', async function (assert) {
    assert.expect(2);
    this.set('onEscape', function () {
      assert.ok(true, 'escape-press triggered');
    });
    this.set('onEnter', function () {
      assert.ok(true, 'enter triggered');
    });

    await render(hbs`
        <ContentEditable @value="test" @placeholder="bananas" @onEscape={{this.onEscape}} @onEnter={{this.onEnter}} @allowNewlines={{true}}/>
    `);

    await triggerKeyEvent('.ember-content-editable', 'keydown', 27);
    await triggerKeyEvent('.ember-content-editable', 'keydown', 13);
  });

  test('focus events can be replaced by on helper', async function (assert) {
    assert.expect(2);
    this.set('focusOut', function () {
      assert.ok(true, 'focus-out triggered');
    });
    this.set('focusIn', function () {
      assert.ok(true, 'focus-in triggered');
    });

    await render(hbs`
        <ContentEditable @value="test" @placeholder="bananas"
         {{on 'blur' this.focusOut}} {{on 'focus' this.focusIn}}/>
    `);

    await focus('.ember-content-editable');
    await blur('.ember-content-editable');
  });

  test('disabled attribute works', async function (assert) {
    await render(hbs`<ContentEditable @disabled={{true}}/>`);

    assert
      .dom('.ember-content-editable')
      .doesNotHaveAttribute('contenteditable', 'false');
  });

  test('allowNewlines=true works', async function (assert) {
    assert.expect(2);
    this.set('value', '');
    this.set('keyDown', function (event) {
      assert.notOk(event.defaultPrevented);
    });

    await render(
      hbs`<ContentEditable @allowNewlines={{true}} @value={{this.value}} @onKey={{this.keyDown}}/>`,
    );

    triggerKeyEvent('.ember-content-editable', 'keydown', 13); //enter
    triggerKeyEvent('.ember-content-editable', 'keydown', 65); //non-enter
  });

  test('allowNewlines=false works', async function (assert) {
    assert.expect(2);
    this.set('value', '');
    this.set('keyDown', (event) => {
      assert.notOk(event.defaultPrevented);
    });

    await render(
      hbs`<ContentEditable @allowNewlines={{false}} @value={{this.value}} @onKey={{this.keyDown}}/>`,
    );

    triggerKeyEvent('.ember-content-editable', 'keydown', 13); //enter
    triggerKeyEvent('.ember-content-editable', 'keydown', 65); //non-enter

    assert.strictEqual(
      this.value,
      '',
      'value should not be modified by pressing enter when allowNewlines is false',
    );
  });

  test('placeholder reappears when value is cleared', async function (assert) {
    this.set('value', '');
    await render(
      hbs`<ContentEditable @value={{this.value}} @placeholder="bananas"/>`,
    );

    const editable = this.element.getElementsByClassName(
      'ember-content-editable',
    )[0];

    assert.strictEqual(
      getPlaceholderContent(editable),
      'bananas',
      'Placeholder shown initially',
    );

    this.set('value', 'hello');

    assert.strictEqual(
      getPlaceholderContent(editable),
      '',
      'Placeholder hidden when value present',
    );

    this.set('value', '');

    assert.strictEqual(
      getPlaceholderContent(editable),
      'bananas',
      'Placeholder reappears when value cleared',
    );
  });

  test('paste event is triggered', async function (assert) {
    assert.expect(1);
    this.set('value', '');
    this.set('paste', (text) => {
      assert.strictEqual(text, 'Pasted text');
    });

    await render(
      hbs`<ContentEditable @value={{this.value}} @onPaste={{this.paste}}/>`,
    );

    const editable = this.element.getElementsByClassName(
      'ember-content-editable',
    )[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event
  });

  test('exceeding maxlength aborts paste', async function (assert) {
    assert.expect(1);
    this.set('value', '');
    this.set('paste', () => {
      assert.ok(
        false,
        'paste event should not be triggered when maxlength is exceeded',
      );
    });

    await render(
      hbs`<ContentEditable @value={{this.value}} @maxlength={{2}}/>`,
    );

    const editable = this.element.getElementsByClassName(
      'ember-content-editable',
    )[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event

    assert.strictEqual(this.value, '');
  });
});
