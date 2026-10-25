import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import NotificationMenu from "./NotificationMenu";

type HeaderProps = {
  children?: ReactNode;
  brandHref?: string;
};

export default function Header({ children, brandHref }: HeaderProps) {
  const brand = (
    <span className={styles.brand}>
      <Image src="/Ai.png" alt="ClassBridge" width={32} height={32} />
      ClassBridge
    </span>
  );

  return (
    <header className={styles.header}>
      {brandHref ? (
        <Link href={brandHref} className={styles.brandLink}>
          {brand}
        </Link>
      ) : (
        brand
      )}
      <div className={styles.actions}>
        <NotificationMenu />
        {children}
      </div>
    </header>
  );
}
