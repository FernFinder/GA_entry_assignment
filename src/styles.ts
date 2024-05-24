import styled from "styled-components";
import { Input, Select } from "antd";

//StyledInput will be cyan for valid searches and salmon for invalid searches
//Font size will also change to make it easier to tell when an invalid search is made
export const StyledInput = styled(Input)<{ $yourProp?: boolean }>`
  background-color: ${({ $yourProp }) => ($yourProp ? "cyan" : "salmon")};
  font-size: ${({ $yourProp }) => ($yourProp ? "16px" : "12px")};
`;

//The selection box gets a unique border color depending on what is currently selected
export const StyledSelect = styled(Select)<{ $selectionColor : string }>`
  min-width: 250px;
  border: 2px solid ${({ $selectionColor }) => $selectionColor};
`;
