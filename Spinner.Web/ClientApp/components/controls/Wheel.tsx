import * as React from "react";
import styled, { keyframes, css } from "styled-components";

interface Props {
    options: string[];

    angle: number;

    spinDuration: number | null;
    spinAngle: number | null;

    size?: number;
}

export default class Wheel extends React.Component<Props> {
    defaultSize = 400;

    public render() {
        var size = this.props.size || this.defaultSize;

        if (this.props.options.length < 2) {
            return <StyledEmptyPie size={size}>
                <div>Enter at least 2 options to activate the spinning wheel</div>
            </StyledEmptyPie>
        }

        return <StyledPieWrapper size={size}>
            <StyledPie spinDuration={this.props.spinDuration} spinAngle={this.props.spinAngle} angle={this.props.angle} size={size}>
                {this.props.options.map((option, index) => (
                    <StyledSlice key={index} angle={index * 360 / this.props.options.length} size={size}>
                        <StyledSliceInner angle={360 / this.props.options.length} color={colors[index % colors.length]} size={size} />
                        <StyledSliceText>{option}</StyledSliceText>
                    </StyledSlice>
                ))}
            </StyledPie>
            <StyledArrow size={size} />
        </StyledPieWrapper>;
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

const StyledEmptyPie = styled.div`
position: relative;
height: ${props => props.size}px;
width: ${props => props.size}px;
border-radius: 50%;
background-color: lightgray;
margin: 20px auto;

& div {
font-weight: bold;
text-align: center;
font-size: 1.5em;
display: block;
padding: ${props => props.size / 2 - 50}px 10px 0 10px;
}
`;

const StyledPieWrapper = styled.div`
position: relative;
margin: 0 auto 20px auto;
padding-top: 20px;
height: ${props => props.size + 20}px;
width: ${props => props.size}px;
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
left: ${props => props.size / 2 - 20}px;
`;

const AnimationSpin = props => keyframes`
100% { transform: rotate(${props.spinAngle + props.angle}deg); }
`;

const StyledPie = styled.div`
position: relative;
height: ${props => props.size}px;
width: ${props => props.size}px;
transform: rotate(${props => props.angle}deg);

${props => props.spinDuration && props.spinAngle && css`
animation: ${AnimationSpin} ${props.spinDuration}s ease both;
`}
`;

const StyledSlice = styled.div`
position: absolute;
top: 0;
left: 0;
height: ${props => props.size}px;
width: ${props => props.size}px;
border-radius: 50%;
clip: rect(0, ${props => props.size}px, ${props => props.size}px, ${props => props.size / 2}px);
transform: rotate(${props => props.angle}deg);
overflow: hidden;
`;

const StyledSliceInner = styled.div`
position: absolute;
top: 0;
left: 0;
height: ${props => props.size}px;
width: ${props => props.size}px;
border-radius: 50%;
background-color: ${props => props.color};
clip: rect(0px, ${props => props.size / 2}px, ${props => props.size}px, 0px);
transform: rotate(${props => props.angle}deg);
`;

const StyledSliceText = styled.div`
transform: translate(20px, -40px) rotate(90deg);
text-align: right;
font-weight: bold;
font-size: 1.1em;
color: white;s
`;