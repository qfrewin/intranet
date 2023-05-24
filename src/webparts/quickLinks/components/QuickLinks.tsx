import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import Grid from './Grid';

export default class QuickLinks extends React.Component<IQuickLinksProps, {}> {
  public render(): React.ReactElement<IQuickLinksProps> {

    const { numColumns = 4, items = [], backgroundColor = "white", textColor = "black" } = this.props;

    return (
      <section className={`${styles.quickLinks}`}>
        <Grid columns={numColumns} items={items} backgroundColor={backgroundColor} textColor={textColor}/>
      </section>
    );
    
  }
}
