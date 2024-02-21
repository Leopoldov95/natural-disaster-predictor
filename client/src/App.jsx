import { useState } from 'react'
import './App.css'
import axios from 'axios';
import Map from './components/Map';
import UserInput from './components/UserInput';
import BarChart from './components/BarChart';
import CircularProgress from '@mui/material/CircularProgress';
import StateTable from './components/StateTable';
import Fab from '@mui/material/Fab';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Paper } from '@mui/material';


function App() {
  const URL = 'http://127.0.0.1:5000/predict_disasters?year=';
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("Avg")
  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  

  const fetchData = async (inputYear) => {
    try {
      setisLoading(true);
      console.log(`URL string is ${`${URL}${inputYear}`}`);
      const response = await axios.get(`${URL}${inputYear}`);
      setisLoading(false);
      setYear(inputYear);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  const handleClick = () => {
    // Find the element you want to scroll to
    const element = document.getElementById('state_table');
    if (element) {
      // Scroll to the element
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="app">
      <h1>USA Natural Disaster Predictor</h1>

      {/* User Input */}
      <UserInput view={view} setView={setView} setYear={setYear} fetchData={fetchData} isLoading={isLoading}/>

      {/* D3 Map */}
      {
        data ?
        <>
        <Paper className="map">
          <Map data={data} view={view} year={year}/>
        </Paper>
        <Paper>
          <BarChart data={data} view={view} year={year} />
        </Paper>
        <StateTable data={data} />
        </> :
        <div className="user-info">
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            Please Enter Year To Visualize Map.
          </Alert>
        </div>
        
      }

      <Fab disabled={data === null} onClick={handleClick} className='table_btn' color="primary" aria-label="add">
        <KeyboardArrowDownIcon />
      </Fab>

      {isLoading && 
      <div className="loader">
          <CircularProgress />
          <span className='loading-text'>Please Wait, This May Take Awhile</span>
      </div>
      }

    </div>
  )
}

export default App
