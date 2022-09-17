export  interface ImainData {
    icd10? : string;
    valid? : boolean;
    shortDescr?: string;
}

export interface SearchFieldProps {
    onSearch: (v: string) => void;
    isLoading: boolean;
    searchKeyWord : string;
  }