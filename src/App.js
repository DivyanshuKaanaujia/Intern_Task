import "./App.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const CompanyList = () => {
  const [sectorName, setSectorName] = useState('');
  const [companies, setCompanies] = useState([]);
  const[allCompanies,setAllCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const makeUnique = (arr) => {
    let unique = [];
    for (var i = 0; i < arr.length; i++) {
      if (unique.findIndex((company) => company.sectorname === arr[i].sectorname) === -1) {
        unique.push(arr[i]);
      }
    }
    return unique;
  };


  useEffect(() => {


    axios.get('https://www.stocksemoji.com/api/companymaster')
      .then((response) => {
        setAllCompanies(response.data.data)
        const uniqueCompanies = makeUnique(response.data.data);
        setCompanies(uniqueCompanies);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (sectorName) {
      const filtered = allCompanies.filter(
        (company) => company.sectorname === sectorName
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  }, [sectorName, allCompanies]);

  const handleSectorChange = (e) => {
    setSectorName(e.target.value);
  };

  return (
    <div>
      <h1 className="heading">Company Finder</h1>
      <div className="dropDown">
        <label style={{padding:'0 5px 0 0'}}>Select a Sector:  </label>
        <select style={{borderRadius:'10px'}} value={sectorName} onChange={handleSectorChange}>
          <option value="">-- Select Sector --</option>
          {companies.map((company) => (
            <option key={company.co_code} value={company.sectorname}>
              {company.sectorname}
            </option>
          ))}
        </select>
      </div>
      <div>
        {filteredCompanies.length > 0 ? (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">Industry Code</th>
                <th scope="col">Industry Name</th>
                <th scope="col">Category Name</th>
                <th scope='col'>Company Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.co_code}>
                  <td>{company.industrycode}</td>
                  <td>{company.industryname}</td>
                  <td>{company.categoryname}</td>
                  <td>{company.companyname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{padding:"0 0 0 4px"}}>No companies found in the selected sector.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
