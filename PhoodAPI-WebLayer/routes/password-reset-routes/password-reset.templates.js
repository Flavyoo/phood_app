'use strict';

exports.ResetTokenEmail = function(from, to, token) {
    const url = `https://track.phoodsolutions.com/passwordReset/${token}`;
    return {
        Source: from,
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Subject: {
                Data: "PhoodSolutions Password Reset"
            },
            Body: {
                Html: {
                    Data: '<p>A password reset was requested for your account.</p>' +
                    '<div>Click on the following link to reset your password:</div>' +
                    `<a href="${url}">${url}</a>`
                }
            }
        }
    }
};