const { convert } = require('html-to-text');
console.log(typeof convert);
try {
  const text = convert('<h1>Test</h1>');
  console.log("Success:", text);
} catch (err) {
  console.log("Error:", err.message);
}
