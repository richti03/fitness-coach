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
    // Weitere Übungen können hinzugefügt werden
];

document.getElementById('start-training').addEventListener('click', startCountdown);

function startCountdown() {
    const durationInput = document.getElementById('duration');
    const difficultyInput = document.getElementById('difficulty');
    durationInput.style.display = 'none';
    difficultyInput.style.display = 'none';
    document.querySelector('label[for="duration"]').style.display = 'none';
    document.querySelector('label[for="difficulty"]').style.display = 'none';
    document.getElementById('start-training').style.display = 'none';

    const timerContainer = document.getElementById('timer-container');
    timerContainer.style.display = 'flex';

    const timerElement = document.getElementById('timer');
    const progressElement = document.getElementById('circle-progress');
    const beepSound = document.getElementById('beep-sound');
    let countdown = 15;

    const interval = setInterval(() => {
        timerElement.textContent = countdown;

        const progress = (15 - countdown) / 15; // Fortschritt von 0 bis 1
        const degrees = 360 * progress;
        progressElement.style.background = `conic-gradient(green ${degrees}deg, #f4f4f4 ${degrees}deg)`;

        countdown--;

        if (countdown < 0) {
            clearInterval(interval);
            beepSound.play();
            console.clear();
            console.log('Mach dich bereit!');
            generateWorkout();
        }
    }, 1000);
}

function generateWorkout() {
    const duration = parseInt(document.getElementById('duration').value) * 60; // in Sekunden
    const difficulty = parseInt(document.getElementById('difficulty').value);

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
            remainingTime -= exercise.duration; // Nur die Übungsdauer abziehen
            if (remainingTime > 0) remainingTime -= 15; // 15 Sekunden Pause hinzufügen, wenn noch Zeit übrig ist
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
