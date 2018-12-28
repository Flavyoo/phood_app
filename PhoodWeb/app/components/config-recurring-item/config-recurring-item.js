module.exports = function(app) {
    app.component('configRecurringItem', {
        bindings: {
            selectedLocation: '<',
        },
        templateUrl: 'app/components/config-recurring-item/config-recurring-item.html',
        controller: function($scope, AlertService, LocationService, PersistentItemService) {
            $scope.isAdmin = this.admin;
            $scope.items = [];
            $scope.selectedOrganization = {};
            $scope.selectedLocation = {};
            $scope.days = ['Every day', 'Weekdays', 'Weekends', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $scope.meals = ['Breakfast', 'Lunch', 'Dinner'];
            [$scope.selectedDay] = $scope.days;
            [$scope.selectedMeal] = $scope.meals;
            $scope.newItem = '';
            $scope.dayObjects = [
                { value: 1, name: 'Sunday' },
                { value: 2, name: 'Monday' },
                { value: 3, name: 'Tuesday' },
                { value: 4, name: 'Wednesday' },
                { value: 5, name: 'Thursday' },
                { value: 6, name: 'Friday' },
                { value: 7, name: 'Saturday' },
            ];

            this.$onChanges = () => {
                $scope.selectedLocation = this.selectedLocation;

                $scope.getItemsForLocation($scope.selectedLocation);
            };

            $scope.getItemsForLocation = async function(selectedLocation) {
                if (selectedLocation && selectedLocation.id) {
                    const result = await PersistentItemService.getItems(selectedLocation.id);
                    if (result.success) {
                        $scope.items = result.data && Array.isArray(result.data) ? result.data : [];
                        updateScope();
                    } else {
                        AlertService.alertError('Error retrieving persistent items.');
                    }
                }
            };

            $scope.addItemsFromDayList = async function addItemsFromDayList() {
                const itemDay = $scope.selectedDay;
                let arr = [itemDay];

                if (itemDay === 'Every day') {
                    arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                } else if (itemDay === 'Weekdays') {
                    arr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                } else if (itemDay === 'Weekends') {
                    arr = ['Sunday', 'Saturday'];
                } else {
                    // Change 'Sunday' to day
                    arr = [itemDay];
                }

                for (let i = 0; i < arr.length; i++) {
                    addItem($scope.newItem, arr[i], $scope.selectedMeal);
                }
            };

             async function addItem(itemName, itemDay, itemMeal) {
                if (itemName && itemDay && itemMeal) {
                    const item = {
                        name: itemName,
                        meal: itemMeal,
                        dayOfTheWeek: itemDay,
                        locationId: $scope.selectedLocation.id
                    };

                    const result = await PersistentItemService.addItem(item);
                    if (result.success) {
                        $scope.items.push(result.data);
                        updateScope();
                    } else {
                        AlertService.alertError('Error creating persistent item.')
                    }
                }
            }

            $scope.editRecurringItem = async function edit(obj) {
                const updatedItem = {
                    persistentItem: {
                        id: obj.id,
                        name: obj.name,
                        meal: obj.meal,
                        dayOfTheWeek: obj.dayOfTheWeek,
                        locationId: obj.locationId
                    }
                };
                const result = await PersistentItemService.updateItem(updatedItem);

                if (!result.success) {
                    AlertService.alertError('Error updating persistent item.')
                }
            };

            $scope.deleteRecurringItem = async function(obj) {
                const result = await PersistentItemService.deleteItem(obj.id);
                if (result.success) {
                    const index = $scope.items.indexOf(obj);
                    $scope.items.splice(index, 1);
                    updateScope();
                } else {
                    AlertService.alertError('Error deleting persistent item.')
                }
            };

            $scope.getDay = async function getDay(day) {
                const index = Number(day);

                return $scope.days[index + 2];
            };

            function updateScope() {
                if (!$scope.$$phase)
                    $scope.$apply();
            }
        }
    });
};