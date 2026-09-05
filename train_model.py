import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# Load dataset
df = pd.read_csv("data/students.csv")

print("\nDataset loaded successfully!")
print(f"Number of students: {len(df)}")

# Clean data
df = df.drop_duplicates()
df = df.dropna()

print(f"Students after cleaning: {len(df)}")


# Features
features = [
    "age",
    "study_hours",
    "attendance",
    "previous_score",
    "assignment_score",
    "midterm_score",
    "sleep_hours",
    "extracurricular"
]

X = df[features]

# Target
y = df["final_score"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)


# Train
print("\nTraining model...")

model.fit(X_train, y_train)

print("Model training completed!")


# Predictions
predictions = model.predict(X_test)


# Evaluate
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n========== MODEL PERFORMANCE ==========")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")


# Save model
joblib.dump(model, "models/student_model.pkl")

print("\nModel saved successfully!")
print("Location: models/student_model.pkl")