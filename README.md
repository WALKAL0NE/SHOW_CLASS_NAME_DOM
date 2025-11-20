# SASS Class Extractor

HTML/Liquid/AstroファイルからクラスをBEM構造で抽出し、SASS記法に変換するVSCode拡張機能です。

## 機能

- HTML、Liquid、Astroファイルに対応
- BEM記法のクラス名を階層構造として認識
- SASS形式のネスト構造として出力
- ファイル全体または選択範囲から抽出可能
- クリップボードに自動コピー

## 使い方

### 方法1: コマンドパレット

1. `Cmd+Shift+P` (macOS) または `Ctrl+Shift+P` (Windows/Linux)
2. "Extract SASS Class Structure" を選択
3. SASS構造がクリップボードにコピーされます

### 方法2: 右クリックメニュー

1. エディタ上でテキストを選択 (または何も選択せずファイル全体を対象)
2. 右クリック → "Extract SASS Class Structure"
3. SASS構造がクリップボードにコピーされます

### 方法3: キーボードショートカット (オプション)

VSCodeの設定で独自のショートカットを割り当てることができます:

1. `Cmd+K Cmd+S` でキーボードショートカット設定を開く
2. "sass-class-extractor.extractToClipboard" を検索
3. 任意のキーバインドを設定

## 例

### 入力 (HTML)

```html
<header class="base-header">
  <a href="/" class="base-header__logo">Logo</a>
  <nav class="base-header__menu">
    <a href="/" class="base-header__menu__item">Models</a>
  </nav>
  <nav class="base-header__nav">
    <a href="/" class="base-header__nav__item base-header__nav__item--cart">
      <span>Cart</span>
    </a>
    <a href="/" class="base-header__nav__item base-header__nav__item--account">
      <span>Account</span>
    </a>
  </nav>
</header>
```

### 出力 (SASS)

```sass
.base-header
  &__logo
  &__menu
    &__item
  &__nav
    &__item
      &--account
      &--cart
```

## 開発

### ビルド

```bash
bun install
bun run compile
```

### デバッグ

1. VSCodeでこのプロジェクトを開く
2. `F5` を押してデバッグモードで拡張機能を起動
3. 新しいウィンドウが開き、拡張機能がアクティブになります

### パッケージング

```bash
bun add -d @vscode/vsce
bunx vsce package
```

## ライセンス

MIT
# SHOW_CLASS_NAME_DOM
