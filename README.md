# SASS Class Extractor

HTML/Liquid/Astro/PHP/VueファイルからBEM形式のクラスを抽出し、SASS/SCSS形式で出力するVSCode拡張機能です。

## 概要

この拡張機能は、HTMLテンプレート内のクラス名を自動的に抽出し、SASS/SCSS用のクラス構造を生成します。BEM記法に対応しており、HTML上の出現順を保持したまま、フラットな構造で出力します。

## 主な機能

- ✅ **HTML、Liquid、Astro、PHP、Vueファイルに対応**
- ✅ **BEM記法の自動認識**（Block__Element--Modifier）
- ✅ **HTMLタグ名の自動付加**（例: `header.base-header`）
- ✅ **HTML出現順の保持**
- ✅ **フラット構造の出力**（エレメントをネストせず並列配置）
- ✅ **モディファイアの正しい配置**
- ✅ **SASS/SCSS両方の構文に対応**（設定で切り替え可能）
- ✅ **インデント設定**（TAB/スペース、サイズ調整可能）
- ✅ **クリップボードに自動コピー**

## 使い方

### 方法1: コマンドパレット

1. `Cmd+Shift+P` (macOS) または `Ctrl+Shift+P` (Windows/Linux)
2. "Extract SASS Class Structure" を入力・選択
3. SASS/SCSS構造がクリップボードにコピーされます

### 方法2: 右クリックメニュー

1. エディタ上でテキストを選択（または何も選択せずファイル全体を対象）
2. 右クリック → "Extract SASS Class Structure"
3. SASS/SCSS構造がクリップボードにコピーされます

### 方法3: キーボードショートカット（推奨）

VSCodeの設定で独自のショートカットを割り当てると便利です:

1. `Cmd+K Cmd+S` でキーボードショートカット設定を開く
2. "sass-class-extractor.extractToClipboard" を検索
3. 任意のキーバインドを設定（例: `Cmd+Shift+C`）

## 設定

VSCodeの設定画面から以下の項目を設定できます。

### 1. 出力フォーマット (`sassClassExtractor.outputFormat`)

SASS形式とSCSS形式を切り替えます。

**デフォルト**: `sass`

**選択肢**:
- `sass` - SASS構文（インデントのみ、ブレースなし）
- `scss` - SCSS構文（CSS-like、ブレースあり）

**設定方法**:

VSCode設定UI:
1. `Cmd+,` (macOS) / `Ctrl+,` (Windows) で設定を開く
2. "SASS Class Extractor" で検索
3. "Output Format" から選択

または `settings.json`:
```json
{
  "sassClassExtractor.outputFormat": "scss"
}
```

### 2. インデントタイプ (`sassClassExtractor.indentType`)

タブ文字またはスペースでインデントを設定します。

**デフォルト**: `tab`

**選択肢**:
- `tab` - タブ文字を使用
- `space` - スペースを使用

**設定方法**:

```json
{
  "sassClassExtractor.indentType": "space"
}
```

### 3. インデントサイズ (`sassClassExtractor.indentSize`)

スペースインデント時のスペース数を設定します（`indentType` が `space` の場合のみ有効）。

**デフォルト**: `2`

**範囲**: 1〜8

**設定方法**:

```json
{
  "sassClassExtractor.indentSize": 4
}
```

### 設定例

#### 推奨設定（SASS形式、TABインデント）
```json
{
  "sassClassExtractor.outputFormat": "sass",
  "sassClassExtractor.indentType": "tab"
}
```

#### SCSS形式、2スペースインデント
```json
{
  "sassClassExtractor.outputFormat": "scss",
  "sassClassExtractor.indentType": "space",
  "sassClassExtractor.indentSize": 2
}
```

#### SCSS形式、4スペースインデント
```json
{
  "sassClassExtractor.outputFormat": "scss",
  "sassClassExtractor.indentType": "space",
  "sassClassExtractor.indentSize": 4
}
```

## 実例

### 入力例 1: シンプルなヘッダー

```html
<header class="base-header">
  <a href="/" class="base-header__logo">Logo</a>
  <nav class="base-header__menu">
    <a href="/" class="base-header__menu__item">Models</a>
    <a href="/" class="base-header__menu__item">Products</a>
  </nav>
  <nav class="base-header__nav">
    <a href="/" class="base-header__nav__item base-header__nav__item--cart">Cart</a>
    <a href="/" class="base-header__nav__item base-header__nav__item--account">Account</a>
  </nav>
</header>
```

#### 出力 (SASS形式、TABインデント)

```sass
header.base-header
	.base-header__logo
	.base-header__menu
	.base-header__menu__item
	.base-header__nav
	.base-header__nav__item
		&--cart
		&--account
```

#### 出力 (SCSS形式、TABインデント)

```scss
header.base-header{
	.base-header__logo {
	}
	.base-header__menu {
	}
	.base-header__menu__item {
	}
	.base-header__nav {
	}
	.base-header__nav__item {
		&--cart {}
		&--account {}
	}
}
```

#### 出力 (SASS形式、2スペースインデント)

```sass
header.base-header
  .base-header__logo
  .base-header__menu
  .base-header__menu__item
  .base-header__nav
  .base-header__nav__item
    &--cart
    &--account
```

### 入力例 2: 複数のブロッククラス

```html
<section class="about">
  <div class="about__wrapper">
    <h1 class="about__title">Title</h1>
  </div>
  <div class="ap">
    <div class="ap__col ap__col--left">Left</div>
    <div class="ap__col ap__col--right">Right</div>
  </div>
  <a href="/about" class="animation-button">
    <span class="animation-button__inner">
      <span class="animation-button__text animation-button__text--top">About</span>
      <span class="animation-button__text animation-button__text--bottom">About</span>
    </span>
  </a>
</section>
```

#### 出力 (SASS形式)

```sass
section.about
	.about__wrapper
	.about__title
div.ap
	.ap__col
		&--left
		&--right
a.animation-button
	.animation-button__inner
	.animation-button__text
		&--top
		&--bottom
```

### 特徴的な動作

1. **タグ名の付加**: ブロッククラスには最初に出現したHTMLタグ名が付きます
   - `<header class="base-header">` → `header.base-header`
   - `<div class="ap">` → `div.ap`

2. **出現順の保持**: HTML上に出現した順番で出力されます

3. **フラット構造**: すべてのエレメントは同じインデントレベル（1レベル）で並びます
   - `base-header__menu__item` は `base-header__menu` の子要素でも、同じレベルで出力

4. **モディファイアの配置**: エレメントの直下に `&--modifier` として配置されます
   - `base-header__nav__item--cart` → `&--cart`（2レベルインデント）

5. **重複の除去**: 同じクラスが複数回出現しても1度だけ出力されます

6. **複数ブロックの対応**: 異なるBEMブロック（`about`, `ap`, `animation-button`など）が同じHTML内にある場合、それぞれ独立して出力されます

## 対応ファイル形式

- HTML (`.html`)
- Liquid (`.liquid`) - Shopifyテンプレート
- Astro (`.astro`)
- PHP (`.php`)
- Vue (`.vue`)
- その他のHTMLベースのテンプレート

## 技術仕様

### 出力フォーマット

| 項目 | SASS形式 | SCSS形式 |
|------|---------|---------|
| **構文** | インデントベース | CSS-like（ブレース） |
| **ブロック** | `header.base-header` | `header.base-header{` |
| **エレメント** | `.base-header__logo` | `.base-header__logo {` |
| **モディファイア** | `&--cart` | `&--cart {}` |
| **閉じ括弧** | なし | `}` |

### インデント

| レベル | 要素 | 例 |
|--------|------|-----|
| 0 | ブロッククラス | `header.base-header` |
| 1 | エレメント | `	.base-header__logo` |
| 2 | モディファイア | `		&--cart` |

**インデント文字**:
- タブ（デフォルト）: `\t`
- スペース: 設定したサイズ分のスペース（1〜8）

### BEM解析ルール

- **ブロック**: `__` も `--` も含まないクラス（例: `base-header`）
- **エレメント**: `__` を含むクラス（例: `base-header__logo`）
- **モディファイア**: `--` を含むクラス（例: `base-header__nav--mobile`）

### パーサー

- **使用ライブラリ**: `node-html-parser` v6.1.0
- **DOMツリー走査**: 深さ優先探索（DFS）
- **出現順保持**: HTML上の記述順序を維持

## インストール方法

### 方法1: VSIXファイルから直接インストール

1. 最新の `.vsix` ファイルをダウンロードまたはビルド
2. VSCodeを開く
3. `Cmd+Shift+P` (macOS) または `Ctrl+Shift+P` (Windows/Linux)
4. "Extensions: Install from VSIX..." を入力・選択
5. ダウンロードした `.vsix` ファイルを選択
6. VSCodeをリロード（必要に応じて）

### 方法2: ソースからビルドしてインストール

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd SHOW_CLASS_NAME_DOM

# 2. 依存関係をインストール
bun install

# 3. VSIXファイルをビルド
bunx vsce package

# 4. 生成された sass-class-extractor-0.0.1.vsix をVSCodeにインストール
```

その後、VSCodeで:
1. `Cmd+Shift+P` → "Extensions: Install from VSIX..."
2. `sass-class-extractor-0.0.1.vsix` を選択

## 開発

### 環境構築

```bash
# 依存関係のインストール
bun install
```

### 開発サイクル

```bash
# TypeScriptをコンパイル
bun run compile

# ファイル変更を監視（開発時）
bun run watch
```

### デバッグ実行

1. VSCodeでこのプロジェクトフォルダを開く
2. `F5` キーを押す（またはデバッグビューから "Run Extension" を選択）
3. 新しいVSCodeウィンドウが開き、拡張機能が有効になります
4. 開いたウィンドウでHTMLファイルを開いてテスト

### パッケージング

```bash
# VSIXファイルを生成（配布用）
bunx vsce package

# バージョンを指定してパッケージング
bunx vsce package --version 0.0.2

# プレリリース版としてパッケージング
bunx vsce package --pre-release
```

生成されたファイル: `sass-class-extractor-0.0.1.vsix`

### アンインストール

VSCodeの拡張機能ビューから "SASS Class Extractor" を右クリック → "Uninstall"

## トラブルシューティング

### 拡張機能が動作しない場合

1. VSCodeを完全に再起動
2. 拡張機能を再インストール
3. 開発者ツール（`Cmd+Option+I`）でエラーを確認

### 古いバージョンがインストールされている場合

1. 古いバージョンをアンインストール
2. VSCodeを再起動
3. 新しいバージョンをインストール

### 期待通りの出力にならない場合

1. 設定を確認: `sassClassExtractor.outputFormat`, `indentType`, `indentSize`
2. HTMLが正しい形式であることを確認
3. BEM記法に従っているか確認（`block__element--modifier`）

## よくある質問

**Q: ネストされた構造ではなく、フラットな構造で出力されるのはなぜ？**

A: この拡張機能は、SASSでの記述を簡潔にするため、すべてのエレメントをフラット（同じインデントレベル）で出力します。これにより、コピー＆ペースト後の編集が容易になります。

**Q: 複数のBEMブロックが混在している場合はどうなる？**

A: 各ブロックは独立して出力されます。例えば、`about`, `ap`, `animation-button` が同じHTML内にある場合、それぞれ別のブロックとして出力されます。

**Q: インデントをスペースに変更するには？**

A: 設定で `sassClassExtractor.indentType` を `space` に、`sassClassExtractor.indentSize` を希望のサイズ（2や4など）に設定してください。

## ライセンス

MIT