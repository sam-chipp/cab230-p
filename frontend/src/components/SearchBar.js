import React, { useState } from 'react';
import '../App.css';
import { Button, Input, InputGroup } from "reactstrap";

function SearchBar (props) {
  const [innerSearch, setInnerSearch] = useState("");
  const handleSubmit = (event) => {
    props.onSubmit(innerSearch);
    setInnerSearch("");
  };

  return (
      <div className="search">
        <InputGroup >
        <Button 
            type="button" 
            id="search-button"
            color="info"
            onClick={handleSubmit}>
              {props.searchText}
        </Button>
        <Input 
          aria-labelledby="search-button"
          name="search"
          id="search"
          type="search"
          value={innerSearch}
          onChange = {(e) => setInnerSearch(e.target.value)}
        /> 
        </InputGroup>
      </div>
  )
}

export default SearchBar;