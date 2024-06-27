// AngularJS Modul Definition mit der Abhängigkeit 'angular-svg-round-progressbar'
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
        // Initiale Werte für Trainingsdauer und Schwierigkeitsgrad
        $scope.duration = 5;
        $scope.difficulty = 1;

        // Flag zum Anzeigen des Timers und des Trainingsplans
        $scope.showTimer = false;
        $scope.showWorkoutPlan = false;

        // Initiale Werte für den Timer
        $scope.myTimer = 15;
        $scope.myFixedTimer = 15;

        // Variablen zur Steuerung des Trainingsablaufs
        let myTimerVariable;
        let workoutPlan = [];
        let currentExerciseIndex = -1;
        let inPause = false;

        // Farben für den Timer
        $scope.color = "#4caf50";
        $scope.bgcolor = "#a5d6a7";

        // Funktion zum Starten des Timers
        function startTimer(duration, message, callback) {
            $scope.myTimer = duration;
            $scope.myFixedTimer = duration;
            document.getElementById('message').textContent = message;

            // Funktion zum Aktualisieren des Timers jede Sekunde
            function timerTick() {
                $scope.myTimer--;
                if ($scope.myTimer <= 0) {
                    $timeout.cancel(myTimerVariable);
                    document.getElementById('gong-sound').play();
                    callback();
                    return;
                }
                myTimerVariable = $timeout(timerTick, 1000);
            }

            myTimerVariable = $timeout(timerTick, 1000);
        }

        // Vereinfachte Funktion zum Wechseln zwischen Übungen und Pausen
        function nextStep() {
            console.log("inPause: " + inPause);
            console.log(currentExerciseIndex);
            console.log(workoutPlan.length);
            if (inPause) {
                // Pause beginnen
                inPause = false;
                // Starten des Timers für die Pause
                startTimer(15, 'Pause', nextStep);
            } else {
                // Erhöhe den Index der aktuellen Übung
                currentExerciseIndex++;

                // Pause beenden
                inPause = true;
                // Holen der nächsten Übung aus dem Trainingsplan
                const exercise = workoutPlan[currentExerciseIndex];

                // Prüfen, ob noch Übungen im Trainingsplan verbleiben
                if (currentExerciseIndex === workoutPlan.length - 1) {
                    console.log("DISPLAY WORKOUT");
                    // Starten des Timers für die nächste Übung
                    startTimer(exercise.duration, exercise.name, displayWorkoutPlan);
                } else {
                    // Starten des Timers für die nächste Übung
                    startTimer(exercise.duration, exercise.name, nextStep);
                }

            }
        }

        // Funktion zum Starten des Trainings
        $scope.startTraining = function() {
            $scope.showTimer = true;
            generateWorkout();
            // Setze den Index der aktuellen Übung auf -1, um das Training zu starten
            currentExerciseIndex = -1;
            inPause = false;
            // Starten des Timers für die erste Pause, bevor die Übungen beginnen
            startTimer(15, 'Mach dich bereit!', nextStep);
        };

        // Funktion zum Zurücksetzen des Trainings
        $scope.reset = function() {
            $scope.showWorkoutPlan = false;
            $scope.showTimer = false;
        };

        // Funktion zur Generierung des Trainingsplans basierend auf Dauer und Schwierigkeitsgrad
        function generateWorkout() {
            const duration = $scope.duration * 60; // in Sekunden
            const difficulty = $scope.difficulty;

            let remainingTime = duration;
            workoutPlan = [];
            const usedExercises = new Set();

            while (remainingTime > 0) {
                const possibleExercises = exercises.filter(ex => ex.difficulty <= difficulty && !usedExercises.has(ex.name));
                if (possibleExercises.length === 0) break;

                const exercise = possibleExercises[Math.floor(Math.random() * possibleExercises.length)];

                if (remainingTime >= exercise.duration) {
                    workoutPlan.push(exercise);
                    usedExercises.add(exercise.name);
                    remainingTime -= exercise.duration;
                    if (remainingTime > 0 && workoutPlan.length > 0) remainingTime -= 15; // Nur Pause, wenn nicht die letzte Übung
                } else {
                    break;
                }
            }

            logWorkout(workoutPlan, duration - remainingTime);
        }

        // Funktion zum Loggen und Anzeigen des Trainingsplans
        function logWorkout(plan, actualDuration) {
            const workoutPlanContainer = document.getElementById('workout-plan');
            workoutPlanContainer.innerHTML = ''; // Clear previous plan

            const planList = document.createElement('ul');
            plan.forEach((exercise, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${exercise.name} - ${exercise.duration} Sekunden ${exercise.switchSides ? '(Seitenwechsel)' : ''}`;
                planList.appendChild(listItem);
            });

            const totalDuration = document.createElement('p');
            totalDuration.textContent = `Gesamtdauer: ${Math.floor(actualDuration / 60)} Minuten und ${actualDuration % 60} Sekunden (inklusive Pausen)`;

            workoutPlanContainer.appendChild(planList);
            workoutPlanContainer.appendChild(totalDuration);

            console.clear();
            console.log('Trainingsplan:');
            plan.forEach((exercise, index) => {
                console.log(`${index + 1}. ${exercise.name} - ${exercise.duration} Sekunden ${exercise.switchSides ? '(Seitenwechsel)' : ''}`);
            });

            console.log(`Gesamtdauer: ${Math.floor(actualDuration / 60)} Minuten und ${actualDuration % 60} Sekunden (inklusive Pausen)`);
        }

        // Funktion zum Anzeigen des Trainingsplans
        function displayWorkoutPlan() {
            $scope.showTimer = false;
            $scope.showWorkoutPlan = true;
            console.log("in fuction");
            const workoutPlanContainer = document.getElementById('workout-plan-container');
            workoutPlanContainer.style.display = 'block';
        }
    });
