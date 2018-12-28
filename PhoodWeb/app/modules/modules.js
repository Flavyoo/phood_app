'use strict';

module.exports = function(app) {
    require('./account/account')(app);
    require('./dashboard/dashboard')(app);
    require('./donation/donation')(app);
    require('./kitchen/kitchen')(app);
    require('./login/login')(app);
    require('./logs/logs')(app);
    require('./main/main')(app);
    require('./recent-activity/recent-activity')(app);
    require('./reports/reports')(app);
    require('./tracker/tracker')(app);
};