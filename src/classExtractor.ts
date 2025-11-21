import { parse } from 'node-html-parser';

interface ClassInfo {
  fullName: string;
  modifiers: string[];
  order: number;
  tagName?: string;
}

export class ClassExtractor {
  private indentChar: string = '\t';

  /**
   * インデント文字を設定
   */
  public setIndent(type: 'tab' | 'space', size: number = 2): void {
    this.indentChar = type === 'tab' ? '\t' : ' '.repeat(size);
  }

  /**
   * HTMLコードからクラス名を抽出してSASS構造に変換
   */
  public extractToSass(html: string, format: 'sass' | 'scss' = 'sass'): string {
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

    return this.convertToSass(allClasses, classToTag, format);
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
  private convertToSass(classes: string[], classToTag: Map<string, string>, format: 'sass' | 'scss' = 'sass'): string {
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

    // SASS/SCSS形式に変換
    const lines: string[] = [];

    // ブロックは出現順のまま（Mapは挿入順を保持）
    for (const [blockName, classList] of blockMap.entries()) {
      // ブロック名を出力（タグ名があれば含める）
      const tagName = classToTag.get(blockName);
      if (format === 'sass') {
        if (tagName) {
          lines.push(`${tagName}.${blockName}`);
        } else {
          lines.push(`.${blockName}`);
        }
      } else {
        // SCSS形式：開き括弧を同じ行に
        if (tagName) {
          lines.push(`${tagName}.${blockName}{`);
        } else {
          lines.push(`.${blockName}{`);
        }
      }

      // ブロック自身のモディファイアを出力
      const blockInfo = classList.find(c => c.fullName === blockName);
      if (blockInfo && blockInfo.modifiers.length > 0) {
        for (const modifier of blockInfo.modifiers) {
          if (format === 'sass') {
            lines.push(`${this.indentChar}&${modifier}`);
          } else {
            lines.push(`${this.indentChar}&${modifier} {}`);
          }
        }
      }

      // すべてのエレメントをフラットに出力
      this.outputAllElements(blockName, classList, lines, format);

      if (format === 'scss') {
        lines.push('}');
      }
    }

    return lines.join('\n');
  }

  /**
   * ブロック配下のすべてのエレメントをフラットに出力
   */
  private outputAllElements(blockName: string, classList: ClassInfo[], lines: string[], format: 'sass' | 'scss'): void {
    // ブロック以外のすべてのクラスを取得
    const elements = classList.filter(c => c.fullName !== blockName);

    // 出現順にソート
    elements.sort((a, b) => a.order - b.order);

    for (const element of elements) {
      if (format === 'sass') {
        lines.push(`${this.indentChar}.${element.fullName}`);
      } else {
        lines.push(`${this.indentChar}.${element.fullName} {`);
      }

      // モディファイアを出力
      if (element.modifiers.length > 0) {
        for (const modifier of element.modifiers) {
          if (format === 'sass') {
            lines.push(`${this.indentChar}${this.indentChar}&${modifier}`);
          } else {
            lines.push(`${this.indentChar}${this.indentChar}&${modifier} {}`);
          }
        }
      }

      if (format === 'scss') {
        lines.push(`${this.indentChar}}`);
      }
    }
  }

  /**
   * クラス名からブロック名を取得
   */
  private getBlockName(className: string): string {
    return className.split('__')[0];
  }
}
