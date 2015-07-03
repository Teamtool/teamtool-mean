// features/support/after_hooks.js

var myAfterHooks = function () {
  this.After(function (callback) {
    // Again, "this" is set to the World instance the scenario just finished
    // playing with.

    element(by.buttonText("Logout")).click();

    // Release control:
    callback();
  });
};

module.exports = myAfterHooks;
