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
   this._handleIndexSelect = this._handleIndexSelect;
  }


  public getlistdata(): Promise<IListItems[]> {

    // var list=this.props.ListName;
     return new Promise<IListItems[]>((resolve: (results: IListItems[]) => void, reject: (error: any) => void): void => {
   //   sp.web.lists.getByTitle(list).items.select('Id,Title,Description').get().then((items:Ilist[]) => {
     sp.web.lists.getByTitle('Glossary').items.select('Id,Title,Description').get().then((items: IListItems[]) => {
      ///_api/web/lists/getbytitle(‘'infolist')/items?$filter=startswith(Title,‘Index’)
      
      console.log(items);
      resolve(items); 
      })
      .catch((error: any): void => {
        // An exception has occurred while loading the data. Notify the user
        // that loading data is finished and return the exception.
       console.log(error);
    
          });
      
         });
 
   }
 
  private init() {
    this.getlistdata().then(items=> {
       this.setState({
          items,
    
          initialContainer :items
  
          
        });
        
    });
}
 

  private _handleIndexSelect = (index: string): void => {
    // switch the current tab to the tab selected in the navigation
    // and reset the search query
    console.log(this.state.selectedIndex);

    this.setState({
      selectedIndex: index,
      //searchQuery: ''
      items :[]
    },
      function () {
        // load information about people matching the selected tab
      //  this._loadPeopleInfo(index, null);
     // this._getlisItems(index);

     // this.getlistdata();
     this._loadlistitems(index);

    

      });

  }
  

  private _loadlistitems =(index:string):void=> {

    this.setState({
      loading: true,
      errorMessage: null,
      items: []
    });
    this.getlistdata().then(items=> {
      this.setState({
         items,
   
         initialContainer :items
 
         
       });
       
   });
    const selectedIndex = this.state.selectedIndex;
    console.log(this.state.selectedIndex);
    let indexeditems = this.state.initialContainer.map(i=>{
      if(i.Title.toLocaleLowerCase().startsWith(selectedIndex.toLocaleLowerCase())){
      return indexeditems;
      }
    });
    //if (!index) this.setState({ items: this.state.initialContainer });
    // this.state.initialContainer.map((item)=>{
    //   if(item.Title.toLocaleLowerCase().startsWith(index.toLocaleLowerCase())){
    //     return item;
    //   }
    // });
    this.setState({ 
       //items: this.state.initialContainer.filter((item)=> item.Title && item.Title.toLocaleLowerCase().startsWith(index.toLocaleLowerCase())) ,
        selectedIndex: index,
        items:this.state.initialContainer.map((item)=>{
          if(item.Title.toLocaleLowerCase().charAt(0)==index.toLocaleLowerCase()){
           return item;
          }
        })

    });

}

  /**
   * Loads information about people using SharePoint Search
   * @param index Selected tab in the index navigation or 'Search', if the user is searching
   
   */
  

  public componentDidMount(): void {
    // load information about people after the component has been
    // initiated on the page
   //this._getlisItems(this.state.selectedIndex);
   
  this._loadlistitems(this.state.selectedIndex);
  }
  
  public render(): React.ReactElement<IGlossaryProps> {
  // debugger;
  //   const items: JSX.Element[] = this.state.items.map((item: IListItems, i: number): JSX.Element => {
  //     if(item.Title.charAt(0) == this.state.selectedIndex){
  //       return (
  //         <li>{item.Title} </li>

  //       );
  //     }
  //     //return (
  //      // <li>{item.Title} ({item.ID}) </li>
  //    // );
  //   });
  const items: JSX.Element[] = this.state.items.map((item: IListItems, i: number): JSX.Element => {
    return (
      <li>{item.Title} ({item.Id}) </li>
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


          {!selectedIndex && !loading &&
          !errorMessage &&
         
          <div>
          { this.state.initialContainer} 
       </div>
        }
      
        <IndexNavigation
          selectedIndex={selectedIndex}
          
          onIndexSelect={this._loadlistitems}
          
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
