import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, useRouteMatch, useLocation } from "react-router-dom";
import { Grid, Zoom } from "@material-ui/core";
import styled, { keyframes } from 'styled-components'
import { IAppSlice } from "../../store/slices/app-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { ExpandableSectionButton } from "../../components/ExpandableSectionButton";
import ActionCotainer from "./ActionCotainer";
import DetailsSection from './DetailsSection';
import StakingCardHeader from "./StakingCardHeader";
import "./lpstaking.scss";
import { CardHeader } from "@pancakeswap/uikit";


const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

function Lpstaking() {
    const [showExpandableSection, setShowExpandableSection] = useState(false);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const totalLP = app.TotalLP;

    return (
        <div className="lpstaking-card-wrapper">
            <Zoom  in={true}>
                <div className="lpstaking-card-content">
                    <StakingCardHeader/>
                    <ActionCotainer/>
                    <div className="divider"></div>
                    <ExpandableSectionButton
                        onClick={() => setShowExpandableSection(!showExpandableSection)}
                        expanded={showExpandableSection}
                    />
                    <ExpandingWrapper expanded={showExpandableSection}>
                        <DetailsSection
                            bscScanAddress={"https://bscscan.com/address/0x6Cbd8ECaF789324233039FDB8711a29f3f8d0a61"}
                            totalValueFormatted={totalLP}
                            addLiquidityUrl={"https://pancakeswap.finance/add/BNB/0x6Cbd8ECaF789324233039FDB8711a29f3f8d0a61"}
                        />
                    </ExpandingWrapper>
                </div>
            </Zoom>
        </div>
    );
}

export default Lpstaking;
