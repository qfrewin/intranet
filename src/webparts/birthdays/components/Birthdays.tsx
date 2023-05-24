import * as React from 'react';
//import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { GetListItemsHelper } from '../../../global/GetListItemsHelper';

export interface IBirthdaysWebPartProps {
  description: string;
}

interface ListItem {
  Title: string,
  Date: string,
  Repeats: string,
  Message: string,
  Image: string
}

interface IBirthdaysState {
  items: ListItem[],
  error: string | null;
}

export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdaysState> {

  constructor(props: IBirthdaysProps) {
    super(props);
    this.state = {
      items: [],
      error: null,
    };
  }

  public async componentDidMount() {
    try {
      const items = await this._getListItems();
      this.setState({ items });
    } catch (error) {
      this.setState({ error: error.message})
    }
  }

  public render(): React.ReactElement<IBirthdaysProps> {
    const { description } = this.props;
    const { items, error } = this.state;

    return (
      <section>
        <div>
          <p>{description}</p>
          {error ? <p>Error: {error}</p> : null}
          {items.map((item, index) => (
            <div key={index}>
              <p>Title: {item.Title}</p>
              <p>Date: {item.Date}</p>
              <p>Repeats: {item.Repeats}</p>
              <p>Message: {item.Message}</p>
              {item.Image && <img src={item.Image} alt="List Item Image" width={50} height={50} />}
            </div>
          ))}
        </div>
      </section>
    );
  }

  private async _getListItems(): Promise<ListItem[]> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = "Celebrations";
    const properties = [
      "Title",
      "Date",
      "Repeats",
      "Message",
      "Image"
    ];

    try {
      const listItems: ListItem[] = await helper.getListItems<ListItem>(
        this.props.context, 
        listName, 
        properties,
        null,
        null,
      );

      const parsedItems: ListItem[] = listItems.map((item) => {
        if (item.Image) {
          const imageData = JSON.parse(item.Image);
          const imageUrl = `${imageData.serverUrl}${imageData.serverRelativeUrl}`;
          return { ...item, Image: imageUrl };
        }
        return item;
      });

      return parsedItems;
    } catch (error) {
      throw new Error(`Failed to retrieve list items: ${error.message}`)
    }
  }
}
