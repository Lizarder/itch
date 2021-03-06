import * as React from "react";
import * as classNames from "classnames";

import Icon from "./icon";

import styled, * as styles from "../styles";

const IconButtonDiv = styled.div`
  display: inline-block;
  ${styles.iconButton()};
  ${styles.clickable()};
  font-size: ${props => props.theme.fontSizes.baseText};
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.2;
    pointer: disabled;
  }

  &.big {
    font-size: ${props => props.theme.fontSizes.huge};
    width: 42px;
    height: 42px;
  }
`;

class IconButton extends React.PureComponent<IProps> {
  render() {
    const {
      big,
      disabled,
      icon,
      hint,
      hintPosition = "top",
      ...restProps,
    } = this.props;

    return (
      <IconButtonDiv
        className={classNames({ disabled, big })}
        data-rh={hint}
        data-rh-at={hintPosition}
        {...restProps}
      >
        <Icon icon={icon} />
      </IconButtonDiv>
    );
  }
}

interface IProps {
  icon: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  hint?: string;
  hintPosition?: "top" | "left" | "right" | "bottom";

  onClick?: any;
  big?: boolean;
}

export default IconButton;
