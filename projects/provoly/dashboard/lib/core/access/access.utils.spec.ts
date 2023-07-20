import { PryAccess } from './access.model';
import { PryAccessUtils } from './access.utils';

const accessTree: PryAccess = {
  modules: {
    module1: {
      pages: {
        page1: {
          actions: {
            action1: ['role1'],
            action2: ['role2']
          }
        },
        page2: {}
      }
    },
    module2: {
      roles: ['role2'],
      pages: {
        page2: {
          roles: ['role3']
        }
      }
    },
    module3: {
      roles: ['role3'],
      pages: {
        page3: {
          roles: ['role3'],
          actions: {
            action3: ['role3'],
            action4: ['role4']
          }
        }
      }
    }
  }
};

describe('PryAccessUtils functions', () => {
  describe('notExistsAllowStrategy', () => {
    it('should allow with no params', () => {
      expect(PryAccessUtils.notExistsAllowStrategy()).toEqual(true);
    });
    it('should allow page with no roles', () => {
      expect(PryAccessUtils.notExistsAllowStrategy([], accessTree, 'module1', 'page1')).toEqual(true);
    });
    it('should allow page with roles', () => {
      expect(PryAccessUtils.notExistsAllowStrategy(['role1'], accessTree, 'module1', 'page1', 'action1')).toEqual(true);
    });
    it('should not allow page with wrong roles', () => {
      expect(PryAccessUtils.notExistsAllowStrategy(['role1'], accessTree, 'module1', 'page1', 'action2')).toEqual(
        false
      );
      expect(PryAccessUtils.notExistsAllowStrategy(['role1'], accessTree, 'module2')).toEqual(false);
      expect(PryAccessUtils.notExistsAllowStrategy(['role2'], accessTree, 'module2', 'page2')).toEqual(false);
    });
  });
  describe('notExistsBlockStrategy', () => {
    it('should not allow with no params', () => {
      expect(PryAccessUtils.notExistsBlockStrategy()).toEqual(false);
    });
    it('should not allow page with no roles', () => {
      expect(PryAccessUtils.notExistsBlockStrategy([], accessTree, 'module1', 'page1')).toEqual(false);
    });
    it('should allow page with roles', () => {
      expect(PryAccessUtils.notExistsBlockStrategy(['role3'], accessTree, 'module3', 'page3', 'action3')).toEqual(true);
    });
    it('should not allow page with wrong roles', () => {
      expect(PryAccessUtils.notExistsBlockStrategy(['role1'], accessTree, 'module1', 'page1', 'action2')).toEqual(
        false
      );
      expect(PryAccessUtils.notExistsBlockStrategy(['role1'], accessTree, 'module2')).toEqual(false);
      expect(PryAccessUtils.notExistsBlockStrategy(['role2'], accessTree, 'module2', 'page2')).toEqual(false);
      expect(PryAccessUtils.notExistsBlockStrategy(['role3'], accessTree, 'module3', 'page3', 'action4')).toEqual(
        false
      );
    });
  });
});
