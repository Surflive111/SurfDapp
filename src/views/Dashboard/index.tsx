import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { useCountdown } from "../../helpers"

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const rebaseTime = useCountdown();
    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <div>
                        <div style={{backgroundColor:"rgb(9 22 12)", border:"1px solid rgb(98 116 94)", borderRadius:"10px"}}>
                                <Grid container>                        
                                    <Grid item lg={4} md={4} sm={6} xs={12}> 
                                        <div className="dashboard-card">                      
                                            <p className="card-title">SURF Price</p>
                                            <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p>  
                                        </div>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <div className="dashboard-card">                              
                                            <p className="card-title">Market Cap</p>
                                            <p className="card-value">
                                                {isAppLoading ? (
                                                    <Skeleton width="160px" />
                                                ) : (
                                                    new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0,
                                                    }).format(app.marketCap)
                                                )}                                                
                                            </p>
                                        </div>                           
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <div className="dashboard-card">                            
                                            <p className="card-title">Circulating Supply</p>
                                            <p className="card-value">
                                                { 
                                                    isAppLoading ? <Skeleton width="250px" /> :
                                                    new Intl.NumberFormat().format(Number(`${trim(app.circSupply, 2)}`))
                                                    
                                                }
                                            </p>                       
                                        </div>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}> 
                                        <div className="dashboard-card">                             
                                            <p className="card-title">Backed Liquidity</p>
                                            <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `${app.backedLiquidity}`} </p>                          
                                        </div>            
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}> 
                                        <div className="dashboard-card">                             
                                            <p className="card-title">Next Rebase</p>
                                            <p className="card-value">
                                                {
                                                    `00:${rebaseTime[2]}:${rebaseTime[3]}`
                                                }
                                            </p>                          
                                        </div>            
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <div className="dashboard-card">                            
                                            <p className="card-title">Total Supply</p>
                                            <p className="card-value">
                                                { 
                                                    isAppLoading ? <Skeleton width="250px" /> :
                                                    new Intl.NumberFormat().format(Number(`${trim(app.totalSupply, 2)}`))
                                                    
                                                }
                                            </p>                       
                                        </div>
                                    </Grid>
                                </Grid>             
                
                        </div>
                        <div>
                  
                            <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div className="dashboard-individual-card">                      
                                        <p className="card-title">SURF Price</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p>  
                                    </div>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div className="dashboard-individual-card">                             
                                        <p className="card-title">Market Value of Treasury Asset</p>
                                        <p className="card-value">
                                            {isAppLoading ? (
                                                <Skeleton width="250px" />
                                            ) : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                                }).format(app.treasuryValue)
                                            )}
                                        </p>    
                                    </div>      
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div className="dashboard-individual-card">                         
                                        <p className="card-title">Pool Value</p>
                                        <p className="card-value">
                                            {isAppLoading ? (
                                                <Skeleton width="250px" />
                                            ) : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                                }).format(app.bnbLiquidityValue)
                                            )}
                                        </p>                           
                                    </div>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div className="dashboard-individual-card">
                                        <p className="card-title">SURF Insurance Fund Value</p>
                                        <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                                }).format(app.sifValue)
                                            )}
                                        </p>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="dashboard-individual-card">
                                        <p className="card-title"># Value of FirePit</p>
                                        <p className="card-value">
                                            {     
                                                new Intl.NumberFormat().format(Number(`${trim(app.firepitBalance, 2)}`)) + " SURF"
                                            }                                   
                                        </p>     
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="dashboard-individual-card">
                                        <p className="card-title">$ Value of FirePit</p>
                                        <p className="card-value">                                                                                
                                            {isAppLoading ? <Skeleton width="250px" /> : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                                }).format(app.firepitBalance * app.marketPrice)
                                            )}                                                                                        
                                        </p>     
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="dashboard-individual-card">
                                        <p className="card-title">% FirePit : Supply </p>
                                        <p className="card-value">                                                                                
                                            {trim(app.firepitBalance / app.totalSupply * 100,2)}%                                                                                
                                        </p>     
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
