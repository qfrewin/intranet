import * as React from 'react';
import styles from './NavigationBar.module.scss'

export interface ListItem {
    Title: string;
    URL: string;
    Order: number;
    Parent: string;
  }

interface NavigationBarProps {
  links: ListItem[];
}

const NavigationBar: React.FC<NavigationBarProps> = ({ links }) => {
  return (
    <div className={styles['navigation-bar']}>
        <div className={styles['links-container']}>
        {links.map((link) => (
            <div className={styles['link']}>
                <a key={link.Title} href={link.URL}>
                {link.Title}
                </a>
            </div>
        ))}
        </div>
    </div>
  );
};

export default NavigationBar;