# SASS Class Extractor

HTML/Liquid/AstroファイルからクラスをBEM構造で抽出し、SASS/SCSSに貼り付けられる形式で出力するVSCode拡張機能です。

## 概要

この拡張機能は、HTMLテンプレート内のクラス名を自動的に抽出し、SASS/SCSS用のクラス構造を生成します。BEM記法に対応しており、HTML上の出現順を保持したまま、階層構造を維持して出力します。

## 主な機能

- ✅ **HTML、Liquid、Astroファイルに対応**
- ✅ **BEM記法の自動認識**（Block__Element--Modifier）
- ✅ **HTMLタグ名の自動付加**（例: `header.base-header`）
- ✅ **HTML出現順の保持**
- ✅ **階層構造の維持**（親子関係を保持）
- ✅ **モディファイアの正しい配置**
- ✅ **タブインデント**（SASSスタイル）
- ✅ **クリップボードに自動コピー**

## 使い方

### 方法1: コマンドパレット

1. `Cmd+Shift+P` (macOS) または `Ctrl+Shift+P` (Windows/Linux)
2. "Extract SASS Class Structure" を入力・選択
3. SASS構造がクリップボードにコピーされます

### 方法2: 右クリックメニュー

1. エディタ上でテキストを選択（または何も選択せずファイル全体を対象）
2. 右クリック → "Extract SASS Class Structure"
3. SASS構造がクリップボードにコピーされます

### 方法3: キーボードショートカット（推奨）

VSCodeの設定で独自のショートカットを割り当てると便利です:

1. `Cmd+K Cmd+S` でキーボードショートカット設定を開く
2. "sass-class-extractor.extractToClipboard" を検索
3. 任意のキーバインドを設定（例: `Cmd+Shift+C`）

## 実例

### 入力 (HTML/Liquid)

```html
<header class="base-header">
  <a href="/" class="base-header__home">
    <Logo />
  </a>
  <nav class="base-header__nav">
    <a href="/about" class="base-header__nav__item">About</a>
    <a href="/works" class="base-header__nav__item">Works</a>
  </nav>
  <a href="/contact" class="base-header__contact">Contact</a>
  <nav class="base-header__nav base-header__nav--mobile">
    <a href="/about" class="base-header__nav__item">About</a>
  </nav>
</header>
```

### 出力 (SASS)

```sass
header.base-header
	.base-header__home
	.base-header__nav
		&--mobile
	.base-header__nav__item
	.base-header__contact
```

### 特徴的な動作

1. **タグ名の付加**: `<header class="base-header">` → `header.base-header`
2. **出現順の保持**: HTML上に出現した順番で出力
3. **階層構造**: `base-header__nav__item` は `base-header__nav` の子要素として配置
4. **モディファイア**: `base-header__nav--mobile` は `base-header__nav` の直下に `&--mobile` として配置
5. **重複の除去**: 同じクラスが複数回出現しても1度だけ出力

## 対応ファイル形式

- HTML (`.html`)
- Liquid (`.liquid`)
- Astro (`.astro`)
- その他のHTMLテンプレート

## 技術仕様

- **インデント**: タブ文字（1タブ = エレメント、2タブ = モディファイア）
- **クラス名抽出**: DOMツリーを走査して出現順を保持
- **BEM解析**: `__`（エレメント）と`--`（モディファイア）を自動認識
- **パーサー**: node-html-parser

## 開発

### 環境構築

```bash
bun install
```

### ビルド

```bash
bun run compile
```

### パッケージング

```bash
bunx vsce package
```

### インストール

1. VSCodeで `Cmd+Shift+P` → "Extensions: Install from VSIX..."
2. 生成された `.vsix` ファイルを選択

## ライセンス

MIT
