import styles from "../components/Button/button.module.scss";

export const useButtonClassNames = (
  variant: "primary" | "secondary",
  size: "small" | "medium" | "large"
) => {
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
