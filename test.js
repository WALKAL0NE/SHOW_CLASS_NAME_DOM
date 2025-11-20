"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classExtractor_1 = require("./src/classExtractor");
const html = `<header class="base-header">
  <a href="/" class="base-header__home">
    <Logo />
  </a>
  <nav class="base-header__nav">
    <a href="/about" class="base-header__nav__item">
      <span>一</span>
    </a>
    <a href="/works" class="base-header__nav__item">
      <span>二</span>
    </a>
    <a href="/discography" class="base-header__nav__item">
      <span>三</span>
    </a>
    <!-- <a href="/contact" class="base-header__nav__item">四</a> -->
  </nav>


  <a href="/contact" class="base-header__contact">
    <span>問</span>
  </a>

  <nav class="base-header__nav base-header__nav--mobile">
    <a href="/about" class="base-header__nav__item">
      <span>一</span>
    </a>
    <a href="/works" class="base-header__nav__item">
      <span>二</span>
    </a>
    <a href="/discography" class="base-header__nav__item">
      <span>三</span>
    </a>
    <!-- <a href="/contact" class="base-header__nav__item">四</a> -->
  </nav>

</header>`;
const extractor = new classExtractor_1.ClassExtractor();
const result = extractor.extractToSass(html);
console.log('=== Result ===');
console.log(result);
console.log('=============');
const expected = `.base-header
\t.base-header__home
\t.base-header__nav
\t\t&--mobile
\t.base-header__nav__item
\t.base-header__contact`;
console.log('\n=== Expected ===');
console.log(expected);
console.log('================');
if (result === expected) {
    console.log('\n✅ TEST PASSED!');
}
else {
    console.log('\n❌ TEST FAILED!');
    console.log('\nDifferences:');
    console.log('Result length:', result.length);
    console.log('Expected length:', expected.length);
}
//# sourceMappingURL=test.js.map