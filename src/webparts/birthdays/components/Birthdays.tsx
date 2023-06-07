import * as React from 'react';
//import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { GetListItemsHelper } from '../../../global/GetListItemsHelper';
import { formatDateFromString } from '../../../global/DateUtils';

export interface IBirthdaysWebPartProps {
  description: string;
}

interface ListItem {
  Title: string,
  Date: string,
  EmployeeLast: string,
  EmployeeFirst: string,
  EmployeeEmail: string,
  Header: string,
  Message: string,
  ImageURL: string
}

interface TemplateItem {
  Title: string,
  HeaderTemplate: string,
  MessageTemplate: string,
  ImageURL: string,
  DateFormat: string
}

interface IBirthdaysState {
  items: ListItem[],
  templates: Map<string, TemplateItem>,
  error: string | null;
}

export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdaysState> {

  constructor(props: IBirthdaysProps) {
    super(props);
    this.state = {
      items: [],
      templates: new Map<string, TemplateItem>(),
      error: '',
    };
  }

  public async componentDidMount() {
    try {
      const nonFormattedItems = await this._getListItems();
      const templates = await this._getCelebrationTemplates();
      const items = await this._applyTemplates(nonFormattedItems, templates);
      this.setState({ items, templates });
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
              <p>Header: {item.Header}</p>
              <p>Message: {item.Message}</p>
              {<img src={item.ImageURL} alt="List Item Image" width={50} height={50} />}
            </div>
          ))}
        </div>
      </section>
    );
  }

  private async _getCelebrationTemplates(): Promise<Map<string, TemplateItem>> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = "Celebrations Templates";
    const properties = [
      "Title",
      "Header Template",
      "Message Template",
      "Image URL",
      "Date Format"
    ];
    
    const templatesList: TemplateItem[] = await helper.getListItems<TemplateItem>(
      this.props.context,
      listName,
      properties
    );

    const templates = new Map<string, TemplateItem>();
    templatesList.forEach(obj => {
      templates.set(obj.Title, obj);
    });

    return templates;
  }

  private async _getListItems(): Promise<ListItem[]> {
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = "Celebrations";
    const properties = [
      "Title",
      "Date",
      "Employee Last",
      "Employee First",
      "Employee Email",
      "Header",
      "Message",
      "Image URL"
    ];

    try {
      const listItems: ListItem[] = await helper.getListItems<ListItem>(
        this.props.context, 
        listName, 
        properties,
        null,
        null,
      );

      return listItems;
    } catch (error) {
      throw new Error(`Failed to retrieve list items: ${error.message}`)
    }
  }

  private _applyTemplates(items: ListItem[], templates: Map<string, TemplateItem>): ListItem[] {
    const formattedItems: ListItem[] = [];
  
    items.forEach((item) => {
      if (templates.has(item.Title)) {
        const template = templates.get(item.Title)!;
        let header: string = item.Header;
        if (header === null || header === undefined || header === '') {
          header = this.replacePlaceholders(template.HeaderTemplate, item, templates);
        }

        let message: string = item.Message;
        if (message === null || message === undefined || message === '') {
          message = this.replacePlaceholders(template.MessageTemplate, item, templates);
        }

        let imageurl = item.ImageURL;
        if (imageurl === null || imageurl === undefined || imageurl === '') {
          imageurl = template.ImageURL;
        }

        const formattedItem: ListItem = {
          ...item,
          Header: header,
          Message: message,
          ImageURL: imageurl
        };
  
        formattedItems.push(formattedItem);
      } else {
        formattedItems.push(item);
      }
    });
  
    return formattedItems;
  }

  private replacePlaceholders(template: string | undefined, item: ListItem, templates: Map<string, TemplateItem>): string {
    if (!template) {
      return '';
    }
  
    let formattedTemplate = template;
  
    const placeholderRegex = /<<([^>>]+)>>/g;
    const matches = formattedTemplate.match(placeholderRegex);
  
    if (matches) {
      matches.forEach((match) => {
        const placeholder = match.slice(2, -2);
        const propertyName = placeholder
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        const value = item[propertyName as keyof ListItem] as string;
  
        //Check if the placeholder is 'Date' and format it using formatDateFromString
        if (propertyName === 'Date') {
          const templateItem = templates.get(item.Title);
          const dateFormat: string = templateItem?.DateFormat || ''; // Use an empty string if dateFormat is null or undefined
          const formattedDate = dateFormat && formatDateFromString(value, dateFormat);
          formattedTemplate = formattedTemplate.replace(match, formattedDate || value);
        } else {
          formattedTemplate = formattedTemplate.replace(match, value);
        }
      });
    }
  
    return formattedTemplate;
  }
  
  
}
