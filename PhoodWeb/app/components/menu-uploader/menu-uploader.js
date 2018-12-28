module.exports = function (app) {
    app.component('menuUploader', {
        bindings: {
            selectedOrganization: '<',
        },
        
        templateUrl: 'app/components/menu-uploader/menu-uploader.html',

        controller: function ($scope, ParsingService, MenuUploadService, OrganizationService, LocationService, MenuService, AlertService) {
            const CollectionUtilities = require('../../services/utilities/collection-utilities');
            
            $scope.data = false;
            $scope.insertItems = false;
            $scope.updateItems = false;
            $scope.loadingState = 'Ready';
            $scope.parseData = [];
            $scope.success = false;
            $scope.error = false;
            $scope.selectedDelimiter = "comma";
            $scope.delimiters = [
                { value: 'comma', name: 'Comma' },
                { value: 'tab', name: 'Tab' },
            ];

            $scope.headers = [
                { name: 'date', canRemove: false, isActive: true },
                { name: 'clientId', canRemove: true, isActive: true },
                { name: 'meal', canRemove: false, isActive: true },
                { name: 'location', canRemove: false, isActive: true },
                { name: 'name', canRemove: false, isActive: true },
                { name: 'portionQuantity', canRemove: true, isActive: true },
                { name: 'portionUnit', canRemove: true, isActive: true },
                { name: 'portionsProduced', canRemove: true, isActive: true },
                { name: 'portionCost', canRemove: true, isActive: true },
                { name: 'station', canRemove: true, isActive: true },
            ];

            this.$onChanges = async () => {
                $scope.selectedOrganization = this.selectedOrganization;
            };

            $scope.onFileUploaded = async () => {
                [$scope.inputFile] = document.getElementById('inputFiles').files;
                $scope.rawParseData = await ParsingService.parseFile($scope.inputFile, $scope.selectedDelimiter);

                const parsedItemKeys = Object.keys($scope.rawParseData[0]);
                for(let i = $scope.headers.length; i < parsedItemKeys.length; i++) {
                    $scope.headers[i] = { name: '', index: -1, canRemove: false, isActive: true };
                }

                updateScope();
            };

            $scope.removeHeader = (header) => {
                // If the field is hidden, we need to swap a blank one into its place to preserve the UI appearance
                const duplicateArray = JSON.parse(JSON.stringify($scope.headers)).reverse();
                const reversedIndex = duplicateArray.findIndex(x => x && x.name === '');
                const newHeaderIndex = duplicateArray.length - 1 - reversedIndex;

                const draggedIndex = $scope.headers.findIndex(x => x && x.name === header.name);
                header.isActive = false;

                swapElements(newHeaderIndex, draggedIndex);
            };

            $scope.drag = (ev) => {
                ev.dataTransfer.setData('headerName', ev.target.attributes['data-header'].value);
            };

            $scope.drop = (event) => {
                event.preventDefault();

                const newHeaderIndex = event.target.attributes['data-index'].value;
                const headerName = event.dataTransfer.getData('headerName');
                const draggedIndex = $scope.headers.findIndex(x => x && x.name === headerName);
                swapElements(newHeaderIndex, draggedIndex);
            };

            $scope.allowDrop = (event) => {
                event.preventDefault();
            };

            function swapElements(newHeaderIndex, draggedIndex) {
                // Copy what's currently in the target cell
                const copiedItem = $scope.headers[newHeaderIndex];
                $scope.headers[newHeaderIndex] = $scope.headers[draggedIndex];
                $scope.headers[draggedIndex] = copiedItem;

                // Move that header to the appropriate index
                updateScope();
            }

            $scope.validateMenu = (menu) => {
                const mealNames = menu.map(obj => obj.meal);

                const numericMealNames = mealNames.filter(isNumeric);
                if (numericMealNames.length) {
                    console.error('There were numeric meals parsed in this menu.');
                }

                return !!numericMealNames.length;
            };

            $scope.genericUploadMenu = async (organization) => {
                const file = $scope.inputFile;

                if (file) {
                    // $scope.loadingState = 'Loading';
                    let processedParseData = await ParsingService.parseGenericFile(file, $scope.selectedDelimiter, $scope.headers);
                    let processedParseDataWithMeals = ParsingService.processMeals(processedParseData);

                    const locationsResponse = await LocationService.getLocationsByOrganizationId($scope.selectedOrganization.id);
                    let locations = [];
                    if (locationsResponse.success) {
                        locations = locationsResponse.data;
                    }

                    const menuWithLocationIds = processedParseDataWithMeals.map(item => {
                        const locationMatch = locations.find(loc => loc.alias === item.location);

                        item.locationId = locationMatch ? locationMatch.id : null;
                        delete item.location;
                        return item;
                    });

                    const menusToUpload = filterFalsyItems(menuWithLocationIds);
                    const menuUploadResponse = await MenuUploadService.uploadOrganizationMenu($scope.selectedOrganization.id, menusToUpload);

                    if (menusToUpload.length && menuUploadResponse.success) {
                        AlertService.alertSuccess('Menu uploaded successfully');
                    } else if (!menusToUpload.length && menuUploadResponse.success) {
                        AlertService.alert('No menus added', 'No location aliases match the locations in the uploaded file. Please compare the locations in the file to make sure that their names match a location alias.');
                    } else {
                        AlertService.alertErrorWithJson('Error uploading menu', menuUploadResponse);
                    }
                }
            };

            // TODO: This is just like the "removeBadRows" column
            function filterFalsyItems(inputData) {
                return inputData.filter(itemObject => {
                    const hasValidName = itemObject && itemObject.name && !itemObject.name.includes('- -');

                    return hasValidName && itemObject.locationId;

                });
            };

            function updateScope() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            }

            function removeBadRows(parsedData) {
                const data = [];

                for (let i = 0; i < parsedData.length; i++) {
                    const item = parsedData[i];
                    if (item.name !== '' && item.meal !== '' && (!item.portionQuantity || isNumeric(item.portionQuantity)) && (!item.portionCost || isNumeric(item.portionCost))) {
                        data.push(item);
                    }
                }

                return data;
            }

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
        }
    });
};