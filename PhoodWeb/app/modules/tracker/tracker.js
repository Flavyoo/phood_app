require('./tracker.css');
require('./tracker-dropdowns.css');
const Typo = require('typo-js');
const DateUtilities = require('../../services/utilities/date-utilities');
const CollectionUtilities = require('../../services/utilities/collection-utilities');

module.exports = function(app) {
    app.controller('trackerCtrl', function($scope, $rootScope, $window, $mdDialog, AlertService, AuthService, MenuService, InventoryService, PersistentItemService, PanService, FoodLogService, LossReasonService) {
        const user = AuthService.getUserAuth();

        $scope.meals = ['Breakfast', 'Lunch', 'Dinner'];
        $scope.keypadButtons = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];

        $scope.menus = [];
        $scope.menuItemNames = [];
        $scope.inventory = [];
        $scope.inventoryItemNames = [];

        $scope.currentDay = {display: 'Today', date: new Date()};
        $scope.days = getPast3Days();

        $scope.currentMeal = 'Breakfast';
        $scope.showSearch = false;
        $scope.action = 'Discarded';
        $scope.actions = ['Discarded', 'Repurposed', 'Composted', 'Donation'];

        $scope.reason = '';
        $scope.reasons = [];

        $scope.item = '';
        $scope.searchText = '';
        $scope.items = [];
        $scope.recentLogs = [];

        const emptyPan = {name: 'None', weight: 0};
        $scope.currentPan = emptyPan;
        $scope.pans = [emptyPan];
        $scope.hasPans = false;
        $scope.quantity = 0;

        $scope.msg = 0;
        $scope.isPageOne = true;
        $scope.isPageTwo = false;
        $scope.isPageThree = false;
        $scope.isAddingLog = false;

        $scope.wasSuccessful = false;
        $scope.wasUnsuccessful = false;
        $scope.loadingState = 'Loading';

        $scope.init = function () {
            if (AuthService.isLoggedIn()) {
                const endDate = new Date();
                const startDate = new Date(endDate.getTime() - (2 * 24 * 60 * 60 * 1000));

                $scope.loadingState = 'Loading';
                callAPIs(DateUtilities.toLocalDate(startDate), DateUtilities.toLocalDate(endDate));
            }
        };

        async function callAPIs(localStartDate, localEndDate) {
            let menus;

            const getMenus = await MenuService.getItems(user.location.id, localStartDate, localEndDate);
            if (!getMenus.success) {
                AlertService.alertError('Error retrieving menus.');
            }
            menus = (getMenus.data) && (getMenus.success) ? getMenus.data : [];

            const getInv = await InventoryService.getItems(user.location.id);
            if (!getInv.success) {
                AlertService.alertError('Error retrieving inventory.');
            }
            const inventoryItems = getInv.success && getInv.data ? getInv.data : [];

            const getPersistent = await PersistentItemService.getItems(user.location.id);
            const persistentItems = getPersistent.success && getPersistent.data ? getPersistent.data : [];
            if (!getPersistent.success) {
                AlertService.alertError('Error retrieving persistent items.');
            }

            const getPans = await PanService.getByOrganization(user.organization.id);
            const pans = getPans.success && getPans.data ? getPans.data : [];
            if (!getPans.success) {
                AlertService.alertError('Error retrieving pan list.');
            }

            const getReasons = await LossReasonService.getLossReasons(user.organization.id);
            const lossReasons = getReasons.success && getReasons.data ? getReasons.data : [];
            if (!getReasons.success) {
                AlertService.alertError('Error retrieving loss reasons.');
            }

            menus = menus.map((item) => {
                item.date = DateUtilities.toLocalDate(new Date(item.date));

                return item;
            });

            const dates = menus.map(x => x.date);
            const maxDate = dates.reduce((a, b) => {
                return a > b ? a : b;
            }, []);

            const todayMeals = menus.filter((item) => {
                return item.date === maxDate;
            });
            const todayBreakfast = todayMeals.filter((item) => {
                return item.meal.toLowerCase() === 'breakfast';
            });
            const todayLunch = todayMeals.filter((item) => {
                return item.meal.toLowerCase() === 'lunch';
            });
            const todayDinner = todayMeals.filter((item) => {
                return item.meal.toLowerCase() === 'dinner';
            });

            if (todayBreakfast.length === 0 && todayLunch.length === 0 && todayDinner.length !== 0) {
                $scope.currentMeal = 'Dinner';
            } else if (todayBreakfast.length === 0 && todayLunch.length !== 0) {
                $scope.currentMeal = 'Lunch';
            }

            $scope.menuItemNames = menus.map(x => x.name).sort();

            $scope.inventory = inventoryItems;
            $scope.inventoryItemNames = inventoryItems.map(x => x.name).sort();

            if (pans.length > 0) {
                $scope.hasPans = true;

                const emptyPans = [emptyPan];
                $scope.pans = emptyPans.concat(pans);
            }

            $scope.reasons = lossReasons;
            if ($scope.reasons.length > 0) {
                $scope.reason = $scope.reasons[0].name;
            }

            menus = addPersistentItems(persistentItems, menus);
            processItems(menus);
            $scope.loadingState = 'Ready';
            updateScope();
        }

        function processItems(menus) {
            const menuItemNames = menus.map(x => x.name);
            const itemList = CollectionUtilities.unique(menuItemNames.concat($scope.inventoryItemNames));
            itemList.sort();
            menus = menus.sort((a, b) => {
                return a.name - b.name;
            });

            const itemsAdded = [];

            // Get unique items grouped by name, meal, date once
            // Using an array of strings with format {{name}}{{meal}}{{date}} to keep track
            let sortedMenus = menus.reduce((memo, item) => {
                const itemToCompare = item.name + item.meal + item.date;

                if (!itemsAdded.includes(itemToCompare)) {
                    memo.push(item);
                    itemsAdded.push(itemToCompare);
                }

                return memo;
            }, []);

            sortedMenus.sort((item1, item2) => {
                const nameA = item1.name.toUpperCase(); // ignore upper and lowercase
                const nameB = item2.name.toUpperCase(); // ignore upper and lowercase

                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            $scope.menus = sortedMenus;

            $scope.items = itemList.map((item) => {
                return { name: item, value: item };
            });
        }

        function updateScope() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        function getDateToCompare(date) {
            let curMonth = Number(date.getMonth()) + 1;
            let curDay = Number(date.getDate());

            if (curMonth < 10) {
                curMonth = `0${curMonth}`;
            }

            if (curDay < 10) {
                curDay = `0${curDay}`;
            }

            return `${date.getFullYear()}-${curMonth}-${curDay}`;
        }

        // Check meal and date
        // currentDay.date is in Date format, while the item date is of the form 2017-09-08
        $scope.checkItem = function (item) {
            const itemDate = item.date;
            const selectedDate = getDateToCompare($scope.currentDay.date);

            const itemMeal = item.meal.toLowerCase();
            const currentMeal = $scope.currentMeal.toLowerCase();

            return (itemMeal === currentMeal) && (itemDate === selectedDate);
        };

        $scope.nextPage = function (item) {
            $scope.isPageTwo = true;
            $scope.isPageOne = false;

            $rootScope.$broadcast('goToTrackerPage2', {});
            updateScope();
            $scope.item = item;
        };

        $scope.spellCheck = function (item) {
            const dictionary = new Typo('en_US', false, false, {dictionaryPath: 'node_modules/typo-js/dictionaries'});

            if (item && item.length > 0) {
                const words = item.split(' ');
                let isMispelling = false;

                for (let i = 0; i < words.length; i++) {
                    const isOnlyLetters = /^[a-zA-Z]+$/.test(words[i]);

                    if (isOnlyLetters) {
                        const suggestions = dictionary.suggest(words[i]);

                        if (suggestions.length > 0) {
                            isMispelling = true;
                            const suggestionString = suggestions.join(', ');

                            const confirm = $mdDialog.confirm()
                                .title(`It looks like ${words[i]} might be misspelled.`)
                                .textContent(`Some possible spellings are ${suggestionString}. Would you like to correct it?`)
                                .ariaLabel('Spelling Alert')
                                .ok("No, it's right!")
                                .cancel("Yes, let's correct it.");

                            $mdDialog.show(confirm)
                                .then((answer) => {
                                    if (answer) {
                                        $scope.nextPage(item);
                                    }
                                });

                        }
                    }
                }

                if (!isMispelling) {
                    $scope.nextPage(item);
                }

            } else {
                $scope.failSub('Please enter an item.');
            }
        };

        $scope.switchDisplay = function () {
            $scope.showSearch = (!$scope.showSearch);

            updateScope();
        };

        $scope.keypad = function (key) {
            let quantityString = String($scope.quantity);

            if (key === '<') {
                quantityString = quantityString.slice(0, -1);

            } else if ((key === '.') && (!quantityString.includes('.'))) {
                quantityString += key;

            } else if (isNumeric(key)) {

                if (quantityString === '0') {
                    quantityString = key;
                } else {
                    quantityString += key;
                }
            }

            let quantityNumber = Number(quantityString);
            if (quantityNumber <= 150) {
                $scope.quantity = quantityString;
            }
        };

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.firstPage = function() {
            $scope.isPageTwo = false;
            $scope.isPageOne = true;
        };

        $scope.$on('goToTrackerPage1', () => {
            $scope.firstPage();
        });

        $scope.failSub = function(message) {
            AlertService.alert('Error', message);

            $scope.wasUnsuccessful = true;
            $scope.isAddingLog = false;

            setTimeout(() => {
                $scope.wasUnsuccessful = false;

                updateScope();

            }, 5000);
        };

        function confirmQuantity(item, quantity) {
            const confirm = $mdDialog.confirm()
                .title('Confirm Quantity')
                .textContent(quantity + ' Pounds is a lot of ' + item + '! Are you sure you are throwing away that much?')
                .ariaLabel('Confirm Quantity')
                .ok('Yes')
                .cancel('No');

            return $mdDialog.show(confirm).then(() => {
                console.log('You confirmed the entry');
                return true;
            }, () => {
                console.log('You said no');
                return false;
            });
        }

        $scope.checkInputs = async function() {
            $scope.isAddingLog = true;
            // Check that there's a quantity
            const q = parseFloat($scope.quantity);
            if (q === 0) {
                $scope.failSub('Please enter a quantity.');
                return false;
            }


            let weightDifference = $scope.quantity;
            const panWeight = $scope.currentPan.weightQuantity;
            if (panWeight > 0) {
                const diff = parseFloat($scope.quantity) - panWeight;
                if (diff < 0) {
                    $scope.failSub('The selected pan (' + panWeight + ' lbs) is heavier than the logged quantity. Please double check the quantity and try again.');
                    return false;
                }

                weightDifference = diff;
            }

            // Verify entries >30 Pounds
            if (weightDifference > 30) {
                const stillSubmit = await confirmQuantity($scope.item, $scope.quantity);

                if (!stillSubmit) {
                    $scope.isAddingLog = false;
                    return false;
                }
            }

            const dateProduced = DateUtilities.toLocalDate(new Date($scope.currentDay.date));
            const { item, currentMeal } = $scope;
            const loggedTime = new Date();

            const log = {
                itemName: item,
                itemType: 'Menu',
                locationId: user.location.id,
                loggedTime: loggedTime.toISOString(),
                dateProduced,
                quantity: weightDifference,
                unit: 'Pound',
                meal: currentMeal,
                actionTaken: $scope.action,
                actionReason: $scope.reason
            };

            const recentMatches = $scope.recentLogs.filter(currentLog => currentLog.name === item);
            const newLogSeconds = loggedTime.getTime();

            for (let j = 0; j < recentMatches.length; j++) {
                const curDate = new Date(recentMatches[j].timeStamp);
                const seconds = (newLogSeconds - curDate.getTime()) / 1000;

                if (seconds < 300) {
                    // Same item within past five minutes, so verify
                    duplicateDialog(log);
                    $scope.isAddingLog = false;
                    return false;
                }
            }

            // If it gets here then all criteria was met
            addLog(log);
        };

        function duplicateDialog(log) {
            $mdDialog.show({
                controller: function($scope, $mdDialog) {
                    $scope.cancel = function() {
                        $mdDialog.cancel();

                        $scope.isPageTwo = false;
                    };

                    $scope.submitLog = function() {
                        $mdDialog.cancel();
                        addLog(log);
                    };
                },

                templateUrl: 'app/modules/tracker/duplicate-dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        }

        async function addLog(log) {
            const result = await FoodLogService.addFoodLog(log);
            if (result.success) {
                $scope.isPageThree = true;
                $scope.isPageTwo = false;
                resetInputs();

                setTimeout(() => {
                    $scope.isPageThree = false;
                    $scope.isPageOne = true;

                    updateScope();
                }, 2000);

                $scope.recentLogs.push(log);
            } else {
                AlertService.alertError('Error creating food log.')
            }

            $scope.isAddingLog = false;
        }

        function resetInputs() {
            // $scope.action = 'Discarded';
            $scope.item = '';
            $scope.searchText = '';
            // $scope.showSearch = false;
            $scope.quantity = '';

            updateScope();
        }

        function getPast3Days() {
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let today = new Date();
            let yesterday = new Date();
            let twoDays = new Date();
            yesterday.setDate(today.getDate() - 1);
            twoDays.setDate(today.getDate() - 2);

            return [
                {display: days[twoDays.getDay()], dayName: days[twoDays.getDay()], date: twoDays},
                {display: days[yesterday.getDay()], dayName: days[yesterday.getDay()], date: yesterday},
                {display: 'Today', dayName: days[today.getDay()], date: today}
            ];
        }

        $scope.search = function(search) {
            let lowercaseQuery = angular.lowercase(search);

            return $scope.items.filter(function(item) {
                return item.name.toLowerCase().indexOf(lowercaseQuery) > -1;
            });
        };

        function addPersistentItems(items, menus) {
            let dayNames = $scope.days.map(x => x.dayName);

            let itemsInDateRange = items.filter(function(item) {
                return dayNames.includes(item.dayOfTheWeek);
            });

            let itemsToAdd = itemsInDateRange.map(function(item) {
                let scopeDay = $scope.days.find(function(day) {
                    return item.dayOfTheWeek === day.dayName;
                });

                return {
                    name: item.name,
                    meal: item.meal,
                    location: item.locationId,
                    date: DateUtilities.toLocalDate(new Date(scopeDay.date))
                }
            });

            return menus.concat(itemsToAdd);
        }

        /**
         * Dropdown Logic
         */
        /* When the user clicks on the button,
         toggle between hiding and showing the dropdown content */
        $scope.toggleDropdown = function(id) {
            document.getElementById(id).classList.toggle('tracker-dropdown-item-show');
        };

        $scope.setMeal = function(newMeal) {
            $scope.currentMeal = newMeal;
        };

        $scope.setDay = function(newDay) {
            $scope.currentDay = newDay;
        };

        $scope.setPan = function(newPan) {
            $scope.currentPan = newPan;
        };

        $scope.setAction = function(newAction) {
            $scope.action = newAction;
        };

        $scope.setReason = function(newReason) {
            $scope.reason = newReason.name;
        };

        // Close the dropdown menu if the user clicks outside of it
        $window.onclick = function(event) {
            if (!event.target.matches('.tracker-dropbtn')) {
                let dropdowns = document.getElementsByClassName('tracker-dropdown-content');

                for (let i = 0; i < dropdowns.length; i++) {
                    const openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('tracker-dropdown-item-show')) {
                        openDropdown.classList.remove('tracker-dropdown-item-show');
                    }
                }
            }
        }
    });

    app.filter('filterItemLength', function() {
        return function(item) {
            return item.substring(0, 25);
        };
    });
};