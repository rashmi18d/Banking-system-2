import React from "react";
import { useButtonClassNames } from "../../hooks/useButtonClassName";
// import styles from "../../hooks/useButtonClassName";

interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = "medium",
  onClick,
  disabled = false,
  children,
}) => {
  const classNames = useButtonClassNames(variant, size);

  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
