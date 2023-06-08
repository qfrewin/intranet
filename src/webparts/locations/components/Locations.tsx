import * as React from 'react';
import { ILocationsProps } from './ILocationsProps';
import { GetListItemsHelper } from '../../../global/GetListItemsHelper';
import styles from './Locations.module.scss';

interface LocationItem {
  Title: string,
  Phone: string,
  Address: string
}

interface ILocationsState {
  locations: LocationItem[],
  error: string
}

export default class Locations extends React.Component<ILocationsProps, ILocationsState> {

  constructor(props: ILocationsProps) {
    super(props);
    this.state = {
      locations: [],
      error: '',
    };
  }

  public async componentDidMount() {
    try {
      const locations = await this._getLocations();
      this.setState({ locations });
    } catch (error) {
      this.setState({ error: error.message})
    }
  }

  public render(): React.ReactElement<ILocationsProps> {
    const { locations } = this.state;

    return (
      <div className={styles.locations}>
        <h1>Locations</h1>
        <div className={styles['locations-container']}>
          {locations.map((location, index) => (
            <div key={index} className={styles.location}>
              <p>Title: {location.Title}</p>
              <p>Phone: {location.Phone}</p>
              <p>Address: {location.Address}</p>
              <div className={styles['map-container']}>
                <iframe
                  title={`Map showing location: ${location.Title}`}
                  src={`https://www.bing.com/maps/embed?h=300&w=500&q=${encodeURIComponent(
                    location.Address
                  )}`}
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 0 }}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private async _getLocations(): Promise<LocationItem[]> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = "Office Locations";
    const properties = [
      "Title",
      "Phone",
      "Address"
    ];

    try {
      const locations: LocationItem[] = await helper.getListItems<LocationItem>(
        this.props.context, 
        listName, 
        properties,
        null,
        null,
      );

      return locations;
    } catch (error) {
      throw new Error(`Failed to retrieve list items: ${error.message}`)
    }
  }
}
