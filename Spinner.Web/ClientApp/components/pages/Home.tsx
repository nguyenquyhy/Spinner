import * as React from "react";
import { RouteComponentProps } from "react-router";

interface State {
    roomNumber: string;
}

type Props = RouteComponentProps<any>;

export default class Home extends React.PureComponent<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            roomNumber: ''
        };
    }

    onJoin() {
        if (!!this.state.roomNumber) {
            this.props.history.push(`/rooms/${this.state.roomNumber}`);
        }
    }

    public render() {
        return <React.Fragment>
            <h2>Spin Spin Spin</h2>

            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={e => { this.onJoin(); e.preventDefault(); }}>
                        <div className="input-group">
                            <input className="form-control" placeholder="enter room number to join" required value={this.state.roomNumber} onChange={e => this.setState({ roomNumber: e.target.value })} />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="submit">Join</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>;
    }
}