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
        $scope.myTimer = 1500;
        let myTimerVariable;

        $scope.color = "#4caf50";
        $scope.bgcolor = "#a5d6a7";
        $scope.breakTime = 5;
        $scope.workTime = 25;

        let bool = false;

        let myCustomTimer = function() {
            $scope.myTimer--;
            if ($scope.myTimer <= 0) {
                $scope.stop();
                return;
            }
            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.start = function() {
            if (!bool) {
                $scope.myTimer = $scope.workTime * 60;
                $scope.color = "#4caf50";
                $scope.bgcolor = "#a5d6a7";
            } else {
                $scope.myTimer = $scope.breakTime * 60;
                $scope.color = "#d32f2f";
                $scope.bgcolor = "#ef9a9a";
            }

            $scope.myFixedTimer = $scope.myTimer;
            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.stop = function() {
            $timeout.cancel(myTimerVariable);
            bool = !bool;
            if (bool) {
                $scope.start();
            }
        };

        $scope.reset = function() {
            $timeout.cancel(myTimerVariable);
            $scope.myTimer = $scope.myFixedTimer;
        };
    });
