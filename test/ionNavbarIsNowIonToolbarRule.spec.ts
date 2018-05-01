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
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
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
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
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
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
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
  </ion-buttons>
</ion-toolbar>
              \`
            })
            class Bar {}
          `);
    });

    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \` <ion-navbar><label>Hello</label></ion-navbar>
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
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
  </ion-buttons><label>Hello</label>
</ion-toolbar>
              \`
            })
            class Bar {}
          `);
    });

    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \`
              <ion-navbar>
                <ion-title>Edit Group</ion-title>
              </ion-navbar>
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
        startPosition: {
          line: 3,
          character: 15
        },
        endPosition: {
          line: 4,
          character: 0
        }
      };

      const failures: RuleFailure[] = assertFailure(ruleName, source, fail);

      const fixes: Replacement[] = failures[0].getFix() as any;

      const res = Replacement.applyAll(source, fixes);
      expect(res).to.eq(`
            @Component({
              template: \`
              <ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons><ion-title>Edit Group</ion-title>
</ion-toolbar>              \`
            })
            class Bar {}
          `);
    });

    it('should fail when navbar is passed in', () => {
      let source = `
            @Component({
              template: \`
              <ion-navbar attr="something">
                <ion-title>Edit Group</ion-title>
              </ion-navbar>
              \`
            })
            class Bar {}
          `;

      const fail = {
        message: 'ion-navbar is no longer used. Please use ion-toolbar.',
        startPosition: {
          line: 3,
          character: 14
        },
        endPosition: {
          line: 3,
          character: 43
        }
      };

      const failures: RuleFailure[] = assertFailure(ruleName, source, fail);

      const fixes: Replacement[] = failures[0].getFix() as any;

      const res = Replacement.applyAll(source, fixes);
      expect(res).to.eq(`
            @Component({
              template: \`
             <ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons><ion-title>Edit Group</ion-title>
</ion-toolbar>
              \`
            })
            class Bar {}
          `);
    });
  });
});
