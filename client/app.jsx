import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Results from './Results.jsx';

const App = props => {

  const [firstLoad, updateFirstLoad] = React.useState(true);
  const [keywordInput, updateKeywordInput] = React.useState('');
  const [locationInput, updateLocationInput] = React.useState('');
  const [yearInput, updateYearInput] = React.useState('');
  const [yearFormat, updateYearFormat] = React.useState('ad')
  // react-pagniate
  const [offset, changeOffset] = React.useState(0);
  const [data, changeData] = React.useState(null);
  const [perPage, changePerPage] = React.useState(5);
  const [criteriaString, changeCriteriaString] = React.useState('');
  const [pageCount, changePageCount] = React.useState(0);

  useEffect (
    () => {
      const getAllData = async () => {
        if (!firstLoad) {
          let allData = await fetch(`/events?_start=0${criteriaString}`);
          allData = await allData.json();
          changePageCount(Math.ceil(allData.length / perPage));
        }
      };
      getAllData();
    },
    [criteriaString]
  );

  useEffect (
    () => {
      console.log('cir', criteriaString)
      if (!firstLoad) {
        loadData();
      }
    },
    [pageCount, offset]
  );

  const selectYearFormat = (e) => {
    if (e.target.attributes.for.value === 'bce') {
      updateYearFormat('bce')
    } else {
      updateYearFormat('ad')
    }
  };

  const handleInput = (e) => {
    if (e.target.id === 'keyword') { updateKeywordInput(e.target.value) }
    if (e.target.id === 'year') { updateYearInput(e.target.value) }
    if (e.target.id === 'location') { updateLocationInput(e.target.value) }
  };

  const loadData = async () => {
      let response = await fetch(`/events?_start=${offset}&_end=${offset + perPage}&${criteriaString}`);
      // let response = await fetch(`/events?_start=0&${criteriaString}`)
      let data = await response.json();
      changeData(data);
  };
  
  const submitSearch = async () => {
    updateFirstLoad(false)
    let searchString = '';
    let year;
    if (yearInput.length) {
      year = yearFormat === 'bce' ? '-' + yearInput : yearInput;
      searchString += `&date=${year}`;
    }
    if (keywordInput.length) {
      searchString += `&description_like=${keywordInput}`;
    }
    if (locationInput.length) {
      searchString += `&category2_like=${locationInput}`;
    }
    console.log(searchString)
    updateYearInput('');
    updateKeywordInput('');
    updateLocationInput('');
    changeCriteriaString(searchString);
  };

  const handlePageClick = async (data) => {
    let selected = data.selected;
    await changeOffset(Math.ceil(selected * perPage));
  };

  return (
    <div>
      <div className='mt-4 title'>
        <div className="ml-4 vertical-align">Historical Events Finder</div>
      </div>
      <div className="container-flex app-container">
        <div className="row no-gutters justify-content-md-center">


          <form>
            <div className="form-group row">
              <div className="col-12 h3 mb-4">Enter as many search criteria as you like</div>
              <label className="col-sm-3 col-form-label">Keyword: </label>
              <div className="col-sm-9">
                <input onChange={handleInput} value={keywordInput} className="form-control" id="keyword"></input>
              </div>
            </div>
            <div className="form-group mt-5 row justify-content-end">
              <label className="col-sm-3 col-form-label">Year: </label>
              <div className="col-sm-3">
                <input onChange={handleInput} value={yearInput} className="form-control" id="year"></input>
              </div>
              <div className="col-sm-6">
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="ad" name="customRadioInline1" className="custom-control-input"></input>
                  <label onClick={selectYearFormat} className="custom-control-label" for="ad">AD</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="bce" name="customRadioInline1" className="custom-control-input"></input>
                  <label onClick={selectYearFormat} className="custom-control-label" for="bce">BC</label>
                </div>
              </div>
            </div>
            <div className="form-group row mt-5">
              <label className="col-sm-3 col-form-label">Location: </label>
              <div className="col-sm-9">
                <input value={locationInput} onChange={handleInput} type="email" className="form-control" id="location"></input>
              </div>
            </div>
            <div className="col-12">
              <button onClick={submitSearch} type="button" className="event-search btn btn-dark">Submit</button>
            </div>
          </form>

        </div>
      </div>

      <div className="container result-list">
        {data !== null && data.length > 0 ?
          <div>
            <Results searchResults={data} />
            <div className="mb-4 row justify-content-center">
               { pageCount > 1 ?
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
                : null
              }
            </div>

          </div>
          : <div className="h4 col-12 text-center">No search results</div>}

      </div>
    </div>


  )
}

export default App;