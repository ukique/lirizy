import "./Header.css"

function Header(){
    return (
        <header className="app-header">
            <div className="logo">
                <img src={"../logo.png"} alt="lirizy-logo" width="50"/>
                Lirizy
            </div>
        </header>
    )
}

export default Header