import * as React from "react";
import { Link } from "react-router-dom";
import Room from "./Room";

export default class Home extends React.PureComponent {
    public render() {
        return <div>
            <h2>Home Page</h2>
            <Link to='/rooms/123'>Room 123</Link>
        </div>;
    }
}