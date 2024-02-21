import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StateTable = ({data}) => {

  return (
    <TableContainer id='state_table' component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow className='header_row'>
            <TableCell className='state_row'>State</TableCell>
            {Object.keys(data[0].predictions).map((predictionType) => (
            <TableCell key={predictionType} align='right'>{predictionType}</TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((stateData) => (
            <TableRow
            key={stateData.state}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell className='state_row'>{stateData.state_full}</TableCell>
            {Object.keys(stateData.predictions).map((predictionType) => (
                <TableCell align='right' key={predictionType}>{stateData.predictions[predictionType]}%</TableCell>
              ))}
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StateTable;