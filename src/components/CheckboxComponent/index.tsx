import React, { forwardRef, useEffect, useRef } from "react";
import styles from "./checkbox.module.scss";

interface CheckboxComponentProps {
  checked: boolean | string | any;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxComponentProps>(
  ({ checked, indeterminate = false, onChange }, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      const currentRef =
        (ref as React.RefObject<HTMLInputElement>) || internalRef;
      if (currentRef?.current) {
        currentRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`${styles.checkboxInputContainer} ${
          indeterminate ? styles.indeterminate : ""
        }`}
        ref={ref || internalRef}
      />
    );
  }
);

export default CheckboxComponent;
