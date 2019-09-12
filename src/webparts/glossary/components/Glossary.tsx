import * as React from 'react';
import styles from './Glossary.module.scss';
import { IGlossaryProps } from './IGlossaryProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import * as $ from 'jquery';
import { sp, Items} from "@pnp/sp";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import{IListItems} from "./IListItems";
import { IGlossaryState } from './IGlossaryState';
import * as strings from 'GlossaryWebPartStrings';
import{IListSearchResults, ICell} from "./IListSearchResults";
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import {
  MessageBar,
  MessageBarType
} from 'office-ui-fabric-react/lib/MessageBar';
import { IndexNavigation } from "./IndexNavigation";
import { string } from 'prop-types';

export default class Glossary extends React.Component<IGlossaryProps, IGlossaryState> {
  private _initialState: any = {
    initialContainer:[],
    loading: false,
    errorMessage: null,
    selectedIndex: 'A',
    items :[]
};

  constructor(props: IGlossaryProps) {
    super(props);
    this.state = this._initialState;
   this._handleIndexSelect = this._handleIndexSelect.bind(this);
  }

  private _handleIndexSelect = (index: string): void => {
    // switch the current tab to the tab selected in the navigation
    // and reset the search query
    this.setState({
      selectedIndex: index
    },
      function () {
        // load information about people matching the selected tab
        this._loadlistitems(index, null);
      });

  }

  public getlistdata(): Promise<IListItems[]> {

    // var list=this.props.ListName;
     return new Promise<IListItems[]>((resolve: (results: IListItems[]) => void, reject: (error: any) => void): void => {
   //   sp.web.lists.getByTitle(list).items.select('Id,Title,Description').get().then((items:Ilist[]) => {
     sp.web.lists.getByTitle('Glossary').items.select('Id,Title,Description').get().then((items: IListItems[]) => {
      ///_api/web/lists/getbytitle(‘'infolist')/items?$filter=startswith(Title,‘Index’)
      
      console.log(items);
      resolve(items); 
      debugger;
      })
      .catch((error: any): void => {
        // An exception has occurred while loading the data. Notify the user
        // that loading data is finished and return the exception.
       console.log(error);
    
          });
      
         });
 
   }

 

  /**
   * Loads information about people using SharePoint Search
   * @param index Selected tab in the index navigation or 'Search', if the user is searching
   
   */
  //
  private _loadlistitems(index: string): void {
    
    this.setState({
      loading: true,
      errorMessage: null,
     items: [],
      selectedIndex:index
    });
 // let self =this;
  // this.getlistdata().
  var list=this.props.ListName;
  sp.web.lists.getByTitle(list).items.select('Id,Title,Description').get().then((items: IListItems[]) => {
      
       if (items.length > 0) {
        // notify the user that loading the data is finished and return the loaded information
        this.setState({
          loading: true,
          initialContainer: items
        });
      }
      else {
        // People collection could be reduced to zero, so no results
        this.setState({
          loading: false
        });
        return;
      }
      const selectedIndex = index;
      
      if(this.state.initialContainer && selectedIndex) {
        items= this.state.initialContainer.filter((element) => (element.Title.charAt(0).toLowerCase() === selectedIndex.toLowerCase()));
      } else {
        items = this.state.initialContainer || [];
  
        return items;
      }
      debugger;
      this.setState({
        loading: false,
        items: items
      });
    }).catch((error: any): void => {
      // An exception has occurred while loading the data. Notify the user
      // that loading data is finished and return the exception.
      this.setState({
        loading: false,
        errorMessage: error
      });
  
        });
      
  }
    
     

        
      
      
  

  public componentDidMount(): void {
    // load information about people after the component has been
    // initiated on the page
  this._loadlistitems(this.state.selectedIndex);
  }
  
  public render(): React.ReactElement<IGlossaryProps> {

    alert('hi');
   console.log(this.state.items);
    
  const items: JSX.Element[] = this.state.items.map((item: IListItems, i: number): JSX.Element => {
    return (
      <li><div><strong>{item.Title}</strong></div><div>({item.Description})</div> </li> 
    );
  });
 const { loading, errorMessage, selectedIndex} = this.state;
   return (
      <div className={styles.glossary}>
         <p className ={styles.row}>{escape(this.props.ListName)}</p>
       {!loading &&
          errorMessage &&
          // if the component is not loading data anymore and an error message
          // has been returned, display the error message to the user
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}>{strings.ErrorLabel}: {errorMessage}</MessageBar>
        }
         
        <IndexNavigation
          selectedIndex={selectedIndex}
          onIndexSelect={this._loadlistitems.bind(this)}
          locale={this.props.locale} />
        {
          loading &&
          // if the component is loading its data, show the spinner
          <Spinner size={SpinnerSize.large} label={strings.LoadingSpinnerLabel} />
        }
{!loading &&
  !errorMessage &&
                <div>
                  <ul>
                    {items}
                  </ul>
                </div>
              } 
</div>       
    );
  }
}
