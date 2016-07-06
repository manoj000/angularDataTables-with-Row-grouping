(function() {
  'use strict';
  angular
    .module('testo')
    .controller('MainController', MainController)
    .directive('datatableWrapper', datatableWrapper)
    .directive('customElement', customElement);

  function datatableWrapper($timeout, $compile) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<ng-transclude></ng-transclude>',
      link: function (scope, element) {
        $timeout(function () {
          $compile(element.find('.custom-element'))(scope);
        }, 0, false);
      }
    };
  }

  /** @Controller */

  function MainController($scope,$resource, DTOptionsBuilder, DTColumnDefBuilder) {

    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()

    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('drawCallback', drawCallback)
      .withOption("columnDefs", [{ "visible": false, "targets": 2 }] )
      .withOption("order", [[ 2, 'asc' ]] );

    function drawCallback(settings) {
      var api = this.api();
      var rows = api.rows( {page:'current'} ).nodes();
      var last=null;
      api.column(2, {page:'current'} ).data().each( function ( group, i ) {
        if ( last !== group ) {
          $(rows).eq( i ).before(
            '<tr style="background-color: #ddd !important;"><td colspan="3"><b>'+group+'</b></td></tr>'
          );
          last = group;
        }
      } );
    }

    vm.changeOptions = changeOptions;

    function changeOptions() {

      vm.dtOptions = DTOptionsBuilder.newOptions().withOption('columnDefs',[{ "visible": false, "targets": 2 }] )

      DTInstances.getLast().then(function(dtInstance) {
        vm.dtInstance = dtInstance;
        vm.dtInstance.rerender();

      });

    }



    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(1).notSortable(),
      DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    $resource('../assets/data.json').query().$promise.then(function(persons) {
      vm.persons = persons;
    });
  }

  /**
   * Your custom element
   */
  function customElement() {
    return {
      template: '<button type="button" class="btn btn-primary" ng-click="showCase.changeOptions()">Group data</button>'
    };
  }
})();
