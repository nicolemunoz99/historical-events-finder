import React from 'react';
import SearchTerm from './SearchTerm.jsx';

const App = props => {
  const [dropdown, toggleDropdown] = React.useState(true);
  const [inputPlaceholder, changePlaceholder] = React.useState('<-- select a search method first');
  const [searchCriteria, setSearchCriteria] = React.useState(null);
  const [userInput, updateUserInput] = React.useState(null);
  const [searchResults, updateSearchResults] = React.useState(null);

  // TO DO: if input is null, make input field in active


  const handleDropdown = (e) => {
    toggleDropdown(!dropdown)
  }

  const handleSetSearch = (term) => {
    changePlaceholder(searchTerms[term])
    toggleDropdown(false)
    setSearchCriteria(term.toLowerCase())
  }

  const handleInput = (e) => {
    updateUserInput (e.target.value)
  }

  const submitSearch = () => {
    console.log(searchCriteria, userInput)
    fetch(`/events?${searchCriteria}_like=${userInput}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
    })
  }

  const searchTerms = {
    Date: 'Enter a date followed by AD or BCE...',
    Description: 'Search by description keywords...',
    Location: 'Search by location of event...'
  }

  return (
    <div className="m-3">
      <div className="container-flex">
        <div className="row align-items-center">
          <div className="col-3 dropdown">
            <button onClick={handleDropdown} className="dropbtn">Search method</button>
            
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
          <div className="col-8">
          <input onChange={handleInput} class="form-control form-control-lg" type="text" placeholder={inputPlaceholder}></input>
          <button onClick={submitSearch}>Search</button>
          </div>
        </div>
      </div>
    </div>


  )
}

export default App;