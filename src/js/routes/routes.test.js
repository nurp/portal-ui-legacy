import utils from './utils';

describe('routes', () => {
  describe('utils', () => {
    describe('parseIntParam', () => {
      it('should handle strings', () => {
        expect(utils.parseIntParam('1', 0)).to.equal(1);
      });
      it('should prevent negative numbers', () => {
        expect(utils.parseIntParam('-1', 0)).to.equal(0);
      });
      it('should handle defaults', () => {
        expect(utils.parseIntParam(null, 10)).to.equal(10);
      });
    });
  });
});
