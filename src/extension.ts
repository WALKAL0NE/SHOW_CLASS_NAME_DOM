import * as vscode from 'vscode';
import { ClassExtractor } from './classExtractor';

export function activate(context: vscode.ExtensionContext) {
  console.log('SASS Class Extractor is now active!');

  const extractor = new ClassExtractor();

  // コマンドを登録: クリップボードにSASS構造をコピー
  const disposable = vscode.commands.registerCommand(
    'sass-class-extractor.extractToClipboard',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
      }

      // 選択範囲があればそれを使用、なければファイル全体を対象
      const selection = editor.selection;
      const text = selection.isEmpty
        ? editor.document.getText()
        : editor.document.getText(selection);

      if (!text.trim()) {
        vscode.window.showWarningMessage('No content to extract');
        return;
      }

      try {
        // 設定から出力フォーマットとインデント設定を取得
        const config = vscode.workspace.getConfiguration('sassClassExtractor');
        const outputFormat = config.get<'sass' | 'scss'>('outputFormat', 'sass');
        const indentType = config.get<'tab' | 'space'>('indentType', 'tab');
        const indentSize = config.get<number>('indentSize', 2);

        // インデント設定を適用
        extractor.setIndent(indentType, indentSize);

        // SASS/SCSS構造を抽出
        const sassStructure = extractor.extractToSass(text, outputFormat);

        if (!sassStructure.trim()) {
          vscode.window.showWarningMessage('No class names found in selection');
          return;
        }

        // クリップボードにコピー
        await vscode.env.clipboard.writeText(sassStructure);

        // 成功通知を表示（フォーマット名を含める）
        const formatName = outputFormat.toUpperCase();
        vscode.window.showInformationMessage(
          `${formatName} class structure copied to clipboard!`
        );

        // 出力チャンネルにも表示 (オプション)
        const outputChannel = vscode.window.createOutputChannel('SASS Class Extractor');
        outputChannel.appendLine(`=== Extracted ${formatName} Structure ===`);
        outputChannel.appendLine(sassStructure);
        outputChannel.appendLine('================================');
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to extract class structure: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
