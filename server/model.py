global index
import numpy as np
import pandas as pd

states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]


def process_data_and_save_to_csv(input_file, output_file):
    # import the dataset
    data = pd.read_csv(input_file)
    # Filter out rows for US territories
    data = data[data['state'].isin(states)]

    # Remove duplicates based on year and incident_type
    data = data.drop_duplicates(subset=['state', 'fy_declared', 'incident_type'])

    # create new DataFrame
    dataset = pd.DataFrame(data)

    # Get the 8 most common incident types
    common_incidents = dataset['incident_type'].value_counts().nlargest(5).index.tolist()

    # Create new rows for each state, year, and incident type, indicating if it occurred
    # Dictionary to store the most common incident types for each state and year
    state_year_incidents = {}
    # Iterate over each row in the dataset
    for index, row in dataset.iterrows():
        state = row['state']
        year = row['fy_declared']
        incident_type = row['incident_type']

        # Check if this incident type is one of the 6 most common
        if incident_type in common_incidents:
            # Check if we already have an entry for this state and year
            if (state, year) not in state_year_incidents:
                # If not, create a new entry with all incident types set to 0
                state_year_incidents[(state, year)] = {incident: 0 for incident in common_incidents}

            # Set the is_occured value to 1 for this incident type
            state_year_incidents[(state, year)][incident_type] = 1
    # Create a new DataFrame from the state_year_incidents dictionary
    new_data = []
    for (state, year), incidents in state_year_incidents.items():
        for incident, is_occured in incidents.items():
            new_data.append([state, year, incident, is_occured])

    # update dataset to the new format
    dataset = pd.DataFrame(new_data, columns=['state', 'fy_declared', 'incident_type', 'is_occured'])

    # Save the processed data to a new CSV file
    dataset.to_csv(output_file, index=False)


# for performance, check if processed file already exists, else run thi
import os
input_file = 'us_disaster_declarations.csv'
output_file = 'processed_data.csv'

if not os.path.exists(output_file):
    process_data_and_save_to_csv(input_file, output_file)

dataset = pd.read_csv(output_file)
common_incidents = dataset['incident_type'].unique()

# Separate features (state and fy_declared) and target variable (incident_type)
X = dataset[['state', 'fy_declared', 'incident_type']]
y = dataset['is_occured']
# Encoding categorical data
# Encoding the Independent Variable
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(sparse_output=False), [0, 2])],
                       remainder='passthrough')
X = np.array(ct.fit_transform(X))
# splitting the dataset into training and test set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
# feature scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
# Training the logistic regression model on the training set
from sklearn.svm import SVC
classifier = SVC(kernel='rbf', random_state=42, probability=True)
classifier.fit(X_train, y_train)


def predict_by_year(input_year):
    state_names = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
        'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts',
        'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
        'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
        'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
        'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
        'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    }

    # Get a JSON list of predictions
    # format the numbers to be usable on the client side
    predictions = []
    for state in states:
        state_predictions = {}
        state_predictions["state"] = state
        state_predictions["state_full"] = state_names[state]  # Add the full state name
        state_predictions["predictions"] = {}
        avg_pred_total = 0;
        for incident in common_incidents:
            new_input = pd.DataFrame({'state': [state], 'fy_declared': [input_year], 'incident_type': [incident]})
            X_new = np.array(ct.transform(new_input))
            X_new_scaled = sc.transform(X_new)
            probabilities = classifier.predict_proba(X_new_scaled)
            prediction_value = round(probabilities[0][1] * 100, 2)
            probability_occurrence = prediction_value
            avg_pred_total += prediction_value
            state_predictions["predictions"][incident] = probability_occurrence
        state_predictions["predictions"]["Avg"] = round(avg_pred_total / len(common_incidents), 2)
        predictions.append(state_predictions)
    # Convert predictions to JSON format
    import json
    output_json = json.dumps(predictions, indent=2)
    return output_json