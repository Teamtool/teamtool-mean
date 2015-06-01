/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.heroEl = element(by.css('.hero-unit'));
  this.h1El = this.heroEl.element(by.css('h1'));
  this.imgEl = this.heroEl.element(by.css('img'));
  this.aLogin = element(by.addLocator('/login'));
};


var TestX = function (href, parentElement) {
  parentElement = parentElement || document;
  var links = parentElement.querySelectorAll('a');
  return Array.prototype.filter.call(links, function (link) {
    return (link.href && ((link.href === href) || (link.href === (link.baseURI + href))));
  });
};


module.exports = new MainPage();

