import { useState, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Paper } from "@mui/material";
import "../App.css";

export type PredictionKey =
  | "Avg"
  | "Fire"
  | "Flood"
  | "Hurricane"
  | "Severe Storm"
  | "Tornado";

interface UserInputProps {
  view: PredictionKey;
  setView: (value: PredictionKey) => void;
  fetchData: (year: number) => void;
  isLoading: boolean;
}

const UserInput = ({ view, setView, fetchData, isLoading }: UserInputProps) => {
  const [input, setInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUserInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    setInput(event.target.value);
  };

  const handleView = (event: SelectChangeEvent<string>) => {
    setView(event.target.value as PredictionKey);
  };

  const handleBtn = () => {
    const yearValue = Number(input);

    if (!/^[0-9]{4}$/.test(input) || Number.isNaN(yearValue)) {
      setErrorMessage("Error: Not a valid year!");
      return;
    }

    if (yearValue < new Date().getFullYear() || yearValue > 2500) {
      setErrorMessage("Error: Year is out of bounds!");
      return;
    }

    setInput("");
    fetchData(yearValue);
  };

  return (
    <Paper className="user-input">
      <div className="nav-left">
        <div className="year-input">
          <TextField
            size="small"
            label="Enter Year"
            value={input}
            error={Boolean(errorMessage)}
            onChange={handleUserInput}
            helperText={
              errorMessage ||
              `Please Enter a Year between ${new Date().getFullYear()} And 2500`
            }
          />
          <Button disabled={isLoading} variant="contained" onClick={handleBtn}>
            Predict
          </Button>
        </div>

        <FormControl className="mui-input" size="small">
          <InputLabel id="view-select-label">View</InputLabel>
          <Select
            labelId="view-select-label"
            id="view-select"
            value={view}
            label="View"
            onChange={handleView}
          >
            <MenuItem value="Avg">Avg</MenuItem>
            <MenuItem value="Fire">Fire</MenuItem>
            <MenuItem value="Flood">Flood</MenuItem>
            <MenuItem value="Hurricane">Hurricane</MenuItem>
            <MenuItem value="Severe Storm">Severe Storm</MenuItem>
            <MenuItem value="Tornado">Tornado</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="nav-right">
        <Button href="#section-map">Map</Button>
        <Button href="#section-bar">Bar</Button>
        <Button href="#state_table">Table</Button>
      </div>
    </Paper>
  );
};

export default UserInput;
