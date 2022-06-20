import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";

export function SingInButton() {
  const isUserLoggedIn = false;

  return isUserLoggedIn ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#04d361" />
      João vitor
      <FiX color="#737380" className={styles.closeIcon}></FiX>
    </button>
  ) : (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#eba417" />
      Sing in with GitHub
    </button>
  );
}
