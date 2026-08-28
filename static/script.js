
const form = document.getElementById("predictionForm");
const studentName = document.getElementById("student_name");

const resultCard = document.getElementById("resultCard");
const score = document.getElementById("score");
const category = document.getElementById("category");
const recommendation = document.getElementById("recommendation");
const progressBar = document.getElementById("progressBar");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const predictBtn = document.getElementById("predictBtn");


// ===============================
// PREDICT
// ===============================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const studyHours =
        Number(document.getElementById("study_hours").value);

    const attendance =
        Number(document.getElementById("attendance").value);

    const previousMarks =
        Number(document.getElementById("previous_marks").value);

    const assignments =
        Number(document.getElementById("assignments").value);

    const sleepHours =
        Number(document.getElementById("sleep_hours").value);


    resultCard.style.display = "none";
    errorMessage.style.display = "none";
downloadBtn.style.display = "none";
    loading.style.display = "block";
    predictBtn.disabled = true;


    try {

        const response = await fetch("/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                student_name: studentName.value,

                study_hours: studyHours,

                attendance: attendance,

                previous_marks: previousMarks,

                assignments: assignments,

                sleep_hours: sleepHours

            })

        });


        const data = await response.json();

        console.log("Prediction response:", data);


       if (data.success) { 

            score.textContent = data.prediction;

            category.textContent = data.category;

            progressBar.style.width =
                data.prediction + "%";


            resultCard.querySelector("h2").textContent =
                "Prediction Result for " +
                data.student_name;


            if (data.prediction >= 85) {

                recommendation.textContent =
                    "🌟 Excellent! Keep up the great work!";

            }

            else if (data.prediction >= 70) {

                recommendation.textContent =
                    "👍 Good! A little more practice can improve your score.";

            }

            else if (data.prediction >= 50) {

                recommendation.textContent =
                    "📚 Average. Increase study time and complete assignments.";

            }

            else {

                recommendation.textContent =
                    "💪 Needs Improvement. Focus on study time, attendance, and assignments.";

            }


            resultCard.style.display = "block";
            downloadBtn.style.display = "block";
predictionHistory.unshift({
    name: data.student_name,
    prediction: data.prediction,
    category: data.category
});

localStorage.setItem(
    "predictionHistory",
    JSON.stringify(predictionHistory)
);

displayHistory();
        }

        else {

            errorMessage.textContent =
                "Prediction failed: " + data.message;

            errorMessage.style.display = "block";

        }


    }

    catch (error) {

        console.error("Prediction error:", error);

        errorMessage.textContent =
            "Prediction failed: " + error.message;

        errorMessage.style.display = "block";

    }


    loading.style.display = "none";

    predictBtn.disabled = false;

});


// ===============================
// RESET
// ===============================

const resetBtn =
    document.getElementById("resetBtn");


resetBtn.addEventListener("click", function () {

    form.reset();

    score.textContent = "0";

    category.textContent = "";

    recommendation.textContent = "";

    progressBar.style.width = "0%";

    resultCard.style.display = "none";

    loading.style.display = "none";

    errorMessage.style.display = "none";

    predictBtn.disabled = false;

});
// ===============================
// PREDICTION HISTORY
// ===============================

const historyList = document.getElementById("historyList");

let predictionHistory =
    JSON.parse(localStorage.getItem("predictionHistory")) || [];


function displayHistory() {

    historyList.innerHTML = "";

    if (predictionHistory.length === 0) {

        historyList.innerHTML =
            '<p class="history-empty">No predictions yet.</p>';

        return;
    }


    predictionHistory.forEach(function (item) {

        const historyItem =
            document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerHTML = `
            <strong>${item.name}</strong><br>
            Predicted Marks: ${item.prediction}%<br>
            Performance: ${item.category}
        `;

        historyList.appendChild(historyItem);

    });
}


// Display old history when page opens
displayHistory();
// ===============================
// CLEAR HISTORY
// ===============================

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

clearHistoryBtn.addEventListener("click", function () {

    predictionHistory = [];

    localStorage.removeItem("predictionHistory");

    displayHistory();

});
// ===============================
// DOWNLOAD RESULT
// ===============================

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.style.display = "none";
downloadBtn.addEventListener("click", function () {

    const name = studentName.value || "Student";
    const marks = score.textContent;
    const performance = category.textContent;
    const advice = recommendation.textContent;

    const resultText =
        "STUDENT PERFORMANCE PREDICTION\n\n" +
        "Student Name: " + name + "\n" +
        "Predicted Marks: " + marks + "%\n" +
        "Performance: " + performance + "\n" +
        "Recommendation: " + advice + "\n";

    const blob = new Blob(
        [resultText],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = name + "_Prediction_Result.txt";

    link.click();

    URL.revokeObjectURL(url);
});
