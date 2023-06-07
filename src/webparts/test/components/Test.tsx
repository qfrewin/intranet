import * as React from 'react';
import { ITestProps } from './ITestProps';
import { getPeople, /*getSheetData*/ } from '../../../global/GetPeople';
//import { GetListItemsHelper } from '../../../global/GetListItemsHelper';

interface ITestState {
  data: string | null;
  error: string | null;
}

export default class Test extends React.Component<ITestProps, ITestState> {
  constructor(props: ITestProps) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
  }

  public componentDidMount() {
    this.fetchData();
  }

  // private async fetchData() {
  //   const { context } = this.props;
  //   try {
  //     const data = await getUserProperties(context);
  //     if (data.location === "" || data.location === null || data.location === undefined) {
  //       data.location = "no location set";
  //     }
  //     this.setState({ data: data.location, error: null, displayName: data.displayName, department: data.department });
  //   } catch (error) {
  //     this.setState({ data: null, error: error.message });
  //   }
  // }

  private async fetchData() {
    const { context } = this.props;
    try {
      const data = await getPeople(context);
      this.setState({ data: data, error: null});
    } catch (error) {
      this.setState({ data: null, error: error.message });
    }
  }

  // private async fetchData() {
  //   const { context } = this.props;
  //   try {
  //     const data = await new GetListItemsHelper().getListItems<any>(context, "TestList", null, null, null);
  //     this.setState({ data: await JSON.stringify(data)});
  //   } catch (error) {
  //     this.setState({ data: null, error: error.message });
  //   }
  // }

  public render(): React.ReactElement<ITestProps> {
    const { data, error} = this.state;

    return (
      <div>
        {data ? <p>{data}</p> : null}
        {error ? <p>Error: {error}</p> : null}
      </div>
    );
  }
}
