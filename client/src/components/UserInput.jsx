import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { Paper } from '@mui/material';
import '../App.css'

const UserInput = ({view, setView, fetchData, isLoading}) => {

    const [input, setInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUserInput = (event) => {
        // clear error if present
        if (errorMessage)
            setErrorMessage("")
        setInput(event.target.value);
    }

    const handleView = (event) => {
        setView(event.target.value);
    }

    const handleBtn = () => {
        //update the year
        if (!(/^\d{4}$/.test(input))) {
            // thrown an input error
            setErrorMessage("Error: Not a valid Year!")
            return;
        }

        if (input < new Date().getFullYear() || input > 2500) {
            // year out of bounds
            setErrorMessage("Error: Year is out of bounds!")
            return;
        }

        // year is valid, make the API call and clean the input
        setInput("");
        fetchData(input);
    }

    return (
        <Paper className="user-input">
            <div className="nav-left">
            <div className="year-input">
                <TextField 
                size='small'
                label={`Enter Year`}
                value={input}
                error={errorMessage.length > 0}
                onChange={handleUserInput}
                helperText={errorMessage ? errorMessage : `Please Enter a Year between ${new Date().getFullYear()} And 2500`} />
                <Button disabled={isLoading} variant="contained" onClick={handleBtn}>Predict</Button>
            </div>
        
            <FormControl className='mui-input' size='small'>
                <InputLabel id="demo-simple-select-label">View</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={view}
                label="View"
                onChange={handleView}
                >
                <MenuItem value={"Avg"}>Avg</MenuItem>
                {/* <MenuItem value={"Biological"}>Biological</MenuItem> */}
                <MenuItem value={"Fire"}>Fire</MenuItem>
                <MenuItem value={"Flood"}>Flood</MenuItem>
                <MenuItem value={"Hurricane"}>Hurricane</MenuItem>
                {/* <MenuItem value={"Severe Ice Storm"}>Severe Ice Storm</MenuItem> */}
                <MenuItem value={"Severe Storm"}>Severe Storm</MenuItem>
                {/* <MenuItem value={"Snowstorm"}>Snowstorm</MenuItem> */}
                <MenuItem value={"Tornado"}>Tornado</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div className='nav-right'>
                <Button href="#section-map">Map</Button>
                <Button href="#section-bar">Bar</Button>
                <Button href="#state_table">Table</Button>
            </div>
      </Paper>
    )
}

export default UserInput;