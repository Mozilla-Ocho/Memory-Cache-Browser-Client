import { ReactNode } from "react";
import { MainNav } from "@/components/modules/navigation/MainNav/MainNav";
import styles from "./GlobalLayout.module.scss";

type GlobalLayoutProps = {
  children: ReactNode;
};

// The LayoutWrapper component
export const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className={styles.wrapper}>
      {/* Here you can add global layout elements like headers, footers, sidebars, etc. */}
      <MainNav />

      {/* This is where child components will be rendered */}
      <main>{children}</main>

      <footer>Global Footer</footer>
    </div>
  );
};
