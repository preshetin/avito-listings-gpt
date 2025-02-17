function execute() {
  const propListSel = '#app > div > buyer-location > div > div > div > div.styles-singlePageWrapper-E2tBI > div > div.index-map-tUPTm > div > div > div.side-block-root-S2Oo9 > div > div.styles-root-CJb8Z > div > div > div';

  const parentDiv = document.querySelector(propListSel);
  if (parentDiv) {
    console.log('Parent div:', parentDiv);

    // loop though all children of parent div and console log them
    const children = parentDiv.children;
    console.log('Children:', children);
    for (let i = 0; i < children.length; i++) {
      const meta = children[i].querySelector('div > div > meta');
      const description = meta.getAttribute('content');

      const aTag = children[i].querySelector('div > div > div > div.body-titleRow-e63gf > div > a');
      listingLink = aTag.getAttribute('href');

      const listingUrl = `https://www.avito.ru${listingLink}`;

      analyseListing(listingUrl).then(res => {
        switch (res.analysis.males) {
          case 'true':
            addMark(children[i], '✅');
            break;
          case 'false':
            addMark(children[i], '❌');
            break;
          case 'unknown':
            addMark(children[i], '🤷🏻‍♂️');
            break;
        }

      }).catch(error => {
        console.error('Error:', error);
      });
    }

    function addMark(listing, mark) {
      const markElement = document.createElement('span');
      markElement.style.fontSize = '25px';
      markElement.innerText = mark;
      listing.appendChild(markElement);
    }

    function analyseListing(listingUrl) {
      const apiUrl = `https://wb-tg-bot.preshetin.com/api/v1/avito-listing?url=${encodeURIComponent(listingUrl)}`;
      // const apiUrl = `http://127.0.0.1:8000/api/v1/avito-listing?url=${encodeURIComponent(listingUrl)}`;
      return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
          console.error('API request failed:', error);
          return { analysis: { males: 'unknown' } };
        });
    }
  } else {
    console.log('Parent div not found');
  }
}

execute();
