import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
import styles from "./button.module.scss";

interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  withIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = "medium",
  onClick,
  disabled = false,
  children,
  withIcon = false,
}) => {
  const getButtonClassNames = () => {
    let classNames = styles.button;

    switch (variant) {
      case "primary":
        classNames += ` ${styles.primary}`;
        break;
      case "secondary":
        classNames += ` ${styles.secondary}`;
        break;
    }

    switch (size) {
      case "small":
        classNames += ` ${styles.small}`;
        break;
      case "medium":
        classNames += ` ${styles.medium}`;
        break;
      case "large":
        classNames += ` ${styles.large}`;
        break;
    }

    return classNames;
  };

  return (
    <button
      className={getButtonClassNames()}
      onClick={onClick}
      disabled={disabled}
    >
      {withIcon && variant === "primary" && (
        <FontAwesomeIcon
          icon={faTelegramPlane}
          style={{ color: "red", marginRight: "8px" }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
