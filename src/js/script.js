document.addEventListener('DOMContentLoaded', function() {
  setupQuoteButton();
});

document.addEventListener('DOMContentLoaded', function () {
  getDailyQuote();
});


function getDailyQuote() {
  const today = new Date().toISOString().split('T')[0]; // '2025-05-18'

  const stored = localStorage.getItem('daily-quote');
  const storedDate = localStorage.getItem('quote-date');

  if (stored && storedDate === today) {
    displayQuote(JSON.parse(stored));
    return;
  }

  // Fetch a new one and store it for the day
  fetch('https://quotes-api-self.vercel.app/quote')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('daily-quote', JSON.stringify(data));
      localStorage.setItem('quote-date', today);
      displayQuote(data);
    })
    .catch(error => {
      console.error('Error fetching daily quote:', error);
    });
}

function displayQuote(data) {
  console.log("Quote of the Day:", data.quote, "—", data.author);

  // Optionally update DOM here
  const container = document.getElementById('daily-quote');
  if (container) {
    container.innerHTML = `
      <div>"${data.quote}"</div>
      <div style="margin-top: 1rem; color: #FFF9B0 ;
       font-style: italic;">— ${data.author}</div>
    `;
  }
}




function setupQuoteButton() {
  const button = document.getElementById('quotebtn');
  const quoteContent = document.getElementById('quote-content');
  const loadingIndicator = document.getElementById('loading');
  
  button.addEventListener("click", function() {
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Fetch quote from API
    fetch('https://quotes-api-self.vercel.app/quote')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Get quote and author, ensuring special characters are preserved
        const quote = data.quote;
        const author = data.author;
        
        // Create formatted quote with styled author
        // Using separate elements to avoid issues with quote characters
        const quoteText = document.createElement('div');
        quoteText.textContent = `"${quote}"`;
        
        const authorText = document.createElement('span');
        authorText.textContent = `— ${author}`;
        authorText.style.display = 'block';
        authorText.style.marginTop = '1rem';
        authorText.style.fontSize = '1.2rem';
        authorText.style.color = 'var(--gray-600)';
        authorText.style.fontStyle = 'italic';
        
        // Add a slight delay to make the loading animation visible
        setTimeout(() => {
          // Clear previous content
          quoteContent.innerHTML = '';
          
          // Add the new elements
          quoteContent.appendChild(quoteText);
          quoteContent.appendChild(authorText);
          
          // Hide loading indicator
          loadingIndicator.style.display = 'none';
          
          // Add animation effect to the new quote
          quoteContent.style.opacity = '0';
          setTimeout(() => {
            quoteContent.style.transition = 'opacity 0.5s ease';
            quoteContent.style.opacity = '1';
          }, 50);
        }, 800);
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
        
        // Show error message
        quoteContent.textContent = 'Sorry, something went wrong. Please try again later.';
        loadingIndicator.style.display = 'none';
      });
  });
  
  // Add animation for the button
  button.addEventListener('mouseenter', function() {
    this.style.background = 'linear-gradient(135deg, #4263eb, #7950f2)';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.background = 'linear-gradient(135deg, #1890ff, #4263eb)';
  });
  
  // Initialize with a random quote
  setTimeout(() => {
    button.click();
  }, 500);
}