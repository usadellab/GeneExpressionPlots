export function getSVGString(svgNode: Element): string {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  const cssStyleText = getCSSStyles(svgNode);

  const styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  styleElement.innerHTML = cssStyleText;
  const refNode = svgNode.hasChildNodes() ? svgNode.children[0] : null;
  svgNode.insertBefore(styleElement, refNode);

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;
}

function getCSSStyles(parentElement: Element): string {
  const selectorTextArr: string[] = [];

  // Add Parent element Id and Classes to the list
  selectorTextArr.push('#' + parentElement.id);
  for (let c = 0; c < parentElement.classList.length; c++)
    if (!contains('.' + parentElement.classList[c], selectorTextArr))
      selectorTextArr.push('.' + parentElement.classList[c]);

  // Add Children element Ids and Classes to the list
  const nodes = parentElement.getElementsByTagName('*');
  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i].id;
    if (!contains('#' + id, selectorTextArr)) selectorTextArr.push('#' + id);

    const classes = nodes[i].classList;
    for (let c = 0; c < classes.length; c++)
      if (!contains('.' + classes[c], selectorTextArr))
        selectorTextArr.push('.' + classes[c]);
  }

  // Extract CSS Rules
  let extractedCSSText = '';
  for (let i = 0; i < document.styleSheets.length; i++) {
    const s = document.styleSheets[i];

    try {
      if (!s.cssRules) continue;
    } catch (e) {
      if (e.name !== 'SecurityError') throw e; // for Firefox
      continue;
    }

    const cssRules = s.cssRules;
    for (let r = 0; r < cssRules.length; r++) {
      const cssStyleRule = cssRules[r] as CSSStyleRule;
      if (contains(cssStyleRule.selectorText, selectorTextArr))
        extractedCSSText += cssRules[r].cssText;
    }
  }

  return extractedCSSText;
}

function contains(str: string, arr: string[]): boolean {
  return arr.indexOf(str) === -1 ? false : true;
}
