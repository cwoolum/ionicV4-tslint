import { assertSuccess, assertAnnotated, assertFailure } from './testhelper';
import { Replacement, RuleFailure } from 'tslint';
import { expect } from 'chai';
import { ruleName } from '../src/ionNavbarIsNowIonToolbarRule';

describe(ruleName, () => {
  describe('success', () => {
    it('should work with proper style', () => {
      let source = `
          @Component({
            template: \`  <ion-toolbar></ion-toolbar>  \`
          })
          class Bar {}
        `;
      assertSuccess(ruleName, source);
    });
  });

  describe('failure', () => {
    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \` <ion-navbar></ion-navbar>
                                              ~~~~~~~~~~~~~~~~~
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'Invalid component. Please use ion-toolbar.',
        startPosition: {
          line: 2,
          character: 27
        },
        endPosition: {
          line: 2,
          character: 39
        }
      };

      assertFailure(ruleName, source, fail);
    });

    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \` 
              <ion-navbar>
                <label>Something</label>
              </ion-navbar>
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'Invalid component. Please use ion-toolbar.',
        startPosition: {
          line: 3,
          character: 15
        },
        endPosition: {
          line: 4,
          character: 0
        }
      };

      assertFailure(ruleName, source, fail);
    });
  });

  describe('replacements', () => {
    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \` <ion-navbar></ion-navbar>
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'Invalid component. Please use ion-toolbar.',
        startPosition: {
          line: 2,
          character: 27
        },
        endPosition: {
          line: 2,
          character: 39
        }
      };

      const failures: RuleFailure[] = assertFailure(ruleName, source, fail);

      const fixes: Replacement[] = failures[0].getFix() as any;

      const res = Replacement.applyAll(source, fixes);
      expect(res).to.eq(`
            @Component({
              template: \` <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-back-button></ion-back-button>
                            </ion-buttons></ion-toolbar>
              \`
            })
            class Bar {}
          `);
    });
  });
});
