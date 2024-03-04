import { Logo } from "@/components/modules/branding/Logo/Logo";
import styles from "./MainNav.module.scss";
import { Input } from "@/components/ui/input";

type MainNavProps = {};

export const MainNav = ({}: MainNavProps) => {
  /**
   * Main Nav JSX
   */
  return (
    <nav className={styles.main_nav_wrapper}>
      <div className={styles.main_nav_container}>
        {/* Main navigation links / logo */}
        <div className={styles.main_nav_contents}>
          {/* Logo */}
          <a href="/">
            <Logo />
          </a>

          <a href="/" className={styles.main_nav_link}>
            Home
          </a>

          <a href="/about" className={styles.main_nav_link}>
            Documentation
          </a>
        </div>

        <Input placeholder="Search" className={styles.search} />
      </div>
    </nav>
  );
};
