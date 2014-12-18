(function() {
  'use strict';
  angular
    .module('headerIndex')
    .directive('headerIndex', HeaderIndex);

  HeaderIndex.$inject = ['$timeout', '$window', '$document'];

  function HeaderIndex($timeout, $window, $document) {
    var obj = {
      restrict: 'AE',
      templateUrl: 'modules/headerIndex/view.html',
      controllerAs: 'indexCtrl',
      controller: IndexCtrl,
      link: indexLink
    };

    return obj;

    function indexLink(scope, element, attrs, ctrl) {
      var titleSelector = attrs.titleSelector || 'section>article>h1';
      var subtitleSelector = attrs.subtitleSelector || 'section>article>h2';

      var title = angular.element(element).parent('body').find(titleSelector);
      ctrl.title = title && title[0] && title[0].textContent;

      var subtitles = _.object(
        _.map(
          angular.element(element).parent('body').find(subtitleSelector) || [],
          function(entry) {
            return [entry.id, entry.textContent];
          }));

      subtitles[title && title[0] && title[0].id] = attrs.introText || 'Introduction';

      var wnd = angular.element($window);
      wnd.bind('scroll', function() {
        var wndPos = wnd.scrollTop();
        var wndHeight = wnd.height();
        var docHeight = angular.element($document).height();

        angular.forEach(subtitles, function(value, key) {
          key = '#' + key;
          var elem = angular.element(key);
          var divPos = elem.offset().top;
          var divHeight = elem.height();
          if (wndPos >= divPos && wndPos < (divPos + divHeight)) {
            ctrl.updateSubtitle(value);
          }
        });

        if (wndPos + wndHeight === docHeight) {
          $timeout(function() {
            ctrl.updateSubtitle(subtitles[Object.keys(subtitles)[Object.keys(subtitles).length - 1]]);
          }, 400);
        }
      });
    }
  }

  IndexCtrl.$inject = ['$scope'];

  function IndexCtrl($scope) {
    var ctrl = this;
    this.updateSubtitle = function(text) {
      ctrl.subtitleClass = '';
      $scope.$apply();

      $timeout(function() {
        ctrl.subtitle = text;
        ctrl.subtitleClass = 'active';
        $scope.$apply();
      }, 500);
    };
  }
})();