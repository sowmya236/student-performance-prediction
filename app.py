from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static"
)

# Load the trained ML model
model = joblib.load("student_model.pkl")


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Prediction
@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        # Get student name
        student_name = data["student_name"]

        # Get input values
        study_hours = float(data["study_hours"])
        attendance = float(data["attendance"])
        previous_marks = float(data["previous_marks"])
        assignments = float(data["assignments"])
        sleep_hours = float(data["sleep_hours"])

        # Prepare data for ML model
        input_data = [[
            study_hours,
            attendance,
            previous_marks,
            assignments,
            sleep_hours
        ]]

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Keep marks between 0 and 100
        prediction = max(0, min(100, prediction))

        prediction = round(prediction, 2)

        # Performance category
        if prediction >= 85:
            category = "Excellent"
        elif prediction >= 70:
            category = "Good"
        elif prediction >= 50:
            category = "Average"
        else:
            category = "Needs Improvement"

        print("Student:", student_name)
        print("Prediction:", prediction)
        print("Category:", category)

        return jsonify({
            "success": True,
            "student_name": student_name,
            "prediction": prediction,
            "category": category
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        })


# Start Flask
if __name__ == "__main__":
    app.run(debug=True)