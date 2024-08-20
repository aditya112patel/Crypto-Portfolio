import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './coinlist.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Coinlist = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState();
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [watchlist, setwatchlist] = useState([]);
  

  useEffect(() => {
    // Fetch data from CoinGecko API
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    })
    .then(response => {
      setCryptoData(response.data);
      const bitcoin = response.data.find(coin => coin.id === 'bitcoin');
      if (bitcoin) {
        setSelectedCoin(bitcoin);
        fetchCoinDetails(bitcoin.id);
      }
    })
    .catch(error => {
      console.error('Error fetching data from CoinGecko API:', error);
    });
  }, []);

  const handleclick = (coin) => {
    // I want to display coin data n current div when clicked
    setSelectedCoin(coin);
    fetchCoinDetails(coin.id);
    
  }

  const fetchCoinDetails = (coinId) => {
    setLoadingDetails(true);
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(`https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=2&interval=daily&precision=2`, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
    axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    })
    .then(response => {
      setCoinDetails(response.data);
      let blob=response.data;
      saveAs(blob, "download.txt");
      setLoadingDetails(false);
    })
    .catch(error => {
      console.error('Error fetching coin details from CoinGecko API:', error);
      setLoadingDetails(false);
    });
  };


  const getChartData = () => {
    if (!coinDetails) return {};

    const labels = coinDetails.market_data.sparkline_7d.price.map((_, index) => ` ${index+1}`);
    const data = {
      labels,
      datasets: [
        {
          label: `${selectedCoin.name} Price(6months)`,
          data: coinDetails.market_data.sparkline_7d.price,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.2,
        },
      ],
    };
    return data;
  };


  
  const addtowatch =(coin)=> {
    console.log(coin);
    if (!watchlist.some(item => item.id === coin.id)) {
        setwatchlist([...watchlist, coin]);
      }

  }

  const removefromwatch = (coinId) => {
    setwatchlist(watchlist.filter(item => item.id !== coinId));
  };
  


  return (
    <div className='mmm'>
        <div className='lefttemp'>
        {selectedCoin && (
        <div className="coin-details">
          
          {loadingDetails ? (
            <div className='rrrr'> 
                <p className='loading'>Loading details...</p>
            </div>

          ) : coinDetails ? (
            <div className='uppercont'>
                <div className='detail'>
                    <h3 className='title_'>{selectedCoin.name}</h3>
                    <img className='logoo' src={coinDetails.image.small.toLocaleString()} alt="" />
                    
                    <p>Current Price: ${coinDetails.market_data.current_price.usd.toLocaleString()}</p>
                    <p>Market Cap: ${coinDetails.market_data.market_cap.usd.toLocaleString()}</p>
                    {/* <p>24h High: ${coinDetails.market_data.high_24h.usd.toLocaleString()}</p>
                    <p>24h Low: ${coinDetails.market_data.low_24h.usd.toLocaleString()}</p> */}
                    {/* Display a simple line chart of price using the sparkline data */}
                    
                </div>   
                
                <div className="sparkline-chart">
                <h4 className='pricechart'>Price Chart</h4>
                    <Line data={getChartData()} />
                </div>
            </div>
          ) : (
            <p>No details available.</p>
          )}
          </div>
        )}
        <div className='loww'>
        <table className='tablemain'>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>   
            <th>24h</th>
            <th>24h Volume</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((coin, index) => (
            <tr>
              <td>{index + 1}</td>
              <td  key={coin.id} onClick={() => handleclick(coin)}>{coin.name} ({coin.symbol.toUpperCase()})</td>
              <td>${coin.current_price.toLocaleString()}</td>     
              <td>{coin.price_change_percentage_24h?.toFixed(2)}%</td>   
              <td>${coin.total_volume.toLocaleString()}</td>
              <td onClick={(e) => { e.stopPropagation(); addtowatch(coin); }}><button className='buttonadd'>ADD</button></td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
        </div>  
      <div className='watch'>
         <div>
             <h3 className='watchhead'>MY WATCHLIST</h3>
         </div>
        <div className='watchlist' >
           
            <table className='tab'>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>              
          </tr>
        </thead>
        <tbody>
          {watchlist.map((coin, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{coin.name} ({coin.symbol.toUpperCase()})</td>
              <td>${coin.current_price.toLocaleString()}</td>        
              <td  onClick={(e) => { e.stopPropagation(); removefromwatch(coin.id);}} ><button className='buttonadd'>REMOVE</button></td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    </div>
  );
};

export default Coinlist;
