angular.module("pomApp", ['angular-svg-round-progressbar'])
    .filter('time', function() {
        return function(input) {
            input = input || '';
            let out = '';
            let minutes = input / 60;
            let seconds = (minutes - parseInt(minutes)) * 60;
            seconds = Math.round(seconds);
            minutes = parseInt(minutes).toString();
            seconds = parseInt(seconds).toString();

            if (seconds.length === 1) {
                seconds = '0' + seconds;
            }
            if (minutes.length === 1) {
                minutes = '0' + minutes;
            }

            out = minutes + " : " + seconds;
            return out;
        };
    })
    .controller('pomCtrl', function($scope, $timeout) {
        $scope.myTimer = 15;
        $scope.myFixedTimer = 15;  // Set the initial value for myFixedTimer
        let myTimerVariable;

        $scope.color = "#4caf50";
        $scope.bgcolor = "#a5d6a7";

        let myCustomTimer = function() {
            $scope.myTimer--;
            if ($scope.myTimer <= 0) {
                $scope.stop();
                return;
            }
            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.start = function(time) {
            $scope.myTimer = time;
            $scope.myFixedTimer = time;  // Update myFixedTimer whenever we start the timer
            $scope.color = "#4caf50";
            $scope.bgcolor = "#a5d6a7";

            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.stop = function() {
            $timeout.cancel(myTimerVariable);
        };
    });
