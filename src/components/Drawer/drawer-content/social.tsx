import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Medium } from "../../../assets/icons/medium.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";


export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://t.me/surftoken1" target="_blank">
                <SvgIcon htmlColor="#ffffff" component={Telegram} />
            </Link>

            <Link href="https://twitter.com/token_surf?t=Oa0I3HHiba7LM7GnAlxdNQ&s=09" target="_blank">
                <SvgIcon htmlColor="#ffffff" component={Twitter} />
            </Link>

            <Link href="https://Surf.medium.com/" target="_blank">
                <SvgIcon htmlColor="#ffffff" component={Medium} />
            </Link>

            <Link href="" target="_blank">
                <SvgIcon htmlColor="#ffffff" component={Discord} />
            </Link>
        </div>
    );
}
