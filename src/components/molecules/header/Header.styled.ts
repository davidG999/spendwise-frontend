import styled from "styled-components";
import { DIVIDER } from "../../../shared/styles/variables";
import { Box } from './../../atoms/box/Box.styled';
import { Typography } from './../../atoms/typography/Typography.styled';
import { List } from "../../atoms/list/List.styled";

export const HeaderWrapper = styled.nav`
  display: flex;
  align-items: center;
  padding: 12px 50px;
  border-bottom: 2px solid ${DIVIDER};
  margin-bottom: 20px;
  
  ${Box} {
    > a {
      display: flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
  
      ${Typography} {
        user-select: none;
        font-weight: 800;
        font-size: 20px;
      }
    }
  }

  ${List} {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }
`