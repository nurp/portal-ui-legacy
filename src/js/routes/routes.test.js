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
    describe('parseJsonParam', () => {
      it('should handle base64 strings', () => {
        const obj = { test: 1 };
        const b64 = JSON.stringify(obj);
        expect(utils.parseJsonParam(b64, {})).to.deep.equal(obj);
      });
      it('should handle defaults', () => {
        const obj = { test: 1 };
        const myMap = new Map();
        myMap.set(NaN, 'not a number');
        myMap.get(NaN); // "not a number"
        expect(utils.parseJsonParam(null, obj)).to.equal(obj);
      });
      it('IE test', () => {
        const myMap = new Map();
        myMap.set(NaN, 'not a number');
        expect(myMap.get(NaN)).to.equal('not a number');
      });
    });
    describe('prepareNodeParams', () => {
      it('should create a base64 id', () => {
        const obj = { id: btoa('File:hello') };
        expect(utils.prepareNodeParams('File')({ id: 'hello' })).to.deep.equal(obj);
      });
    });
  });
});
