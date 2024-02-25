import { assert } from 'chai';
import { is_urlish, is_plain_object, split_tag_name } from '../src/main.ts';

describe('helper functions', function () {
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

  describe('is_plain_object', function () {
    it('should return true when prototype is Object protoype', function () {
      assert.equal(is_plain_object({a: 'true'}), true);
    })
    it('should return false when passed an Array', function () {
      assert.equal(is_plain_object([1,2,3]), false);
    })
  });

  describe('split_tag_name', function () {
    it('should return an HTML Element: a', function () {
      const x = split_tag_name('a');
      assert.equal(x.tagName, 'A');
    });
    it('should add the class name to the element: a.hello', function () {
      const x = split_tag_name('a.hello');
      assert.equal(x.classList.toString(), 'hello');
    });
    it('should add the id to the element: a#the_link', function () {
      const x = split_tag_name('a#the_link');
      assert.equal(x.id, 'the_link');
    });
    it('should add the classes and id to the element: a#the_link.hello.world', function () {
      const x = split_tag_name('a#the_link.hello.world');
      assert.equal(x.id, 'the_link');
      assert.equal(x.classList.toString(), 'hello world');
    });
  });
});
