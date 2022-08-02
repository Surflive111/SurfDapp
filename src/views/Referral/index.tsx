import { useSelector } from "react-redux";
import { trim } from "../../helpers";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { IAccountSlice } from "../../store/slices/account-slice";
import { Grid, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import GetReferralLinkButton from "./getReferralLink-button";
import ReferralDataTable from "./ReferralDataTable";
import "./referral.scss";



function Referral() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);

    return (
        <div className="referral-view">
            <Zoom  in={true}>
                <div className="referral-card">
                    <Grid className="referral-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <div className="referral-card-header">    
                                        <p className="referral-card-header-title">Referral</p>
                                        <p className="referral-card-header-subtitle">Invite your friends to Hyper Wave.</p>
                                        <p className="referral-card-header-subtitle">Earn 10% rewards of your referrals whenever they harvest.</p>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>                
                            <div className="referral-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-apy">
                                            <p className="referral-card-metrics-title">Total Referrers</p>
                                            <p className="referral-card-metrics-value">{isAppLoading ? <Skeleton width={50} height={30} /> : `${trim(app.referrerNum, 2)}` }</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-tvl">
                                            <p className="referral-card-metrics-title">Total Referral Rewards</p>
                                            <p className="referral-card-metrics-value">{isAppLoading ? <Skeleton width={50} height={30} /> : `${trim(app.referrerRewards, 2)}`} SURF </p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item>                
                            <div className="referral-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-apy">
                                            <p className="referral-card-metrics-title">Your Referrers</p>
                                                <p className="referral-card-metrics-value">{isAccountLoading ? <Skeleton width={50} height={30} /> : trim(account.referrerNum, 2)}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="referral-card-tvl">
                                            <p className="referral-card-metrics-title">Your Referral Rewards</p>
                                            <p className="referral-card-metrics-value">{isAccountLoading ? <Skeleton width={50} height={30} /> : trim(account.referrerRewards, 2)} SURF</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item style={{width: '100%'}} >
                            <ReferralDataTable/>
                        </Grid>
                        <Grid item>
                            <GetReferralLinkButton/>
                        </Grid>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Referral;
