function addBuffPercentage() {
    console.log('addBuffPercentage called');

    // fetch the data
    fetch('http://api.skinpricer.com/lowest_offer.json')
        .then(response => response.json())
        .then(data => {

        const images = document.querySelectorAll('img');
    
        // loop through each image
        images.forEach(image => {
            
            const altText = image.getAttribute('alt');

            if (data[altText]) {
            
                // find the grandparent of the image
                const grandparent = image.parentElement.parentElement;

                // find the last div with class "c-asset__header" before the grandparent element
                let prevDiv = grandparent.previousElementSibling;
                while (prevDiv && !prevDiv.classList.contains('c-asset__header')) {
                    prevDiv = prevDiv.previousElementSibling;
                }

                let p = prevDiv.querySelector('.buff-percentage');

                if (!p) {
                    // create a new paragraph and add it to the div
                    p = document.createElement('p');
                    p.classList.add('buff-percentage');
                    prevDiv.appendChild(p);
                }
                
                let dmarketPrice;

                try {
                    dmarketPrice = parseFloat(prevAssetDiv.innerText.match(/\$((\d\s)?\d{1,3}(\.\d{2})?)/)[1].replace(/\s/g, ''));
                }
                catch(error) {
                    console.log('${altText} not rendered');
                }
                
                const price = data[altText].USD;
                let buffPercentage = (dmarketPrice / price) * 100;
                p.textContent = buffPercentage.toFixed(2);
            
                if (buffPercentage >= 100) {
                    p.classList.add('red');
                    p.classList.remove('orange', 'green');
                }
                else if (buffPercentage < 100 && buffPercentage > 95) {
                    p.classList.add('orange');
                    p.classList.remove('red', 'green');
                }
                else {
                    p.classList.add('green');
                    p.classList.remove('red', 'orange');
                }
            }
        });
    })
    .catch(error => console.error('Failed to load data:', error));
}
  
addBuffPercentage();
  
// observe the body for changes and call the function with a delay of 300 ms after the last observed mutation
let timeoutId;
const observer = new MutationObserver(mutationsList => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(addBuffPercentage, 300);
});
observer.observe(document.body, { subtree: true, childList: true });