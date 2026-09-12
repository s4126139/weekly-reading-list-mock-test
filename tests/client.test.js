const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

test('refresh form disables its button and shows the required loading text', () => {
  const listeners = {};
  const windowListeners = {};
  const label = { textContent: 'Refresh' };
  const button = {
    disabled: false,
    attributes: new Map(),
    querySelector() {},
    removeAttribute(name) {
      this.attributes.delete(name);
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  };
  const form = {
    addEventListener(name, listener) {
      listeners[name] = listener;
    },
    querySelector(selector) {
      return selector === '[data-refresh-button]' ? button : label;
    },
  };

  const source = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
  vm.runInNewContext(source, {
    document: { querySelector: () => form },
    window: {
      addEventListener(name, listener) {
        windowListeners[name] = listener;
      },
    },
  });

  listeners.submit();
  assert.equal(button.disabled, true);
  assert.equal(button.attributes.get('aria-busy'), 'true');
  assert.equal(label.textContent, 'Refreshing...');

  windowListeners.pageshow();
  assert.equal(button.disabled, false);
  assert.equal(button.attributes.has('aria-busy'), false);
  assert.equal(label.textContent, 'Refresh');
});
