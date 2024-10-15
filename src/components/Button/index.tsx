import React from "react";
import { useButtonClassNames } from "../../hooks/useButtonClassName";

interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  customClass?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = "medium",
  onClick,
  disabled = false,
  children,
  customClass = "",
}) => {
  const classNames = useButtonClassNames(variant, size);

  const combinedClassNames = `${classNames} ${customClass}`.trim();

  return (
    <button
      className={combinedClassNames}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
