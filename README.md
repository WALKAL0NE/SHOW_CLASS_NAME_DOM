# SASS Class Extractor

HTML/Liquid/Astro/PHP/VueファイルからクラスをBEM構造で抽出し、SASS/SCSSに貼り付けられる形式で出力するVSCode拡張機能です。

## 概要

この拡張機能は、HTMLテンプレート内のクラス名を自動的に抽出し、SASS/SCSS用のクラス構造を生成します。BEM記法に対応しており、HTML上の出現順を保持したまま、階層構造を維持して出力します。

## 主な機能

- ✅ **HTML、Liquid、Astro、PHP、Vueファイルに対応**
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
- PHP (`.php`)
- Vue (`.vue`)
- その他のHTMLベースのテンプレート

## 技術仕様

- **インデント**: タブ文字（1タブ = エレメント、2タブ = モディファイア）
- **クラス名抽出**: DOMツリーを走査して出現順を保持
- **BEM解析**: `__`（エレメント）と`--`（モディファイア）を自動認識
- **パーサー**: node-html-parser

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

### パッケージングの詳細

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

## ライセンス

MIT
