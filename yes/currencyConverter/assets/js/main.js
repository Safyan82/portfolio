function loadJSON(currency) {
    fetch(`https://www.floatrates.com/daily/${currency?.toLowerCase()}.json`) // assuming data.json is in the same directory
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
    .then(data => {
        // Handle the JSON data
        sessionStorage.setItem("currencyList", JSON.stringify(data));
        populateDestination(data);
        populateSource(data);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
}

function populateSource(data){
    const source = document.getElementById("source");
    const sourceAmount = document.getElementById("sourceAmount").value;

    for (let key in data) {
        if (data.hasOwnProperty(key)){
            const optionElement = document.createElement('option');
            optionElement.value = data[key]?.code;
            optionElement.text = data[key]?.name;
            source.appendChild(optionElement);
        }
    }

    const destCurrency = document.getElementById("dest")
    const exchangeRate = parseFloat(sourceAmount)*parseFloat(data[destCurrency?.value?.toLowerCase()]?.rate);
    
    document.getElementById("destAmount").value=exchangeRate;
    renderDetail(sourceAmount, {...data[destCurrency?.value?.toLowerCase()], transactionAmount: exchangeRate});
    console.log(destCurrency?.value,data[destCurrency?.value?.toLowerCase()]?.rate, "destCurrency", exchangeRate)
}

function populateDestination(data){
    const source = document.getElementById("dest");

    for (let key in data) {
        if (data.hasOwnProperty(key)){
            const optionElement = document.createElement('option');
            optionElement.value = data[key]?.code;
            optionElement.text = data[key]?.name;
            source.appendChild(optionElement);
        }
    }
}

function handelSourceAmount(event){
    const sourceAmount = event.target.value;
    if(sourceAmount<1 || sourceAmount>1000000){
        const message = document.createElement("div");
        message.innerHTML="<b>Source Currency must be between 1 to 1,000,000<b>";
        message.style.color="red";

        const detailsContainer = document.getElementById("detailsContainer")
        detailsContainer.textContent="";
        detailsContainer.appendChild(message);

        document.getElementById("destAmount").value=null;
        return;
    }
    const destCurrency = document.getElementById("dest").value;
    const currencyList = JSON.parse(sessionStorage.getItem('currencyList'));
    let currencyDetails = {};
    for (let key in currencyList) {
        if (currencyList.hasOwnProperty(key)){
            if(destCurrency==currencyList[key]?.code){
                currencyDetails = {
                    ...currencyList[key],
                    transactionAmount: parseFloat(sourceAmount)*currencyList[key]?.rate
                }
                document.getElementById("destAmount").value = parseFloat(sourceAmount)*currencyList[key]?.rate;

            }

        }
    }
    renderDetail(sourceAmount, currencyDetails);

}

function handelSourceChange(event){
    loadJSON(event.target.value);
}



function handelDest(event){
    const sourceAmount = document.getElementById("sourceAmount").value;
    const destCurrency = document.getElementById("dest").value;
    const currencyList = JSON.parse(sessionStorage.getItem('currencyList'));
    let currencyDetails = {};
    for (let key in currencyList) {
        if (currencyList.hasOwnProperty(key)){
            if(destCurrency==currencyList[key]?.code){
                currencyDetails = {
                    ...currencyList[key],
                    transactionAmount: parseFloat(sourceAmount)*currencyList[key]?.rate
                }
                document.getElementById("destAmount").value = parseFloat(sourceAmount)*currencyList[key]?.rate;

            }

        }
    }

    renderDetail(sourceAmount, currencyDetails);

}

function renderDetail(sourceAmount, currencyDetails){
    console.log(sourceAmount, "sourceAmount", currencyDetails)
    const detailsContainer = document.getElementById("detailsContainer")
    if(sourceAmount<1){
        detailsContainer.textContent="";
        return;
    }
    detailsContainer.textContent="";

    const sourceCurrency = document.getElementById("source")
    const destCurrency = document.getElementById("dest")

    const header = document.createElement("h3");
    header.innerText="Exchange Details";
    header.style.color="#18d26e";
    detailsContainer.appendChild(header);

    const divider = document.createElement("hr");
    detailsContainer.appendChild(divider);
    
    const sourceDetail = document.createElement("div");
    sourceDetail.innerText = `Source currency : ${sourceCurrency?.value} (${sourceCurrency?.options[sourceCurrency?.selectedIndex].innerText})`;
    detailsContainer.appendChild(sourceDetail);
    
    const destinationDetail = document.createElement("div");
    destinationDetail.innerText = `Destination currency : ${destCurrency?.value} (${destCurrency?.options[destCurrency?.selectedIndex].innerText})`;
    detailsContainer.appendChild(destinationDetail);
    
    const exchangeRate = document.createElement("div");
    exchangeRate.innerText = `Current Exchange rate : ${"1 "+ sourceCurrency?.value} = ${currencyDetails?.rate+" "+destCurrency?.options[destCurrency?.selectedIndex].innerText}`;
    detailsContainer.appendChild(exchangeRate);
    
    const time = document.createElement("div");
    time.innerText = `Calculation Timestamp : ${new Intl.DateTimeFormat('en-GB', { timeZone: 'GMT', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format( Date.parse(currencyDetails?.date))}`;
    detailsContainer.appendChild(time);
    
    const transaction = document.createElement("div");
    transaction.innerText = `Amount of transaction : ${sourceAmount +" "+ sourceCurrency?.value} = ${currencyDetails?.transactionAmount+" "+currencyDetails?.code}`;
    detailsContainer.appendChild(transaction);


    

}

