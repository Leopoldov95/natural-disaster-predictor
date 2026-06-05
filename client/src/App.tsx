import { useState, useEffect } from "react";
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import Map from "./components/Map";
import UserInput from "./components/UserInput";
import BarChart from "./components/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import StateTable from "./components/StateTable";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Paper } from "@mui/material";

type PredictionKey =
  | "Avg"
  | "Fire"
  | "Flood"
  | "Hurricane"
  | "Severe Storm"
  | "Tornado";

type PredictionRecord = Record<string, number>;

type DisasterData = {
  state: string;
  state_full: string;
  predictions: PredictionRecord;
};

const URL = "https://natural-disaster-predictor.onrender.com/";

const App = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [view, setView] = useState<PredictionKey>("Avg");
  const queryClient = useQueryClient();

  async function warmupServer() {
    try {
      await fetch(`${URL}/health`);
    } catch {
      console.error("ERROR: Issue with request");
    }
  }

  useEffect(() => {
    warmupServer();
  }, []);

  const fetchPredictions = async ({
    queryKey,
  }: QueryFunctionContext<["predictions", number]>) => {
    const [, queryYear] = queryKey;
    const response = await axios.get<DisasterData[]>(
      `${URL}predict_disasters`,
      {
        params: { year: queryYear },
      },
    );
    return response.data;
  };

  const { data, error, isLoading } = useQuery<
    DisasterData[],
    Error,
    DisasterData[],
    ["predictions", number]
  >({
    queryKey: ["predictions", year],
    queryFn: fetchPredictions,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const fetchData = async (inputYear: number) => {
    setYear(inputYear);
    await queryClient.fetchQuery<
      DisasterData[],
      Error,
      DisasterData[],
      ["predictions", number]
    >({
      queryKey: ["predictions", inputYear],
      queryFn: fetchPredictions,
    });
  };

  return (
    <div id="app">
      <h1>USA Natural Disaster Predictor</h1>

      <UserInput
        view={view}
        setView={setView}
        fetchData={fetchData}
        isLoading={isLoading}
      />

      {error && (
        <div className="error-view">
          <Alert severity="error" className="error_message">
            <AlertTitle>Error</AlertTitle>
            <p>Unfortunately, the server has reached its usage limits.</p>
            <p>
              You can find the source code
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/Leopoldov95/natural-disaster-predictor"
              >
                &nbsp;here&nbsp;
              </a>
              and run the project locally.
            </p>
          </Alert>
        </div>
      )}

      {data ? (
        <>
          <Paper id="section-map" className="map">
            <Map data={data} view={view} year={year} />
          </Paper>
          <Paper id="section-bar">
            <BarChart data={data} view={view} year={year} />
          </Paper>
          <StateTable data={data} />
        </>
      ) : (
        <div className={`user-info ${error ? "hidden" : ""}`}>
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            Please Enter Year To Visualize Map.
          </Alert>
        </div>
      )}

      {isLoading && (
        <div className="loader">
          <CircularProgress />
          <div className="loading-text">
            <span>
              This app runs on a free server that spins down when idle.
            </span>
            <span>First load may take up to 50 seconds.</span>
            <span>Thanks for your patience!</span>
          </div>
        </div>
      )}

      <div id="disclaimer" className={data ? "show_bottom" : "show_top"}>
        <Alert className="disclaimer_box" severity="info">
          US Natural Disaster Declarations dataset provided via&nbsp;
          <a href="https://www.kaggle.com/datasets/headsortails/us-natural-disaster-declarations">
            Kaggle
          </a>
          .
        </Alert>
      </div>
    </div>
  );
};

export default App;
