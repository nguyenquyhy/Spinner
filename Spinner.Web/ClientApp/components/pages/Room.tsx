import * as React from "react";
import { RouteComponentProps } from "react-router";

interface RouteProps {
    id: string;
}

type Props = RouteComponentProps<RouteProps>;

export default class Room extends React.PureComponent<Props> {
    public render() {
        return <div>
            <h2>Room {this.props.match.params.id}</h2>
        </div>;
    }
}