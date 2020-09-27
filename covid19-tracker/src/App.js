import React, { useState, useEffect } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //https://disease.sh/v3/covid-19/countries

  //fetch worldwide data
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then((data) => {
        //All of the data from country response
        setCountryInfo(data);

      });

  }, [])

  useEffect(() => {

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({

            name: country.country,
            value: country.countryInfo.iso2
          }
          ));

          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);

        });
    };
    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[Country_code]

    await fetch(url)
      .then(response => response.json())
      .then((data) => {
        //All of the data from country response
        setCountryInfo(data);
        console.log(data);
      });
  }

  return (
    <div className="app">
      <div className="app__left">
        <h1>COVID-19 TRACKER</h1>
        <div className="app__header">
          <FormControl className="app__dropdown">

            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>

              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>

                ))
              }

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus cases"
            onClick={(e) => setCasesType("cases")}
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />

          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />

          <InfoBox title="Deaths"
            onClick={(e) => setCasesType("deaths")}
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths} />

        </div>

        <Map />


      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
