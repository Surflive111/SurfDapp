import { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";

function Root() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;
    console.log("get marketPrice finished")

    const app = () => (
        <HashRouter>
            <App />
        </HashRouter>
    );

    return  app();
}

export default Root;
