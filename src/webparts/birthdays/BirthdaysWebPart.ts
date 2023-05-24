import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BirthdaysWebPartStrings';
import Birthdays from './components/Birthdays';
import { IBirthdaysProps } from './components/IBirthdaysProps';
//import { ISpecifiedUserProperties, getSpecifiedUserProperties } from '../../global/SpecifiedUserProfile';

export interface IBirthdaysWebPartProps {
  description: string;
}

export default class BirthdaysWebPart extends BaseClientSideWebPart<IBirthdaysWebPartProps> {
  // private userData: ISpecifiedUserProperties | null = null;
  // private errorString: string = "";

  public render(): void {
    const element: React.ReactElement<IBirthdaysProps> = React.createElement(
      Birthdays,
      {
        description: this.properties.description,
        context: this.context,
        // person: this.userData,
        // errorString: this.errorString.toString()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  // private fetchSpecifiedUserProperties(userId: string) {
  //   getSpecifiedUserProperties(this.context, userId)
  //     .then((userProperties) => {
  //       this.userData = userProperties;
  //     }).catch((error) => {
  //       this.errorString = error;
  //     })
  // }

  protected onInit(): Promise<void> {
    return Promise.resolve();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
