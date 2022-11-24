import React from "react";
import styled from "styled-components";

export const TaskCard = styled.div`
  padding: 2.4em 3.6em;
  background: ${({ color }) => color};
  display: flex;
  flex-direction: column;
  font-weight: 400;
  text-align: center;
  margin: 12px;
  border-radius: 8px;
`;

export const TaskTray = styled.div`
  position: absolute;
  color: white;
  right: 0;
  margin: 12px;
  height: 320px;
  width: 320px;
`;

export const Tasks = () => {
  return (
    <TaskTray>
      <TaskCard color={"#0000ff"} />
    </TaskTray>
  );
};
