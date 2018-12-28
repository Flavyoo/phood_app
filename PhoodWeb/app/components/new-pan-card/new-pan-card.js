module.exports = function(app) {
  app.component('newPanCard', {
    bindings: {
      organizationId: '<'
    },

    templateUrl: 'app/components/new-pan-card/new-pan-card.html',

    controller: function($scope, $rootScope) {
      const emptyPan = {
        organizationId: '',
        name: '',
        weightQuantity: '',
        weightUnit: 'Pounds',
      };

      $scope.newPan = emptyPan;

      this.$onChanges = () => {
        emptyPan.organizationId = this.organizationId;
        $scope.newPan.organizationId = this.organizationId;
      };

      $scope.addPan = async function() {
        $rootScope.$broadcast('pan-add', {
            panToAdd: $scope.newPan,
        });

        $scope.newPan = emptyPan;
      };
      
      $scope.cancelAddPan = function() {
        $rootScope.$broadcast('pan-add-cancel');
        $scope.newPan = emptyPan;
      };
    },
  });
};