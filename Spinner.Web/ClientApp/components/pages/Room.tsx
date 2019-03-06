import * as React from "react";
import { RouteComponentProps } from "react-router";
import * as SignalR from '@aspnet/signalr';
import styled from 'styled-components';
import Wheel from "../controls/Wheel";
import Connecting from "../controls/Connecting";

interface State {
    connected: boolean;

    logs: string[];
    options: string[];
    newOption: string;

    spinDuration: number | null;
    spinAngle: number | null;

    stableAngle: number;
}

interface RouteProps {
    id: string;
}

type Props = RouteComponentProps<RouteProps>;

export default class Room extends React.PureComponent<Props, State> {
    maxOptions = 10;

    connection: SignalR.HubConnection | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            connected: false,

            logs: [],

            options: [],
            newOption: '',

            spinDuration: null,
            spinAngle: null,
            stableAngle: 0
        };
    }

    log(message: string) {
        console.log(message);
        //this.setState({ logs: [...this.state.logs, message] });
    }

    componentDidMount() {
        this.connection = new SignalR.HubConnectionBuilder().withUrl('/Hubs/Room').build();

        if (this.connection) {
            this.connection.on("Join", (connectionId: string) => {
                this.log(`${connectionId} joined the room!`);

                if (this.state.options.length > 0) {
                    this.connection.send("SyncTo", connectionId, this.state.options, this.state.stableAngle);
                }
            });

            this.connection.on("Sync", (options: string[], stableAngle: number) => {
                this.log(`Received new option list.`);

                this.setState({
                    options: options,
                    stableAngle: stableAngle
                });
            });

            this.connection.on("Spin", (degree: number, seconds: number) => {
                this.log(`Received spin action.`);
                this.spin(degree, seconds);
            });

            this.connection.onclose(error => {
                this.log('Closed: ' + error);
                this.setState({
                    connected: false
                });
                setTimeout(() => {
                    this.start();
                }, 5000);
            });

            this.start();
        }
    }

    start() {
        this.log('Connecting...');
        this.connection.start()
            .then(() => {
                this.log('Connected.');

                this.connection.send('Join', this.props.match.params.id);
                this.log(`Joining room ${this.props.match.params.id}...`);

                this.setState({
                    connected: true
                });
            })
            .catch((reason) => {
                this.log(`Cannot connect! Error: ${reason}.`);
                setTimeout(() => {
                    this.start();
                }, 5000);
            });
    }

    onAddOption() {
        if (this.state.options.length < this.maxOptions) {
            var options = [
                ...this.state.options,
                this.state.newOption
            ];
            this.setState({
                newOption: '',
                options: options
            });

            this.connection.send("Sync", this.props.match.params.id, options, this.state.stableAngle);
        }
    }

    onDeleteOption(index: number) {
        var options = this.state.options.filter((value, i) => i != index);
        this.setState({
            options: options
        });

        this.connection.send("Sync", this.props.match.params.id, options);
    }

    onSpin() {
        if (!this.state.spinAngle && !this.state.spinDuration) {
            var seconds = 4;
            var degree = Math.random() * 2 * 360 + 360 * 3;

            this.connection.send("Spin", this.props.match.params.id, degree, seconds);

            this.spin(degree, seconds);
        }
    }

    spin(degree: number, seconds: number) {
        this.setState({
            spinAngle: degree,
            spinDuration: seconds
        });
        setTimeout(() => {
            this.setState({
                spinAngle: null,
                spinDuration: null,
                stableAngle: (this.state.stableAngle + this.state.spinAngle) % 360
            });
        }, seconds * 1000 + 500);
    }

    public render() {
        return <React.Fragment>
            <h2>Room {this.props.match.params.id}</h2>

            {!this.state.connected ?
                <Connecting /> :
                <StyledLayout>
                    <div>
                        <Wheel options={this.state.options}
                            angle={this.state.stableAngle}
                            spinAngle={this.state.spinAngle}
                            spinDuration={this.state.spinDuration}
                            size={380}/>
                        <StyledSpin className="btn btn-warning" onClick={() => this.onSpin()}
                            style={{ visibility: this.state.options.length >= 2 && !this.state.spinDuration && !this.state.spinAngle ? '' : 'hidden' }}
                        >Spin</StyledSpin>
                    </div>

                    <div>
                        {false && <StyledLogs readOnly={true} value={this.state.logs.join('\n')} />}

                        <h4>Options</h4>
                        <StyledOptions>
                            {this.state.options.map((option, index) => (
                                <React.Fragment key={index}>
                                    <StyledOption>{option}</StyledOption>
                                    <button className="btn btn-danger" onClick={() => this.onDeleteOption(index)}>Delete</button>
                                </React.Fragment>
                            ))}
                            {this.state.options.length < this.maxOptions && <StyledForm onSubmit={e => { this.onAddOption(); e.preventDefault(); }}>
                                <div className="input-group">
                                    <input className="form-control" placeholder="enter new option" value={this.state.newOption} onChange={e => this.setState({ newOption: e.target.value })} required />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="submit">Add</button>
                                    </div>
                                </div>
                            </StyledForm>}
                        </StyledOptions>
                    </div>
                </StyledLayout>
            }

        </React.Fragment>;
    }
}

const StyledLayout = styled.div`
@media(min-width: 768px) {
  display: grid;
  grid-template-columns: 1fr auto;
}
`;

const StyledOptions = styled.div`
max-width: 600px;
width: 100%;
display: grid;
grid-template-columns: 1fr auto;
grid-gap: 5px;
`;

const StyledOption = styled.div`
border-top: 1px lightgray solid;
border-bottom: 1px lightgray solid;
border-left: 1px lightgray solid;
margin-right: -8px;
padding: 4px 10px;
`;

const StyledForm = styled.form`
grid-column: span 2;
`;

const StyledSpin = styled.button`
margin: 0 auto;
display: block;
font-size: 1.5em;
font-weight: bold;
`;

const StyledLogs = styled.textarea`
position: absolute;
bottom: 60px;
right: 0;
border: gray;
height: 200px;
width: 300px;
`;