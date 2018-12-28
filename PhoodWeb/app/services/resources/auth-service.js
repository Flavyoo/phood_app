module.exports = function(app) {
    app.service('AuthService', function(WebApiService, OrganizationService, LocationService, UserSettingsService, AuthState) {
        (function init() {
            AuthState.loadFromLocalStorage();
        })();

        this.login = async (username, password) => {
            const loginAttempt = await WebApiService.apiPOST('/auth/login', { username, password });

            if (loginAttempt.success) {
                const auth = loginAttempt.data;
                const { user } = auth;
                user.roles = auth.roles;

                AuthState.setStateData('sessionId', loginAttempt.headers('Authorization'));

                // todo: better handle permissions and such.
                const userInfo = await getUserInformation(auth.roles, auth.user.id);
                user.location = userInfo.location;
                user.locations = userInfo.locations;
                user.organization = userInfo.organization;
                // user.organizations = userInfo.
                user.settings = userInfo.settings;
                AuthState.setStateData('user', user);

                return {
                    success: true,
                };
            }

            return {
                success: false,
                error: loginAttempt.data,
            };
        };

        this.logout = async (localOnly) => {
            if (localOnly !== true) {
                await WebApiService.apiPOST('/auth/logout');
            }
            AuthState.resetState();
        };

        this.isLoggedIn = () => {
            return (AuthState.getStateData('sessionId') !== undefined);
        };


        this.isTracker = () => {
            const user = AuthState.getStateData('user');
            const navState = AuthState.getStateData('navState');
            const manageLocRoles = user.roles.filter((role) => {
                return role.roleName === 'ManageLocation';
            });

            return (manageLocRoles.length > 0 && navState.isTracker);
        };

        this.isManager = () => {
            const user = AuthState.getStateData('user');
            const navState = AuthState.getStateData('navState');
            const manageLocRoles = user.roles.filter((role) => {
                return role.roleName === 'ManageLocation';
            });

            return (manageLocRoles.length > 0 && navState.isManager);
        };

        this.isDirector = () => {
            const user = AuthState.getStateData('user');
            const manageRoles = user.roles.filter((role) => {
                return role.roleName === 'PrimaryAccount' || role.roleName === 'ManageOrganization';
            });

            return (manageRoles.length > 0);
        };

        this.isAdmin = () => {
            const user = AuthState.getStateData('user');
            const adminRoles = user.roles.filter((role) => {
                return role.roleName === 'AdminSystem';
            });

            return (adminRoles.length > 0);
        };

        this.getNavState = () => {
            return AuthState.getStateData('navState');
        };

        this.setNavState = (state) => {
            const navState = {
                isTracker: false,
                isManager: false,
                isMain: false,
            };

            if (state === 'Tracker') {
                navState.isTracker = true;
            } else if (state === 'Manager') {
                navState.isManager = true;
            } else if (state === 'Main') {
                navState.isMain = true;
            }

            AuthState.setStateData('navState', navState);
        };

        this.getUserAuth = () => {
            return AuthState.getStateData('user');
        };

        this.getSessionId = () => {
            return AuthState.getStateData('sessionId');
        };

        // TODO: Refactor this to sync better with the navbar and be more dynamic with newly created app-states/modules
        this.restrict = (currentState) => {
            const trackerStates = ['tracker', 'logs', 'pcDisplay'];
            const dashboardStates = ['dashboard', 'logs', 'reports', 'account', 'kitchen'];
            const adminStates = ['account', 'logs', 'pans', 'menuEditor', 'menuUploader', 'users', 'donation', 'kitchen', 'recentActivity'];

            // If they don't have an active session, they should be on the login screen
            if (!this.isLoggedIn()) {
                return 'login';
            } else if (this.isTracker() && !trackerStates.includes(currentState)) {
                return 'tracker';
            } else if (this.isManager() && !dashboardStates.includes(currentState)) {
                return 'dashboard';
            } else if (this.isAdmin() && !adminStates.includes(currentState)) {
                return 'account';
            } else if (this.getNavState() === 'Main') {
                return 'main';
            }

            return undefined;
        };

        // todo: handle permissions better. Handle multiple organizations.
        async function getUserInformation(roles, userId) {
            const primaryAccountRoles = roles.filter(x => x.roleName === 'PrimaryAccount');
            const organizationAccessRoles = roles.filter(x => (x.roleName === 'ViewOrganization') || (x.roleName === 'ManageOrganization'));
            const manageOrganizationRoles = roles.filter(x => x.roleName === 'ManageOrganization');
            const manageLocationRoles = roles.filter(x => x.roleName === 'ManageLocation');
            const userSettingsResponse = await UserSettingsService.getUserSettingsByUserId(userId);

            if (primaryAccountRoles.length > 0) {
                const primaryAccountId = primaryAccountRoles[0].userId;
                const orgList = (await OrganizationService.getOrganizationsByOwnerId(primaryAccountId)).data;

                const currentOrg = orgList && orgList.length > 0 ? orgList[0] : null;
                const locList = currentOrg ? (await LocationService.getLocationsByOrganizationId(currentOrg.id)).data : [];

                return {
                    organization: currentOrg,
                    organiozations: orgList,
                    locations: locList,
                    settings: userSettingsResponse.success ? userSettingsResponse.data : {},
                };
            } else if (manageOrganizationRoles.length > 0) {
                const orgId = manageOrganizationRoles[0].organizationEntityId;
                const orgList = (await OrganizationService.getOrganizationById(orgId)).data;
                const locList = (await LocationService.getLocationsByOrganizationId(orgId)).data;

                return {
                    organization: orgList[0],
                    organizations: orgList,
                    locations: locList,
                    settings: userSettingsResponse.success ? userSettingsResponse.data : {},
                };
            } else if (manageLocationRoles.length > 0) {
                const locId = manageLocationRoles[0].locationEntityId;
                const loc = (await LocationService.getLocationById(locId)).data;
                const org = (await OrganizationService.getOrganizationById(loc.organizationId)).data;
                const locList = (await LocationService.getLocationsByOrganizationId(org.id)).data;

                return {
                    organization: org,
                    organizations: [],
                    location: loc,
                    locations: locList,
                    settings: userSettingsResponse.success ? userSettingsResponse.data : {},
                };
            }

            return {};
        }
    });
};