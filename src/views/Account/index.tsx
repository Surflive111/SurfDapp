import { Container,useMediaQuery,Grid } from "@material-ui/core";
import { Box,Paper,Typography,Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./account.scss";
import { useSelector } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "src/store/slices/account-slice";
import { IAppSlice } from "src/store/slices/app-slice";
import { trim } from "../../helpers";
import { useCountdown } from "../../helpers";

const Account = () => {
    const isSmallScreen = useMediaQuery("(max-width: 650px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const account = useSelector<IReduxState,IAccountSlice>(state => state.account);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const rebaseTime = useCountdown();
    return (
        <div id="account-view" className={`account-view ${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
            <Container
                style={{
                paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
                paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
                }}
            >
                <Zoom in>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper  className="account-card">
                                <Box className="data-column">
                                    <Typography >Your Balance</Typography>
                                    <Typography  style={{fontFamily:"Montserrat Medium",color:"#61ce70",fontWeight:"bolder"}}>{isAccountLoading ? <Skeleton  width={50} height={30} /> :`${trim(Number(account.balances.surf) * app.marketPrice,2)}`}</Typography>
                                    <Typography >{isAccountLoading ? <Skeleton width={50} height={30} /> : <>{account.balances.surf} SURF</>}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper  className="account-card">
                                <Box className="data-column">
                                    <Typography>APY</Typography>
                                    <Typography  style={{fontFamily:"Montserrat Medium",color:"#61ce70",fontWeight:"bolder"}}>
                                        {new Intl.NumberFormat().format(Number(`${trim(app.currentApy * 100, 2)}`))}%
                                    </Typography>
                                    <Typography>Daily ROI {trim(app.dailyRate * 100,2)}%</Typography>
                                </Box>
                            </Paper>
                        </Grid >
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper  className="account-card">
                                <Box className="data-column">
                                    <Typography>Next Rebase:</Typography>
                                    <Typography  style={{fontFamily:"Montserrat Medium", color:"#61ce70",fontWeight:"bolder"}}>
                                        {
                                            `00:${rebaseTime[2]}:${rebaseTime[3]}`
                                        }
                                    </Typography>
                                    <Typography>You will earn money soon</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Zoom>
                <Zoom in>
                    <Paper className="account-card">
                        <Box className="data-row" >
                            <Typography >Current SURF Price</Typography>
                            <Typography   className = "data-row-text">{isAppLoading ? <Skeleton width={50} height={30} /> : <>${trim(app.marketPrice,2)}</>}</Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Amount</Typography>
                            <Typography  className = "data-row-text">{isAccountLoading ? <Skeleton width={50} height={30} /> : <>{trim(Number(account.balances.surf) * 0.0001027,5)}SURF</>}</Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Amount USD</Typography>
                            <Typography  className = "data-row-text">{isAccountLoading ? <Skeleton width={50} height={30} /> : <>${trim(Number(account.balances.surf) * 0.0001027 * app.marketPrice,5)} </>}</Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Yield</Typography>
                            <Typography  className = "data-row-text">{isAppLoading ? <Skeleton width={50} height={30} /> : <>{0.01027}%</>}</Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>ROI(1-Day Rate) USD</Typography>
                            <Typography  className="data-row-text">{isAccountLoading ? <Skeleton width={50} height={30} /> : <>${trim(app.oneDayRate * Number(account.balances.surf) * app.marketPrice,4)}</>}</Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>ROI(5-Day Rate)</Typography>
                            <Typography  className = "data-row-text">{isAppLoading ? <Skeleton width={50} height={30} /> : <>{trim(app.fiveDayRate * 100,2)}%</>}</Typography>
                        </Box>                        
                        <Box className="data-row">
                            <Typography>ROI(5-Day Rate) USD</Typography>
                            <Typography  className="data-row-text">{isAccountLoading ? <Skeleton width={50} height={30} /> : <>${trim(app.fiveDayRate * Number(account.balances.surf) * app.marketPrice,4)}</>}</Typography>
                        </Box>
                    </Paper>
                </Zoom>
            </Container>
        </div>
    )
}

export default Account;