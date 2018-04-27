import * as ast from '@angular/compiler';
import { NgWalker } from 'codelyzer/angular/ngWalker';
import { BasicTemplateAstVisitor } from 'codelyzer/angular/templates/basicTemplateAstVisitor';
import * as Lint from 'tslint';
import * as ts from 'typescript';
import { Replacement } from 'tslint';

export const ruleName = 'ion-navbar-is-now-ion-toolbar';
const InvalidSyntaxBoxOpen = '<ion-navbar>';
const InvalidSyntaxBoxClose = '</ion-navbar>';
const InvalidSyntaxBoxRe = new RegExp('ion-navbar');
const ValidSyntaxOpen = `<ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-back-button></ion-back-button>
                            </ion-buttons>`;

const ValidSyntaxClose = `</ion-toolbar>`;

const getReplacements = (text: ast.ElementAst, absolutePosition: number) => {
  const content: string = text.sourceSpan.start.file.content;

  const startNodeBeginIndex: number = text.sourceSpan.start.col;
  const startNodeEndIndex: number = text.sourceSpan.end.col;

  const endNodeBeginIndex: number = text.endSourceSpan.start.col;
  const endNodeEndIndex: number = text.endSourceSpan.end.col;

  const len = endNodeBeginIndex - startNodeEndIndex;
  const trimmed = content.substr(startNodeEndIndex, len).trim();

  return [new Lint.Replacement(absolutePosition, endNodeEndIndex - startNodeBeginIndex, `${ValidSyntaxOpen}${trimmed}${ValidSyntaxClose}`)];
};

class IonNavbarIsNowIonToolbarTemplateVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ast.ElementAst, context: any): any {
    if (element.name) {
      let error = null;
      console.log('element.name');
      if (InvalidSyntaxBoxRe.test(element.name)) {
        error = 'Invalid component. Please use ion-toolbar.';
      }

      if (error) {
        const expr: any = (<any>element.sourceSpan).toString();
        const internalStart = expr.indexOf(InvalidSyntaxBoxOpen) + 1;
        const start = element.sourceSpan.start.offset + internalStart;
        const absolutePosition = this.getSourcePosition(start - 1);

        this.addFailure(this.createFailure(start, expr.trim().length, error, getReplacements(element, absolutePosition)));
      }
    }
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: ruleName,
    type: 'functionality',
    description: 'Ion Navbar has been removed and Ion Toolbar is now the recommended component.',
    options: null,
    optionsDescription: 'Not configurable.',
    typescriptOnly: true,
    hasFix: true,
  };

  getOptions() {
    let options = super.getOptions();
    options.ruleSeverity = "error";

    return options;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: IonNavbarIsNowIonToolbarTemplateVisitor
      })
    );
  }
}
