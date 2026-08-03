import "./Home.css"
import TradePanel from "../../components/TradePanel/TradePanel.tsx";
import Header from "../../components/Header/Header.tsx";

function Home() {
    return (
        <div className="home">
            <Header/>
            <TradePanel/>
        </div>
    )
}
    
export default Home