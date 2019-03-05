import * as React from "react";
import { RouteComponentProps } from "react-router";
import * as SignalR from '@aspnet/signalr';
import styled from 'styled-components';

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
        var seconds = 4;
        var degree = Math.random() * 2 * 360 + 360 * 3;

        this.connection.send("Spin", this.props.match.params.id, degree, seconds);

        this.spin(degree, seconds);
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

            {!this.state.connected ? <div>Connecting...</div> :
                <StyledLayout>
                    <div>
                        <StyledPieWrapper>
                            <StyledPie spinDuration={this.state.spinDuration} spinAngle={this.state.spinAngle} angle={this.state.stableAngle}>
                                {this.state.options.map((option, index) => (
                                    <StyledSlice key={index} angle={index * 360 / this.state.options.length}>
                                        <StyledSliceInner angle={360 / this.state.options.length} color={colors[index % colors.length]} />
                                        <StyledSliceText>{option}</StyledSliceText>
                                    </StyledSlice>
                                ))}
                            </StyledPie>
                            <StyledArrow />
                        </StyledPieWrapper>
                        {!this.state.spinDuration && !this.state.spinAngle &&
                            <StyledSpin className="btn btn-warning" onClick={() => this.onSpin()}>Spin</StyledSpin>}
                    </div>

                    <div>
                        {false && <StyledLogs readOnly={true} value={this.state.logs.join('\n')} />}

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

const colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50'
]

const StyledLayout = styled.div`
display: grid;
grid-template-columns: 1fr auto;
`;

const StyledOptions = styled.div`
max-width: 400px;
width: 100%;
display: grid;
grid-template-columns: 1fr auto;
grid-gap: 5px;
`;

const StyledOption = styled.div`
`;

const StyledForm = styled.form`
grid-column: span 2;
`;

const StyledPieWrapper = styled.div`
position: relative;
margin: 0 auto 20px auto;
padding-top: 20px;
height: 420px;
width: 400px;
overflow: hidden;
`;

const StyledArrow = styled.div`
width: 0; 
height: 0; 
border-left: 20px solid transparent;
border-right: 20px solid transparent;
border-top: 20px solid #F1C40F;
margin: 0 auto;
position: absolute;
top: 10px;
left: 180px;
`;

const StyledPie = styled.div`
position: relative;
height: 400px;
width: 400px;
transform: rotate(${props => props.angle}deg);

${props => props.spinDuration && props.spinAngle && `
@keyframes spin {
  100% { transform: rotate(${props.spinAngle + props.angle}deg); }
}

animation: spin ${props.spinDuration}s ease both;
`}

`;

const StyledSlice = styled.div`
position: absolute;
top: 0;
left: 0;
height: 400px;
width: 400px;
border-radius: 200px;
clip: rect(0, 400px, 400px, 200px);
transform: rotate(${props => props.angle}deg);
overflow: hidden;
`;

const StyledSliceInner = styled.div`
position: absolute;
top: 0;
left: 0;
height: 400px;
width: 400px;
border-radius: 200px;
background-color: ${props => props.color};
clip: rect(0px, 200px, 400px, 0px);
transform: rotate(${props => props.angle}deg);
`;

const StyledSliceText = styled.div`
transform: translate(20px, -40px) rotate(90deg);
text-align: right;
font-weight: bold;
font-size: 1.1em;
color: white;s
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