import * as React from 'react';
import { IHolidaysProps } from './IHolidaysProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GetListItemsHelper } from '../../../global/GetListItemsHelper';
import styles from './Holidays.module.scss';
import { IUserProperties, getUserProperties } from '../../../global/UserProfiles';
import { formatDateFromOptions } from '../../../global/DateUtils';

interface ListItem {
  Title: string;
  Date: string;
  Repeats: string;
  Message: string;
  ImageURL: string;
  Country: string[];
}

interface IUserRegion {
  Title: string;
  Countries: string[];
}

interface HolidaysState {
  items: ListItem[];
  filteredItems: ListItem[];
  userProperties?: IUserProperties;
  selectedCountry: string;
  countries: Set<string>
}

export default class Holidays extends React.Component<IHolidaysProps, HolidaysState> {

  constructor(props: IHolidaysProps) {
    super(props);
    this.state = {
      items: [],
      filteredItems: [],
      selectedCountry: '',
      countries: new Set<string>()
    };
  }

  public async getUserRegions(context: WebPartContext): Promise<Set<string>> {
    const regionsSet = new Set<string>();
  
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const regionsList: IUserRegion[] = await helper.getListItems<IUserRegion>(
      context,
      'User Regions',
      ['Title'],
      null
    );
  
    regionsList.forEach((country) => {
      regionsSet.add(country.Title);
    });
  
    return regionsSet;
  }

  public async componentDidMount() {
    const { context } = this.props;
    const [items, userProperties, countries] = await Promise.all([
      this._getListItems(context),
      getUserProperties(context),
      this.getUserRegions(context)
    ]);
  
    const defaultCountry = userProperties?.location || 'Display All';
    const filteredItems = this.filterItemsByCountry(items, defaultCountry);
  
    this.setState({ items, filteredItems, userProperties, selectedCountry: defaultCountry, countries });
  }

  private filterItemsByCountry(items: ListItem[], country: string): ListItem[] {
    if (country === 'Display All') {
      return items;
    } else {
      return items.filter((item) => {
        const itemCountries = item.Country || []; // Handle items without a specified country
        return itemCountries.indexOf(country) !== -1 || itemCountries.length === 0;
      });
    }
  }

  public render(): React.ReactElement<IHolidaysProps> {
    const { filteredItems, selectedCountry } = this.state;

    return (
      <div className={styles['holidays']}>
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
                {item.Date && <p>{formatDateFromOptions(item.Date, { month: 'short' })}</p>}
                {item.Date && <p>{formatDateFromOptions(item.Date, { day: 'numeric' })}</p>}
              </div>
              <div className={styles.content}>
                <h3>{item.Title}</h3>
                {item.Message && <p>{item.Message}</p>}
              </div>
              {item['ImageURL'] && <img src={item['ImageURL']} alt="List Item Image" width={50} height={50} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  private async _getListItems(context: WebPartContext): Promise<ListItem[]> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = 'Holidays';
    const propertyNames = ['Title', 'Date', 'Repeats', 'Message', 'Image URL', 'Country'];
  
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
  
    // Custom sorting logic to sort dates by month and day, ignoring the year
    listItems.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      const currentMonth = currentDate.getMonth();
      const monthDayA = (dateA.getMonth() + 12 - currentMonth) % 12 * 100 + dateA.getDate();
      const monthDayB = (dateB.getMonth() + 12 - currentMonth) % 12 * 100 + dateB.getDate();
      return monthDayA - monthDayB;
    });
  
    return listItems;
  }


  private renderCountryOptions(): React.ReactNode[] {
    const { countries } = this.state;
  
    // Create the option elements
    const options: React.ReactNode[] = [];
    countries.forEach((country) => {
      options.push(<option key={country} value={country}>{country}</option>);
    });
  
    return options;
  }

  private handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle the country change event
    const selectedCountry = event.target.value;
    const { items } = this.state;
  
    const filteredItems = this.filterItemsByCountry(items, selectedCountry);
    this.setState({ filteredItems, selectedCountry })
  };
}
