import React from 'react';

const Results = (props) => {
  
  const formatDate = (date) => {
    let numericYear = Number(date.split('/')[0]);
    return numericYear < 0 ? Math.abs(numericYear) + ' BCE' : numericYear + ' AD';
  }
  
  return (
    <div>
      <div className="h2">Results</div>
      <div className="row">
        {
           props.searchResults.map(event => {
            return (
              <div className="col-10 mb-3">
                <div className="row">
                  <div className="col-12">{`${event.category2}, ${formatDate(event.date)}`} </div>
                </div>
                <div className="row">
                  {/* <div className="col-2">Description:</div> */}
                  <div className="col-12">{event.description} </div>
                </div>
                
              </div>
            )
          })
        }
      </div>
    </div>
  ) 
}

export default Results;