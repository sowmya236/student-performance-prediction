import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# Load dataset
data = pd.read_csv("student_data.csv")

print("Dataset loaded successfully!")
print(data.head())


# Input features
X = data[
    [
        "study_hours",
        "attendance",
        "previous_marks",
        "assignments",
        "sleep_hours"
    ]
]

# Target
y = data["final_marks"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)


# Train model
model.fit(X_train, y_train)

print("Model trained successfully!")


# Test model
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("Mean Absolute Error:", round(mae, 2))
print("R2 Score:", round(r2, 2))


# Save model
joblib.dump(model, "student_model.pkl")

print("Model saved successfully!")