import * as React from 'react';
import { IHolidaysProps } from './IHolidaysProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GetListItemsHelper } from '../../../global/GetListItemsHelper';
import styles from './Holidays.module.scss';
import { IUserProperties, getUserProperties } from '../../../global/UserProfiles';

interface ListItem {
  Title: string;
  Date: string;
  Repeats: string;
  Message: string;
  Country: string[];
  Image: string;
}

interface HolidaysState {
  items: ListItem[];
  filteredItems: ListItem[];
  userProperties?: IUserProperties;
  selectedCountry: string;
}

export default class Holidays extends React.Component<IHolidaysProps, HolidaysState> {
  constructor(props: IHolidaysProps) {
    super(props);
    this.state = {
      items: [],
      filteredItems: [],
      selectedCountry: 'Display All',
    };
  }

  public async componentDidMount() {
    const [items, userProperties] = await Promise.all([
      this._getListItems(this.props.context),
      getUserProperties(this.props.context),
    ]);
  
    const defaultCountry = userProperties?.location ?? 'Display All';
    const filteredItems = defaultCountry === 'Display All' ? items : items.filter((item) => item.Country.indexOf(defaultCountry) !== -1);
  
    this.setState({ items, filteredItems, userProperties, selectedCountry: defaultCountry });
  }

  public render(): React.ReactElement<IHolidaysProps> {
    const { errorString } = this.props;
    const { filteredItems, selectedCountry } = this.state;

    //const defaultCountry = userProperties?.location ?? 'United States';

    return (
      <div className={styles['holidays']}>
        {errorString && <p>{errorString}</p>}
        <div className={styles['dropdown-container']}>
          <h1>Holidays / Days Off</h1>
          <select className={styles['dropdown']} value={selectedCountry} onChange={this.handleCountryChange}>
            <option value="Display All">Display All</option>
            {this.renderCountryOptions()}
          </select>
        </div>

        <div className={styles['scrollable-container']}>
          {filteredItems.map((item, index) => (
            <div key={index} className={styles['item-container']}>
              <div className={styles['date-container']}>
                {item.Date && <p>{this.formatDate(item.Date, { month: 'short' })}</p>}
                {item.Date && <p>{this.formatDate(item.Date, { day: 'numeric' })}</p>}
              </div>
              <div className={styles.content}>
                <h3>{item.Title}</h3>
                {item.Message && <p>{item.Message}</p>}
              </div>
              {item.Image && <img src={item.Image} alt="List Item Image" width={50} height={50} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  private formatDate(dateString: string, options: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  private async _getListItems(context: WebPartContext): Promise<ListItem[]> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = 'Holidays';
    const propertyNames = ['Title', 'Date', 'Repeats', 'Message', 'Country', 'Image'];
  
    const currentDate = new Date();
    const filterDate = currentDate.toISOString(); // Convert current date to ISO string format
    const filters = [
      `Repeats eq 'Yes' or Date ge '${filterDate}'`, // Filter based on "Repeats" column value
    ];
  
    const listItems: ListItem[] = await helper.getListItems<ListItem>(
      context,
      listName,
      propertyNames,
      filters
    );
  
    const parsedItems: ListItem[] = listItems.map((item) => {
      if (item.Image) {
        const imageData = JSON.parse(item.Image);
        const imageUrl = `${imageData.serverUrl}${imageData.serverRelativeUrl}`;
        return { ...item, Image: imageUrl };
      }
      return item;
    });
  
    // Custom sorting logic to sort dates by month and day, ignoring the year
    parsedItems.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      const currentMonth = currentDate.getMonth();
      const monthDayA = (dateA.getMonth() + 12 - currentMonth) % 12 * 100 + dateA.getDate();
      const monthDayB = (dateB.getMonth() + 12 - currentMonth) % 12 * 100 + dateB.getDate();
      return monthDayA - monthDayB;
    });
  
    return parsedItems;
  }


  private renderCountryOptions(): React.ReactNode {
    const { items } = this.state;
    const countriesSet = new Set<string>();

    // Collect all unique countries from the list
    items.forEach((item) => {
      item.Country.forEach((country) => {
        countriesSet.add(country);
      });
    });

    // Create the option elements
    const options: React.ReactNode[] = [];
    countriesSet.forEach((country) => {
      options.push(<option key={country} value={country}>{country}</option>);
    });

    return options;
  }

  private handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle the country change event
    const selectedCountry = event.target.value;
    const { items } = this.state;
  
    if (selectedCountry === 'Display All') {
      this.setState({ filteredItems: items, selectedCountry });
    } else {
      const filteredItems = items.filter((item) => item.Country.indexOf(selectedCountry) !== -1);
      this.setState({ filteredItems, selectedCountry });
    }
  };
}
