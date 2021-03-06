module codeEditor.editMark {
  "use strict";

  /**
   * @ngdoc directive
   * @name editTopic.directive:editMarkRequired
   * @restrict A
   *
   * @description Validates that the element contains the edit-mark.
   *
   * @example
   <example module="editTopic">
   <file name="index.html">
   <code-editor edit-mark-required></code-editor>
   </file>
   </example>
   *
   */
  angular
    .module("codeEditor")
    .directive("editMarkRequired", ["EditMark", (editMarker:EditMark):ng.IDirective => {
      return {
        restrict: "A",
        require: "ngModel",
        link: (scope:ng.IScope, elm:JQuery, attrs:ng.IAttributes, ngModel:ng.INgModelController) => {
          ngModel.$validators["editMarkRequired"] = (value) => editMarker.containsMark(value);
        }
      };
    }]);
}
