const DateUtilities = require('../../services/utilities/date-utilities');
const CollectionUtilities = require('../../services/utilities/collection-utilities');

module.exports = function(app) {
    app.component('menuEditor', {
        bindings: {
            selectedLocation: '<',
            locations: '<',
            stations: '<',
        },

        templateUrl: 'app/components/menu-editor/menu-editor.html',

        controller: function($scope, AlertService, MenuService, LocationService) {
            $scope.getHumanReadableDate = DateUtilities.isoToMMDDYYYY;
            // const newDate = new Date();
            $scope.date = new Date();
            $scope.localDate = DateUtilities.toLocalDate($scope.date);

            $scope.locations = [];
            $scope.items = [];
            $scope.newItems = [{ key: 0, name: '', station: '' }];

            $scope.selectedLocation = {};
            $scope.showNewItemsCard = false;

            $scope.$on('menu-items-add', addMenuItems);
            $scope.$on('menu-items-add-cancel', cancelAddMenuItems);

            this.$onChanges = async () => {
                $scope.locations = this.locations || [];
                $scope.selectedLocation = this.selectedLocation;
                $scope.stations = this.stations;
                $scope.getItemsForLocation($scope.selectedLocation);
            };

            $scope.getItemsForLocation = async function(selectedLocation) {
                // TODO: The date currently fetched, when first loading the app, is offset by 1 day
                if (selectedLocation && selectedLocation.id) {
                    const result = await MenuService.getItems(selectedLocation.id, $scope.localDate, $scope.localDate);
                    if (result.success) {
                        if (result.data) {
                            $scope.items = result.data.map((obj) => {
                                obj.date = new Date(obj.date);
                                return obj;
                            });

                            $scope.allFoodItemNames = CollectionUtilities.unique(result.data.map(item => item.name));
                        } else {
                            $scope.items = [];
                            $scope.allFoodItemNames = [];
                        }
                    } else {
                        AlertService.alertError('Error retrieving menu items.');
                    }

                    updateScope();
                }
            };

            $scope.editItem = async function(obj) {
                const objToUpdate = {
                    menuItem: {
                        id: obj.id,
                        name: obj.name,
                        locationId: obj.locationId,
                        meal: obj.meal,
                        date: DateUtilities.toLocalDate(obj.date),
                        station: obj.station,
                    },
                };
                const result = await MenuService.updateItem(objToUpdate);

                if (!result.success) {
                    AlertService.alertError('Error updating menu item.');
                }
            };

            $scope.deleteItem = async function(obj) {
                const result = await MenuService.deleteItem(obj.id);

                if (result.success) {
                    const index = $scope.items.indexOf(obj);
                    $scope.items.splice(index, 1);
                    updateScope();
                } else {
                    AlertService.alertError('Error deleting menu item.');
                }
            };

            $scope.deleteAll = async () => {
                const idsToDelete = $scope.items.map(x => x.id);

                const result = await MenuService.deleteListById($scope.selectedLocation.id, idsToDelete);

                if (result.success) {
                    $scope.items = [];
                }

                updateScope();
            };

            $scope.toggleNewItemsCard = function() {
                $scope.showNewItemsCard = !$scope.showNewItemsCard;
            };

            $scope.updateDate = function() {
                $scope.localDate = DateUtilities.toLocalDate($scope.date);
                if ($scope.selectedLocation) {
                    $scope.getItemsForLocation($scope.selectedLocation);
                }
            };

            async function addMenuItems(event, data) {
                const result = await MenuService.bulkAddItems($scope.selectedLocation.id, data.menuItems);

                if (result.success) {
                    data.menuItems.map((menuItem) => {
                        menuItem.date = new Date(menuItem.date);
                        menuItem.locationId = $scope.selectedLocation.id;
                        return menuItem;
                    });

                    $scope.items.concat(data.menuItems);

                    // TODO: This is bad... should just update the scope but values were missing
                    $scope.getItemsForLocation($scope.selectedLocation);
                    $scope.showNewItemsCard = false;
                } else {
                    AlertService.alertErrorWithJson('Error creating menu items', result);
                }
            }

            function cancelAddMenuItems() {
                $scope.showNewItemsCard = false;
            }

            function updateScope() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
};