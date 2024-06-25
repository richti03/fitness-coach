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
        $scope.duration = 5;
        $scope.difficulty = 1;
        $scope.showTimer = false;
        $scope.myTimer = 15;
        $scope.myFixedTimer = 15;
        let myTimerVariable;

        $scope.color = "#4caf50";
        $scope.bgcolor = "#a5d6a7";

        let myCustomTimer = function() {
            $scope.myTimer--;
            if ($scope.myTimer <= 0) {
                $scope.stop();
                document.getElementById('beep-sound').play();
                document.getElementById('message').textContent = 'Training beginnt!';
                generateWorkout();
                return;
            }
            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.startTraining = function() {
            $scope.showTimer = true;
            $scope.myTimer = 15;
            $scope.myFixedTimer = 15;
            $scope.color = "#4caf50";
            $scope.bgcolor = "#a5d6a7";

            myTimerVariable = $timeout(myCustomTimer, 1000);
        };

        $scope.stop = function() {
            $timeout.cancel(myTimerVariable);
        };

        function generateWorkout() {
            const duration = $scope.duration * 60; // in Sekunden
            const difficulty = $scope.difficulty;

            let remainingTime = duration;
            const workoutPlan = [];
            const usedExercises = new Set();

            while (remainingTime > 0) {
                const possibleExercises = exercises.filter(ex => ex.difficulty <= difficulty && !usedExercises.has(ex.name));
                if (possibleExercises.length === 0) break;

                const exercise = possibleExercises[Math.floor(Math.random() * possibleExercises.length)];

                if (remainingTime >= exercise.duration) {
                    workoutPlan.push(exercise);
                    usedExercises.add(exercise.name);
                    remainingTime -= exercise.duration;
                    if (remainingTime > 0) remainingTime -= 15;
                } else {
                    break;
                }
            }

            logWorkout(workoutPlan, duration - remainingTime);
        }

        function logWorkout(plan, actualDuration) {
            console.clear();
            console.log('Trainingsplan:');
            plan.forEach((exercise, index) => {
                console.log(`${index + 1}. ${exercise.name} - ${exercise.duration} Sekunden ${exercise.switchSides ? '(Seitenwechsel)' : ''}`);
            });

            console.log(`Gesamtdauer: ${Math.floor(actualDuration / 60)} Minuten und ${actualDuration % 60} Sekunden (inklusive Pausen)`);
        }
    });

const exercises = [
    { name: "Jumping Jacks", duration: 30, difficulty: 1, switchSides: false },
    { name: "Jumping Jacks", duration: 60, difficulty: 2, switchSides: false },
    { name: "Push Ups", duration: 30, difficulty: 2, switchSides: false },
    { name: "Push Ups", duration: 60, difficulty: 3, switchSides: false },
    { name: "Plank", duration: 30, difficulty: 2, switchSides: false },
    { name: "Plank", duration: 60, difficulty: 3, switchSides: false },
    { name: "Lunges", duration: 30, difficulty: 1, switchSides: true },
    { name: "Lunges", duration: 60, difficulty: 2, switchSides: true },
    { name: "Squats", duration: 30, difficulty: 1, switchSides: false },
    { name: "Squats", duration: 60, difficulty: 2, switchSides: false },
    { name: "Burpees", duration: 30, difficulty: 3, switchSides: false },
    { name: "Burpees", duration: 60, difficulty: 4, switchSides: false },
    { name: "High Knees", duration: 30, difficulty: 2, switchSides: false },
    { name: "High Knees", duration: 60, difficulty: 3, switchSides: false },
    { name: "Mountain Climbers", duration: 30, difficulty: 2, switchSides: false },
    { name: "Mountain Climbers", duration: 60, difficulty: 3, switchSides: false },
    { name: "Bicycle Crunches", duration: 30, difficulty: 2, switchSides: true },
    { name: "Bicycle Crunches", duration: 60, difficulty: 3, switchSides: true },
    { name: "Leg Raises", duration: 30, difficulty: 2, switchSides: false },
    { name: "Leg Raises", duration: 60, difficulty: 3, switchSides: false },
    { name: "Tricep Dips", duration: 30, difficulty: 2, switchSides: false },
    { name: "Tricep Dips", duration: 60, difficulty: 3, switchSides: false },
    { name: "Side Plank", duration: 30, difficulty: 2, switchSides: true },
    { name: "Side Plank", duration: 60, difficulty: 3, switchSides: true }
];
