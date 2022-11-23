import React from "react";
import styled from "styled-components";
import { gameTitle } from "../../constants";

export const GameTitle = styled.h1`
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  font-family: "Rubik", sans-serif;
`;

export const Label = styled.label`
  font-size: 12px;
  display: flex;
  font-weight: 600;
`;

export const Spacer = styled.div`
  height: 2rem;
`;

export const Menu = styled.div`
  padding: 2.4em 3.6em;
  position: absolute;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  font-weight: 400;
  text-align: center;
  width: 450px;
  top: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  bottom: 0;
  height: 480px;
  margin-top: auto;
  margin-bottom: auto;
`;
