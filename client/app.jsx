import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import SearchTerm from './SearchTerm.jsx';
import Results from './Results.jsx';

const App = props => {
  const [dropdown, toggleDropdown] = React.useState(false);
  const [inputPlaceholder, changePlaceholder] = React.useState('Select a search method first');
  const [searchCriteria, setSearchCriteria] = React.useState(null);
  const [userInput, updateUserInput] = React.useState(null);
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

  const handleSetSearch = (term) => {
    changePlaceholder(searchTerms[term].placeholder)
    toggleDropdown(false)
    setSearchCriteria(searchTerms[term].filter)
  }

  const handleInput = (e) => {
    updateUserInput (e.target.value)
  }

  const loadData = async () => {
    let response = await fetch(`/events?_start=${offset}&_end=${offset+perPage}&${searchCriteria}_like=${userInput}`)
    let data = await response.json();
    await changeData(data);
  }

  const submitSearch = async () => {
    let allData = await fetch(`/events?${searchCriteria}_like=${userInput}`);
    allData = await allData.json();
    await changePageCount(Math.ceil(allData.length / perPage));
    await loadData();
  }

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
    <div className="m-3">
      <div className="container-flex">
        <div className="row no-gutters align-items-center">
          <div className="col-3 dropdown">



            <button onClick={handleDropdown} className="dropbtn">Search method &#8744;</button>
            
            {
              dropdown ?
                <div id="myDropdown" className="dropdown-content">
                  {
                    Object.keys(searchTerms).map(term => {
                      return <SearchTerm key={term} handleSetSearch={handleSetSearch} searchTerm={term}/>
                    })
                  }
                  
                </div> 
                :
                null
            }
          </div>
          <div className="col-4">
          <input disabled={searchCriteria === null ? true : false} className="event-search" onChange={handleInput}  type="text" placeholder={inputPlaceholder}></input>
          </div>
          <div className="col-2">
          <button onClick={submitSearch} type="button" className="event-search btn btn-dark">Submit</button>
          </div>
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