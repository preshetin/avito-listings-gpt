(function() {

const propListSel = '#app > div > buyer-location > div > div > div > div.styles-singlePageWrapper-E2tBI > div > div.index-map-tUPTm > div > div > div.side-block-root-S2Oo9 > div > div.styles-root-CJb8Z > div > div > div'

  const parentDiv = document.querySelector(propListSel);
  if (parentDiv) {
    console.log('Parent div:', parentDiv);

    // loop though all children of parent div and console log them
    const children = parentDiv.children;
    console.log('Children:', children);
    for (let i = 0; i < children.length; i++) {
      const meta = children[i].querySelector('div > div > meta');  
      const description = meta.getAttribute('content');
      addMark(children[i], '✅');
      console.log('Description:', description);
    }


    function addMark(listing, mark) {
      const markElement = document.createElement('span');
      markElement.style.fontSize = '25px';
      markElement.innerText = mark;
      listing.appendChild(markElement);
    }

    
  } else {
    console.log('Parent div not found');
  }
  
})();