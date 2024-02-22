# USA Natural Disaster Predictor

This project is a web application that predicts the likelihood of natural disasters occurring in the USA based on historical FEMA data. It provides visualizations of predicted disasters on a map, in a bar chart, and in a table format.

## Live Application

View the application here: <https://natural-disaster-predict.netlify.app/>

To view the Machine Model used for this application in a user-friendly format, please visit this Google Colab [link](https://colab.research.google.com/drive/1dMI1Kx4XB4f-c2IDyM3Zr10Z5nTHDEZT?usp=sharing)

## Features

- Predicts the likelihood of natural disasters by state for a given year.
- Machine Learning used to train a model and make predictions
- Visualizes predictions on a map using D3.js.
- Displays predictions in a bar chart and a table.
- Allows users to input a year and select the type of visualization.

## Technologies Used

- React
- Python/Flask
- D3.js
- Material-UI

## Local Installation

The easiest way to start using the application is to use the live production link above in [live-application](#live-application). If however, you want to run this locally, please follow the instructions below.

**The following instructions are emphasized for Windows OS users.*

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Leopoldov95/natural-disaster-predictor.git`
2. Install the latest version of [NodeJS](https://nodejs.org/en/download)
3. Install [Python](https://www.python.org/downloads/) if not yet present on your machine. You will need at least version 3.x.x
4. Open a terminal on the project folder.
5. Install the client side dependencies: `cd natural-disaster-predictor/client && npm install`
6. Ensure the Python application has packages imported: `cd natural-disaster-predictor/server` and run `pip install -r requirements.txt`
7. Start the Python Flask server (via the terminal, make sure you are inside `/server`): `python main.py`
8. Start the React app (Make sure you are inside `/client`): `npm run dev`
9. On the Python Flask app, there will be a URL provided in the console (e.g. `http://127.0.0.1:5000`)
10. On the React application, go to `src/App.jsx` and change the value of the URL to the one provided from the Python console with the predetermined route (e.g. `const URL = "http://127.0.0.1:5000?year=";`)

## Usage

1. Enter a year in the input field to see predictions for that year.
2. Select a visualization type (map, bar chart, or table) to view the predictions.
3. The map will display the predicted disasters by state, the bar chart will show the predictions for each disaster type, and the table will list the predictions for each state.

## Data Source

The dataset used for this project is the US Natural Disaster Declarations dataset, provided via [Kaggle](https://www.kaggle.com/datasets/headsortails/us-natural-disaster-declarations).

## Disclaimer

This project is for educational purposes only. The predictions made by this application are based on historical data and should not be used for making real-world decisions.
