import styled from "styled-components";
import { Box } from "../../atoms/box/Box.styled";
import { DISABLED, PRIMARY_HOVER, WHITE } from "../../../shared/styles/variables";

type TransactionWrapperProps = {
  isTransactionsPage: boolean;
}

export const TransactionWrapper = styled(Box) <TransactionWrapperProps>`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 17px;

  ${({ isTransactionsPage }) => isTransactionsPage && `
    &:hover {
      background-color: ${PRIMARY_HOVER};

      *:not(div > div:nth-child(2) > div > span) {
        color: ${WHITE};
      }
    }
  `}
`;
