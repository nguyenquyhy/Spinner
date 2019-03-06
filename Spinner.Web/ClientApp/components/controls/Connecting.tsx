import * as React from "react";
import styled from "styled-components";

export default () => (
    <StyledWrapper>
        <StyledConnecting></StyledConnecting>
        Connecting...
    </StyledWrapper>
);

const StyledConnecting = styled.div`
border: 16px solid #f3f3f3; /* Light grey */
border-top: 16px solid #3498db; /* Blue */
border-radius: 50%;
width: 120px;
height: 120px;
margin: 20px 0;
animation: spinConnecting 2s linear infinite;
@keyframes spinConnecting {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const StyledWrapper = styled.div`
text-align: center;
margin: 0 auto;
width: 120px;
color: gray;
`;