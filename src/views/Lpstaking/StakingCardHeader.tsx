import { useSelector, useDispatch } from "react-redux";
import bnbimg from "../../assets/tokens/BNB.png";
import surfimg from "../../assets/tokens/SURF.png";
import { CoreTag } from '../../components/Tags';
import { IAppSlice } from "../../store/slices/app-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { Tag, Flex, Button } from '@pancakeswap/uikit';
import ApyButton from "./ApyButton";
import "./lpstaking.scss";



const StakingCardHeader = ({ }) => {
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const surfPrice = app.marketPrice;
  return (
    <>
      <div className="lpstaking-header">
        <div className= "pair-img">
          <img className="first-token-img" src={bnbimg} alt="cake"/>
          <img className="second-token-img" src={surfimg} alt="surf"/>
        </div>
        <div>
          <div className="header-title1">
              SURF-BNB
          </div>
          <Flex justifyContent="end">
              <CoreTag />
              {/* <Tag variant="success">4X</Tag> */}
          </Flex>                               
        </div>
      </div>
      <div className="lpstaking-apr">
        <div className="lpstaking-apr-title">APR:</div>
        <div style={{display: "flex", alignItems:"center"}}>
          <div className="lpstaking-apr-title" style={{marginRight: "8px"}}>2190%</div>
          <ApyButton
            lpLabel={"GET SURF-BNB LP"}
            lpSymbol={"SURF-BNB LP"}
            addLiquidityUrl={"https://pancakeswap.finance/add/BNB/0x6Cbd8ECaF789324233039FDB8711a29f3f8d0a61"}
            surfPrice={surfPrice}
            apr={2190}
            displayApr={"2190"}
          />
        </div>
      </div>
      <div className="lpstaking-apr">
        <div className="lpstaking-apr-title">EARN:</div>
        <div className="lpstaking-apr-title">SURF + Fee</div>
      </div>
      <div className="lpstaking-apr">
        <div className="lpstaking-apr-title" style={{display:"flex", marginTop:"12px", marginBottom:"12px"}} >
          <div style={{marginRight: "16px"}}>HARVEST</div>
          <div>LOCKUP</div>
        </div>
        <div className="lpstaking-apr-title">24 HOURS</div>
      </div>
    </>
  )

}

export default StakingCardHeader;
