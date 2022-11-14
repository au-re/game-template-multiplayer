import styled from "styled-components";

export const Button = styled.button`
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  vertical-align: middle;
  text-decoration: none;
  width: 100%;

  font-family: "Rubik", sans-serif;

  min-height: 70px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1.2em 1.8em;
  background: #000000;
  color: #ffffff;
  transform-style: preserve-3d;

  &:disabled {
    background: #323232;
    color: #e2e2e2;
  }
`;
