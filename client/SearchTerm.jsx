import React from 'react';

const SearchTerm = (props) => {

  const setSearchTerm = (e) => {
    props.handleSetSearch(props.searchTerm)
  }

  return (
    <a onClick={setSearchTerm}>{props.searchTerm}</a>
  )
};

export default SearchTerm;
