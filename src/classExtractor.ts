import { parse } from 'node-html-parser';

interface ClassInfo {
  fullName: string;
  modifiers: string[];
  order: number;
  tagName?: string;
}

export class ClassExtractor {
  /**
   * HTMLコードからクラス名を抽出してSASS構造に変換
   */
  public extractToSass(html: string): string {
    const root = parse(html, {
      comment: false,
      blockTextElements: {
        script: false,
        noscript: false,
        style: false,
        pre: false
      }
    });

    const allClasses: string[] = [];
    const classToTag = new Map<string, string>();
    this.collectClasses(root, allClasses, classToTag);

    return this.convertToSass(allClasses, classToTag);
  }

  /**
   * DOM内のすべてのクラス名を収集（出現順を保持）
   */
  private collectClasses(node: any, classes: string[], classToTag: Map<string, string>): void {
    if (!node) return;

    // class属性を取得
    const classAttr = node.getAttribute?.('class');
    if (classAttr) {
      const classList = classAttr.trim().split(/\s+/);
      const tagName = node.rawTagName?.toLowerCase();

      classList.forEach((cls: string) => {
        if (cls && !classes.includes(cls)) {
          classes.push(cls);
          // 最初に出現したタグ名を記録（ブロッククラスの場合のみ）
          if (tagName && !cls.includes('__') && !cls.includes('--')) {
            if (!classToTag.has(cls)) {
              classToTag.set(cls, tagName);
            }
          }
        }
      });
    }

    // 子要素を再帰的に処理
    if (node.childNodes) {
      for (const child of node.childNodes) {
        this.collectClasses(child, classes, classToTag);
      }
    }
  }

  /**
   * クラス名の配列をSASS記法に変換（出現順を保持）
   */
  private convertToSass(classes: string[], classToTag: Map<string, string>): string {
    // ブロック名ごとにクラスをグループ化（出現順を保持）
    const blockMap = new Map<string, ClassInfo[]>();

    for (let i = 0; i < classes.length; i++) {
      const className = classes[i];
      // モディファイアを分離（最後の--で分割）
      const lastModifierIndex = className.lastIndexOf('--');

      if (lastModifierIndex !== -1) {
        const baseClass = className.substring(0, lastModifierIndex);
        const modifier = className.substring(lastModifierIndex);

        // ベースクラスを追加（まだなければ）
        const blockName = this.getBlockName(baseClass);
        if (!blockMap.has(blockName)) {
          blockMap.set(blockName, []);
        }

        const blockClasses = blockMap.get(blockName)!;
        let baseInfo = blockClasses.find(c => c.fullName === baseClass);

        if (!baseInfo) {
          // ベースクラスが配列内にあるかチェックして、その位置を使う
          const baseClassIndex = classes.indexOf(baseClass);
          const orderToUse = baseClassIndex !== -1 ? baseClassIndex : i;
          baseInfo = { fullName: baseClass, modifiers: [], order: orderToUse };
          blockClasses.push(baseInfo);
        }

        // モディファイアが既に追加されていないか確認
        if (!baseInfo.modifiers.includes(modifier)) {
          baseInfo.modifiers.push(modifier);
        }
      } else {
        // 通常のクラス
        const blockName = this.getBlockName(className);
        if (!blockMap.has(blockName)) {
          blockMap.set(blockName, []);
        }

        const blockClasses = blockMap.get(blockName)!;
        if (!blockClasses.find(c => c.fullName === className)) {
          blockClasses.push({ fullName: className, modifiers: [], order: i });
        }
      }
    }

    // SASS形式に変換
    const lines: string[] = [];

    // ブロックは出現順のまま（Mapは挿入順を保持）
    for (const [blockName, classList] of blockMap.entries()) {
      // ブロック名を出力（タグ名があれば含める）
      const tagName = classToTag.get(blockName);
      if (tagName) {
        lines.push(`${tagName}.${blockName}`);
      } else {
        lines.push(`.${blockName}`);
      }

      // ブロック自身のモディファイアを出力
      const blockInfo = classList.find(c => c.fullName === blockName);
      if (blockInfo && blockInfo.modifiers.length > 0) {
        for (const modifier of blockInfo.modifiers) {
          lines.push(`\t&${modifier}`);
        }
      }

      // 階層構造を構築してから出力
      this.outputClassHierarchy(blockName, classList, lines);
    }

    return lines.join('\n');
  }

  /**
   * クラスを階層的に出力（出現順を保持）
   */
  private outputClassHierarchy(blockName: string, classList: ClassInfo[], lines: string[]): void {
    // 直接の子要素のみを取得（深さ1のエレメント）
    const directChildren = classList.filter(c => {
      if (c.fullName === blockName) return false;
      const parts = c.fullName.split('__');
      return parts.length === 2; // block__element
    });

    // 出現順にソート
    directChildren.sort((a, b) => a.order - b.order);

    for (const child of directChildren) {
      // 子要素を出力
      lines.push(`\t.${child.fullName}`);

      // モディファイアを出力（子要素の直後に出力）
      if (child.modifiers.length > 0) {
        for (const modifier of child.modifiers) {
          lines.push(`\t\t&${modifier}`);
        }
      }

      // この子要素の子要素を再帰的に出力（モディファイアの後）
      this.outputChildElements(child.fullName, classList, lines);
    }
  }

  /**
   * 特定の親要素の子要素を再帰的に出力（出現順を保持）
   */
  private outputChildElements(parentName: string, classList: ClassInfo[], lines: string[]): void {
    // 親要素の直接の子要素を取得
    const children = classList.filter(c => {
      // 親要素の名前で始まり、さらに__が1つだけ追加されている
      if (!c.fullName.startsWith(parentName + '__')) return false;
      const remaining = c.fullName.substring(parentName.length + 2);
      return !remaining.includes('__'); // 孫要素以降は除外
    });

    // 出現順にソート
    children.sort((a, b) => a.order - b.order);

    for (const child of children) {
      // 子要素を出力
      lines.push(`\t.${child.fullName}`);

      // モディファイアを出力（子要素の直後に出力）
      if (child.modifiers.length > 0) {
        for (const modifier of child.modifiers) {
          lines.push(`\t\t&${modifier}`);
        }
      }

      // この子要素の子要素を再帰的に出力（モディファイアの後）
      this.outputChildElements(child.fullName, classList, lines);
    }
  }

  /**
   * クラス名からブロック名を取得
   */
  private getBlockName(className: string): string {
    return className.split('__')[0];
  }
}
