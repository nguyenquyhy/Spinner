import * as React from "react";
import { Link } from "react-router-dom";

export default props => (
    <React.Fragment>
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link className="navbar-brand" to="/">Spinner</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/Privacy">Privacy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <div className="container">
            <main role="main" className="pb-3">
                {props.children}
            </main>
        </div>

        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2019 - Spinner - <Link to="/Privacy">Privacy</Link>
            </div>
        </footer>
    </React.Fragment>
);