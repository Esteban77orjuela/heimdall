global.window = global;
global.self = global;
global.navigator = {
  userAgent: 'node.js',
  product: 'ReactNative',
};
global.document = {
  createElement: () => ({}),
  addEventListener: () => {},
  removeEventListener: () => {},
};

global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
