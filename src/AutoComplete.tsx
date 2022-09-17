import React, { FC, useState } from "react";
import { debounce } from "lodash";
import SearchField from "./SearchField";
import List from "./ListItems";
import axios from "axios";
import { ImainData } from "./interface/ImainData";

const HOSTNAME = "http://localhost:3333/";
const API_SearchWord = HOSTNAME+"geticd10whoa/search/";
const API_Suggestion = HOSTNAME+"geticd10whoa/searchConfirm/";
const DEBOUNCE = 1000;

/**
 * @param {*} queryParam the search string
 * @param setResults a function to set update the state of the component with search result
 * @param setIsloading a function to control the loading state
 * @param setInputKeyWord a function to control the loading state
 */
var getItemList:any = [];
const searchImplement = async ( queryParam: string,  setResults: (value: string[]) => void, setIsLoading: (value: boolean) => void,setInputKeyWord: (value: string) => void) => {
  await axios.get(API_SearchWord+queryParam).then((responseItem:any ) => {
      getItemList = responseItem.data;
      let uniqueArray =removeDuplicateItem(getItemList);
      setIsLoading(false);
      setInputKeyWord("");
      setResults(uniqueArray.map((i: ImainData) => i.shortDescr) );
    });
};

const removeDuplicateItem = ((getItemList:any)=>{
  return getItemList.filter((arr:any, index:any, self:any) =>
  index === self.findIndex((t:ImainData) => (t.icd10 === arr.icd10 && t.shortDescr === arr.shortDescr)))
});

const debouncedSearch = debounce(searchImplement, DEBOUNCE);

const AutoComplete: FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputKeyword, setInputKeyWord] = useState("")
  
 const onSerach = (v: string) => {
    const search = debouncedSearch;
    if (!v) {
      // when the user clear the field we don't want to perform a search, we need to clear the state and do nothing else
      debouncedSearch.cancel();
      setResults([]);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      search(v, setResults, setIsLoading,setInputKeyWord);
    }
  };

 const displayListHandle = async (status:boolean) =>{
    if(status){
      let getDropDownList:any = document.getElementsByClassName("dropdown-menu");
      if(getDropDownList[0])
        getDropDownList[0].style.display = '';
    }else{
      let getDropDownList:any = document.getElementsByClassName("dropdown-menu");
      if(getDropDownList[0])
        getDropDownList[0].style.display = 'none';
    }
  }


const getSuggestionItem = async  (item:ImainData) => {
    setIsLoading(true);
    getItemList = [];
    setResults([]);

    let getKeyBox:any = document.getElementById("keySearch");
    getKeyBox.value = item.icd10 + " " + item.shortDescr;

    const requestItem:any =  await axios(API_Suggestion + item.icd10);
    const responseData: any =  await requestItem.data;
    getItemList = responseData;
    
    setInputKeyWord("");
    displayListHandle(true)
    setResults(getItemList.map((i: any) => i.shortDescr) );
    setIsLoading(false);
    return ;
}

const getValueOfDescription = async (item:any) =>{
      let getICDCode : ImainData = await  getItemList.find((findItem:any)=>{ return findItem.shortDescr.toLowerCase() === item.toLowerCase()});
      if(getICDCode){
        if(getICDCode.valid){
          let getKeyBox:any = document.getElementById("keySearch");
          getKeyBox.value = getICDCode.icd10 + " " + getICDCode.shortDescr;
          return getICDCode.icd10;
        }else{
          return getSuggestionItem(getICDCode)
        }
      }else{
        return "Not found"
      }
  }

  const listeningEventKeyPress = (e:any)=> {
    displayListHandle(true);
    return
  }

  const listeningAddDataToInputBox = (item:string) => {
    getValueOfDescription(item);
    return 
  }

  const eventListener = ((itemList:string)=>{
    let getKeyBox:any = document.getElementById("keySearch");
        getKeyBox.onkeypress = ((e:any)=>{listeningEventKeyPress(e) });
        let getDropDownList:any = document.getElementsByClassName("dropdown-menu");
        getDropDownList[0].style.display = 'none';
        listeningAddDataToInputBox(itemList);
  });
   
  return (
    <>
      <SearchField onSearch={onSerach} isLoading={isLoading}  searchKeyWord={inputKeyword}/>
      {
        !!results.length && <List items={results} onSelect={(itemList:any) => 
                eventListener(itemList)
          } />
          
        }
    </>
  );
};

export default AutoComplete;
