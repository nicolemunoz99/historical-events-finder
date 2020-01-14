import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import SearchTerm from './SearchTerm.jsx';
import Results from './Results.jsx';

const App = props => {
  // const [dropdown, toggleDropdown] = React.useState(false);
  // const [inputPlaceholder, changePlaceholder] = React.useState('Select a search method first');
  // const [searchCriteria, setSearchCriteria] = React.useState(null);
  const [firstLoad, updateFirstLoad] = React.useState(true);
  const [keywordInput, updateKeywordInput] = React.useState('');
  const [locationInput, updateLocationInput] = React.useState('');
  const [yearInput, updateYearInput] = React.useState('');
  const [yearFormat, updateYearFormat] = React.useState('ad')
  // const [searchResults, updateSearchResults] = React.useState(null);
  // state for react-pagniate
  const [offset, changeOffset] = React.useState(0);
  const [data, changeData] = React.useState(null);
  const [perPage, changePerPage] = React.useState(5);
  const [currentPage, changeCurrentPage] = React.useState(0);
  const [pageCount, changePageCount] = React.useState(0);

  useEffect(
    () => {
      loadData();
    },
    [offset]
  )

  const handleDropdown = (e) => {
    toggleDropdown(!dropdown)
  }


  const handleInput = (e) => {
    if (e.target.id === 'keyword')  { updateKeywordInput(e.target.value) }
    if (e.target.id === 'year')     { updateYearInput(e.target.value) }
    if (e.target.id === 'location') { updateLocationInput(e.target.value) }
  }

  const loadData = async () => {
    if (!firstLoad) {
      let response = await fetch(`/events?_start=${offset}&_end=${offset+perPage}&${searchString}`)
      let data = await response.json();
      await changeData(data);
  }
  }
  let searchString ='';
  
  const submitSearch = async () => {
    updateFirstLoad(false)
    let year;
    if (yearInput.length) {
      year = yearFormat === 'bc' ? -yearInput : yearInput;
      searchString += `&date=${year}`;
    }
    if (keywordInput.length) {
      searchString += `&description_like=${keywordInput}`;
    }
    if (locationInput.length) {
      searchString += `&category2_like${locationInput}`;
    }
    let allData = await fetch(`/events?${searchString}`);
    allData = await allData.json();
    await changePageCount(Math.ceil(allData.length / perPage));
    await loadData();
  };

  const handlePageClick = async (data) => {
    let selected = data.selected;
    await changeOffset(Math.ceil(selected * perPage));
  }


  const searchTerms = {
    Date: {
      placeholder: 'Enter a date...',
      filter: 'date'
    },
    Description: {
      placeholder: 'Search by description keywords...',
      filter: 'description'
    },
    Location: {
      placeholder: 'Search by location of event...',
      filter: 'category2'
    }
  }

  return (
    <div>
        <div className='mt-4 title'>
          <div className="ml-4 vertical-align">Historical Events Finder</div>
        </div>
      <div className="container-flex app-container">
        <div className="row no-gutters align-items-center">



        <form>
          <div className="form-group row">
            <div className="col-12 h3 mb-3">Enter as many fields as you like</div>
            <label className="col-sm-3 col-form-label">Keyword: </label>
            <div className="col-sm-9">
              <input onChange={handleInput} type="email" className="form-control" id="keyword"></input>
            </div>
          </div>
          <div className="form-group mt-5 row justify-content-end">
            <label className="col-sm-3 col-form-label">Year: </label>
            <div className="col-sm-3">
              <input onChange={handleInput} className="form-control" id="year" placeholder="YYYY"></input>
            </div>

            <div className="col-sm-3">
              <input type="checkbox" value="bce"></input>
              <label className="ml-2">BC</label>
            </div>
            <div className="col-sm-3">
              <input type="checkbox" value="ad"></input>
              <label className="ml-2">AD</label>
            </div>

          </div>
          <div className="form-group row mt-5">
            <label className="col-sm-3 col-form-label">Location: </label>
            <div className="col-sm-9">
              <input onChange={handleInput} type="email" className="form-control" id="location"></input>
            </div>
          </div>
          <div className="col-12">
          <button onClick={submitSearch} type="button" className="event-search btn btn-dark">Submit</button>
          </div>
        </form>

        </div>
      </div>
      <div>

      </div>
      <div className="container result-list">
        { data !== null && data.length > 0  ? 
          <div>
            <Results searchResults={data}/> 
            <div className="row justify-content-center">
            <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}

              previousLinkClassName={"previous_page"}
              nextLinkClassName={"next_page"}
              disabledClassName={"disabled"}
              activeClassName={"active"}
            />
        </div>
          
          </div>
          : null }

      </div>
    </div>


  )
}

export default App;