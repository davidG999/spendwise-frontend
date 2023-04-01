import styled from "styled-components";

import {commonStyles} from "../../../shared/styles/commonStyles";

type FormProps = {
    maxWidth?: string;
    textAlign?: string;
    color?: string;
    alignItems?: string;
}

export const Form = styled.form<FormProps>`
  ${commonStyles};
  
  max-width: ${({maxWidth}) => maxWidth || undefined};
  text-align: ${({textAlign}) => textAlign || undefined};
  color: ${({color}) => color || "white"};
  align-items: ${({alignItems}) => alignItems || undefined};
`