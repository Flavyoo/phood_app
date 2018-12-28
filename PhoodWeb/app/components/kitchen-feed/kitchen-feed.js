require('./kitchen-feed.css');

module.exports = (app) => {
    app.component('kitchenFeed', {
        templateUrl: 'app/components/kitchen-feed/kitchen-feed.html',
        controller: function($scope) {
            $scope.newAsk = '';
            $scope.testCounter = 1;

            $scope.asks = [{
                school: 'JWU',
                src: 'https://assets.pbn.com/wp-content/uploads/2017/06/JWU-logo.jpg',
                text: '32 LBS donated to McKinney Cooperative Shelter!',
                action: 'donation',
                comments: [{
                    text: 'Nice!',
                }, {
                    text: "That's awesome!",
                }],
            }];

            $scope.logos = {
                JWU: 'https://assets.pbn.com/wp-content/uploads/2017/06/JWU-logo.jpg',
                RWU: 'https://i.forbesimg.com/media/lists/colleges/roger-williams-university_416x416.jpg',
            };

            $scope.ask = (newAskText) => {
                const newItem = {
                    text: newAskText,
                    action: 'question',
                    comments: [],
                };

                if ($scope.testCounter === 0) {
                    newItem.school = 'JWU';
                    newItem.src = $scope.logos.JWU;
                    $scope.testCounter = 1;
                } else {
                    newItem.school = 'RWU';
                    newItem.src = $scope.logos.RWU;
                    $scope.testCounter = 0;
                }

                $scope.asks.push(newItem);
                $scope.newAsk = '';
            };

            $scope.post = (commentText, index) => {
                // Find the index of the ask
                const newComment = {
                    text: commentText,
                };

                $scope.asks[index].comments.push(newComment);
                $scope.asks[index].newComment = '';
            };
        },
    });
};