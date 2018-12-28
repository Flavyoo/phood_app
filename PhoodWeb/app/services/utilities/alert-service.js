module.exports = function (app) {
    const showErrors = true;

    app.service('AlertService', function ($mdDialog) {
        this.alertError = (errMsg) => {
            if (showErrors) {
                const msg = errMsg || '';
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Unexpected Error')
                        .htmlContent(`<p>An unexpected error occurred. Please try again later or contact the Phood team.</p><p>${msg}</p>`)
                        .ariaLabel('Error')
                        .ok('OK'),
                );
            }
        };

        this.alertSuccess = (msg) => {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Success')
                    .htmlContent(`<p>${msg}</p>`)
                    .ariaLabel('Success')
                    .ok('OK'),
            );
        };

        this.alertErrorWithJson = (title, response) => {
            try {            
                const errors = response.error.errors;
                const errorValues = Object.values(errors);
                const flattenedErrorValues = [].concat(...errorValues);
                const reformattedErrors = flattenedErrorValues.map(x => `<p>${x}</p>`);
                const errorsHTML = reformattedErrors.join('');
                
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(title)
                        .htmlContent(errorsHTML)
                        .ariaLabel(title)
                        .ok('OK'),
                );
            } catch(e) {
                this.alertError(title + '; failed to display more detailed information');
            }
        };

        this.alert = (title, msg) => {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .htmlContent(`<p>${msg}</p>`)
                    .ariaLabel(title)
                    .ok('OK'),
            );
        };
    });
};