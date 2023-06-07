import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import Grid from './Grid';

export default class QuickLinks extends React.Component<IQuickLinksProps, {}> {
  public render(): React.ReactElement<IQuickLinksProps> {

    const { numColumns = 4, items = [], backgroundColor = "white", textColor = "black" } = this.props;

    return (
      <div className={styles['quick-links']}>
        <h1>Quick Links</h1>
        <Grid columns={numColumns} items={items} backgroundColor={backgroundColor} textColor={textColor}/>
      </div>
    );
    
  }
}
