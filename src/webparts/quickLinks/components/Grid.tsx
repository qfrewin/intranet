import * as React from 'react'
import { FC } from 'react';
import { ISPList } from './ISPLists';
import styles from './Grid.module.scss';

interface GridProps {
    columns: number;
    items: ISPList[];
    backgroundColor: string,
    textColor: string
}

const Grid: FC<GridProps> = ({ columns, items, backgroundColor, textColor }) => {
  const renderGridItems = () => {
    return items.map((item, index) => (
      <a
        className={styles['grid-item']}
        href={item.URL}
        key={item.ID}
        style={{
          gridColumnStart: ((index % columns) + 1).toString(),
          gridRowStart: Math.floor(index / columns) + 1,
          backgroundColor: backgroundColor,
          color: textColor
        }}
      >
        <h3>{item.Title}</h3>
      </a>
    ));
  };

  return (
    <div className={styles['grid-container']}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {renderGridItems()}
      </div>
    </div>
  );
};

export default Grid;