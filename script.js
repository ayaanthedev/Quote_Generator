function setupQuoteButton() {

  const button = document.getElementById('quotebtn');
  

  button.addEventListener("click", function() {

    fetch('https://quotes-api-self.vercel.app/quote')
      .then(response => response.json())
      .then(data => {

        const formattedQuote = `${data.quote} ---${data.author}`;
        

        document.getElementById('quote').textContent = formattedQuote;
      })
      .catch(error => {

        console.error(error);
      });
  });
}

setupQuoteButton();