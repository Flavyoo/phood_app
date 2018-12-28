const DateUtilities = require('../../services/utilities/date-utilities');

module.exports = function(app) {
  app.component('newMenuItemsCard', {
    bindings: {
      locationId: '<',
      stations: '<',
    },

    templateUrl: 'app/components/new-menu-items-card/new-menu-items-card.html',

    controller: function($scope, $rootScope, AlertService) {
      $scope.newItems = [];
      $scope.locationId = '';
      $scope.stations = [];
      $scope.meals = ['Breakfast', 'Lunch', 'Dinner'];

      $scope.date = new Date();
      $scope.localDate = DateUtilities.toLocalDate($scope.date);

      $scope.addItemField = addItemField;
      $scope.addItemField();

      this.$onChanges = () => {
        $scope.locationId = this.locationId;
        $scope.stations = this.stations;
      };

      $scope.addItems = async () => {
          const menuItems = [];

          for (let i = 0; i < $scope.newItems.length; i++) {
              const itemToAdd = {
                  name: $scope.newItems[i].name,
                  meal: $scope.newItems[i].meal,
                  date: $scope.localDate,
                  locationId: $scope.newItems[i].locationId,
              };

              if ($scope.newItems[i].station && $scope.newItems[i].station.name) {
                itemToAdd.station = $scope.newItems[i].station.name;
              }

              if (itemToAdd.name) {
                  menuItems.push(itemToAdd);
              }
          }

          $rootScope.$broadcast('menu-items-add', {
            menuItems,
          });

          $scope.newItems = [];
          $scope.addItemField();
      };
      
      $scope.cancelAddPan = function() {
        $rootScope.$broadcast('menu-items-add-cancel');
        $scope.menuItems = [];
      };

      function addItemField() {
        $scope.newItems.push({
          key: $scope.newItems.length,
          meal: 'Breakfast',
          name: '', 
          station: '',
          locationId: $scope.locationId,
        });
      }
    },
  });
};