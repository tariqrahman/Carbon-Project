import axios from 'axios';
import config from '../../config';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CreateSection from './Sections/CreateSections';
import {
  Grid,
  Typography,
  Box,
  tableCellClasses,
  Button,
  Paper,
  Container,
  TableCell,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  TableHead,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Style table header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#78C6A3',
    color: '#26532b',
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Style Table Rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FDFCDC',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

/**
 * Component Declaration
 **/

function User(props) {
  const { data } = props;

  const getUsers = () => {
    axios.get(config.SERVER_URL + `/api/admin/users`).then((res) => res.data);
  };

  const promoteRequest = (UID) => {
    axios
      .post(config.SERVER_URL + `/api/admin/promote`, UID)
      .then((res) => {
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => alert(err.message));
  };

  const demoteRequest = (UID) => {
    axios
      .post(config.SERVER_URL + `/admin/api/demote`, UID)
      .then((res) => {
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <>
      <TableRow>
        <TableCell>{data.email}</TableCell>
        <TableCell>
          {!data.admin && !data.superAdmin && <>Member</>}
          {data.admin && !data.superAdmin && <>Admin</>}
          {data.superAdmin && data.admin && <>Super Admin</>}
        </TableCell>
        <TableCell>{data.section ? <>{data.section}</> : 'N/A'}</TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => promoteRequest(data['_id'])}
          >
            Promote
          </Button>
        </TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => demoteRequest(data['_id'])}
          >
            Demote
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

// Component Declaration

const AdminUsers = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    function getUser() {
      axios
        .get(config.SERVER_URL + '/api/admin/users/')
        .then((res) => setUsers(res.data.allUsers.reverse()))
        .catch((err) => console.log(err));
    }
    getUser();
  }, []);

  const handleUpdateUser = () => {
    console.log(users);
    setUsers([...users]);
  };

  return (
    <>
      <Grid Container spacing={2}>
        <Container sx={{ p: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        fontFamily: 'Gill Sans',
                      }}
                    >
                      User Name
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>Position</StyledTableCell>
                  <StyledTableCell>Section</StyledTableCell>
                  <StyledTableCell>Promote</StyledTableCell>
                  <StyledTableCell>Demote</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => {
                  return (
                    <User
                      key={index}
                      data={user}
                      handleUpdateUser={handleUpdateUser}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Grid>
    </>
  );
};

export default withRouter(AdminUsers);
