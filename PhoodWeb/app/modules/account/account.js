module.exports = function(app) {
    app.controller('accountCtrl', function($scope, AlertService, UserService, OrganizationService, LossReasonService) {
        $scope.isAddOrganizationActive = false;
        $scope.isAddUserActive = false;

        $scope.$on('primary-account-add', onPrimaryUserAdd);
        $scope.$on('organization-add', onOrganizationAdd);

        $scope.init = async function() {
            const results = await Promise.all([
                getUserList(true),
                getOrganizationList(),
                getUserList(),
            ]);

            $scope.users = results[0];
            $scope.organizations = results[1];
            $scope.allUsers = results[2];
            
            updateScope();
        };

        async function getUserList(onlyPrimary) {
            const getUsersResult = await UserService.getUserList(onlyPrimary);

            if (getUsersResult.success) {
                return (getUsersResult.data) ? getUsersResult.data : [];
            } else {
                AlertService.alertError('Error retrieving user list.');
                return [];
            }
        }

        async function getOrganizationList() {
            const getOrganizationsResult = await OrganizationService.getOrganizationList(false);

            if (getOrganizationsResult.success) {
                const organizations = (getOrganizationsResult.data) ? getOrganizationsResult.data : [];
                return organizations.sort((org1, org2) => {
                    return org1.name > org2.name ? 1 : -1;
                });
            } else {
                AlertService.alertError('Error retrieving organization list.');
                return [];
            }
        }

        function updateScope() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.showAddOrganizationCard = () => {
            $scope.isAddOrganizationActive = !$scope.isAddOrganizationActive;
            $scope.isAddUserActive = false;
        };

        $scope.showAddPrimaryAccountCard = () => {
            $scope.isAddUserActive = !$scope.isAddUserActive;
            $scope.isAddOrganizationActive = false;
        };

        async function onOrganizationAdd(event, data) {      
            const result = await OrganizationService.addOrganization(data.newOrganization);

            if (result.success) {
                $scope.organizations.push(result.data);
                await addDefaultLossReasons(result.data.id);
                AlertService.alert('Organization created successfully with default loss reasons', 'Now, select that organization within Manage Organization and add a location.');
                $scope.isAddOrganizationActive = false;
            } else {
                AlertService.alertErrorWithJson('Error creating new organization', result);
            }
    
            updateScope();
        }

        async function onPrimaryUserAdd(event, data) {
            const result = await UserService.createPrimaryAccount(data.newUser);
            
            if (result.success) {
                const addedUser = result.data;
                $scope.users.push(addedUser);
                $scope.allUsers.push(addedUser);
                AlertService.alertSuccess('Primary user created successfully');
                $scope.isAddUserActive = false;
    
            } else {
                AlertService.alertErrorWithJson('Error creating new user', result)
            }
    
            updateScope();
        };

        async function addDefaultLossReasons(organizationId) {
            // When an organization is created, give it default loss reasons
            const defaultLossReasons = ['Over Production', 'Quality', 'Spoilage', 'Expiration'];

            for (let i = 0; i < defaultLossReasons.length; i++) {
                const newLossReason = {
                    organizationId,
                    name: defaultLossReasons[i],
                };

                await LossReasonService.addLossReason(newLossReason);
            }
        }
    });
};