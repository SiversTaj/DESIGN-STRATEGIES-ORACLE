import React, { useState, useEffect } from "react";
import "./App.css";
import {
  storingStocks,
  StockPrice,
  StockVolume,
} from "./blockchain/contractSetup";

function App() {
  const [search, setSearch] = useState("BA");
  const [stockList, setStockList] = useState([]);
  // const [symbol, SetSymbol] = React.useState("");
  const [result, getResult] = React.useState("");

  useEffect(() => {
    fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=10BTH6S1ICPBGAKI`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.bestMatches) {
          setStockList(data.bestMatches);
        } else {
          setStockList([]);
        }
      })
      .catch((e) => console.log(e));
  }, [search]);

  const addStockToBlockchain = async (result) => {
    if (result) {
      fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${result["1. symbol"]}&apikey=10BTH6S1ICPBGAKI`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data["Global Quote"]) {
            storingStocks(
              data["Global Quote"]["01. symbol"],
              parseInt(data["Global Quote"]["05. price"]),
              parseInt(data["Global Quote"]["06. volume"])
            );
          } else {
            alert("There is some Problem.");
          }
        })
        .catch((e) => alert(e));
    }
  };

  const getStockPrice = async () => {
    const receipt = await StockPrice(search);
    console.log(receipt);
    getResult(receipt);
  };
  const getStockVolume = async () => {
    const receipt = await StockVolume(search);
    getResult(receipt);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your symbol"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn btn-primary" onClick={getStockPrice}>
        GetPrice
      </button>{" "}
      <button className="btn btn-primary" onClick={getStockVolume}>
        GetVolume
      </button>
      <span>{result}</span>
      {stockList.length > 0 &&
        stockList.map((result) => {
          return (
            <ul>
              <li>
                {result["1. symbol"]} &nbsp; {result["2. name"]}
              </li>
              <button
                className="btn btn-primary"
                onClick={() => addStockToBlockchain(result)}
              >
                SetStock (Blockchain)
              </button>
            </ul>
          );
        })}
    </div>
  );
}

export default App;
