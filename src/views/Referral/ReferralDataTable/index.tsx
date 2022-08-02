import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { Link } from "@material-ui/core";
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import "./ReferralData.scss";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim } from "src/helpers";
import { IAppSlice } from "src/store/slices/app-slice";
import { IReduxState } from "src/store/slices/state.interface";
import { IAccountSlice } from "src/store/slices/account-slice";

const useStyles = makeStyles({
  root: {
    width: '100%',
    minWidth: 500,
  },
  container: {
    maxHeight: 400,
  },

 });


function ReferralDataTable() {
  const classes = useStyles();
  const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
   const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const account = useSelector<IReduxState, IAccountSlice>(state =>state.account);
  const lpPrice = app.LPPrice;
  const surfPrice = app.marketPrice;
  const userRerralDetails = account.userRerralDetails;
   console.log("LP price", lpPrice);
   console.log("SURF price", surfPrice);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="ReferralData">
      <TableContainer  className={classes.container}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell align="center" >Address</TableCell>
                <TableCell align="center" >Staking Amount</TableCell>
                <TableCell align="center" >Referral Reward</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRerralDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userRerralDetails) => (
                <TableRow key={userRerralDetails.referrerAddress}>
                  <TableCell align="center" >
                    <Link href={`https://bscscan.com/address/${userRerralDetails.referrerAddress}`} target="_blank">
                      {isAccountLoading ? <Skeleton width={100} height={30} /> : userRerralDetails.referrerAddress}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {/* {isAccountLoading ? <Skeleton width={100} height={30} /> :userRerralDetails.stakingAmount/Math.pow(10, 18)} */}
                    <div>{isAccountLoading ? <Skeleton width={100} height={30} /> : `$${trim(Number(userRerralDetails.stakingAmount/Math.pow(10, 18)*lpPrice), 2)}`}</div>
                  </TableCell>
                  <TableCell align="center">
                    {/* {isAccountLoading ? <Skeleton width={100} height={30} /> :userRerralDetails.receivedReward/Math.pow(10, 5)} */}
                    <div>{isAccountLoading ? <Skeleton width={100} height={30} /> : `$${trim(Number(userRerralDetails.receivedReward/Math.pow(10, 5)*surfPrice), 2)}`}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 5, 10]}
        component="div"
        count={userRerralDetails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ReferralDataTable;