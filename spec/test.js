import { assert } from 'chai';
import { is_urlish } from '../src/main.ts';

describe('is_urlish', function () {
  it('should return true when string starts with http://', function () {
    assert.equal(is_urlish('http://k.com.com'), true);
  });
  it('should return true when string starts with https://', function () {
    assert.equal(is_urlish('https://k.com.com'), true);
  });
  it('should return false when string starts with javascript:', function () {
    assert.equal(is_urlish('javascript://alert'), false);
  });
});
