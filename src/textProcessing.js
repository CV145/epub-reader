// textProcessing.js

/**
 * Extracts paragraphs from HTML content.
 * @param {string} htmlContent - The HTML content of the eBook chapter.
 * @returns {string[]} Array of paragraphs.
 */
export function processHtmlToParagraphs(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    return Array.from(paragraphs).map(p => p.textContent.trim()).filter(text => text.length > 0);
  }
  
  /**
   * Extracts paragraphs from XML content.
   * @param {string} xmlContent - The XML content of the eBook chapter.
   * @returns {string[]} Array of paragraphs.
   */
  export function processXmlToParagraphs(xmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    const paragraphs = doc.querySelectorAll('p');
    return Array.from(paragraphs).map(p => p.textContent.trim()).filter(text => text.length > 0);
  }
  
  /**
   * Processes text with custom tags or structures.
   * @param {string} content - The content of the eBook chapter with custom tags.
   * @param {string} tag - Custom tag to target for paragraphs.
   * @returns {string[]} Array of paragraphs.
   */
  export function processCustomTagToParagraphs(content, tag) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const paragraphs = doc.querySelectorAll(tag);
    return Array.from(paragraphs).map(p => p.textContent.trim()).filter(text => text.length > 0);
  }
  



/*
Different scenarios...
Processing Paragraphs from HTML: A function to extract paragraphs from HTML content.
Processing Paragraphs from XML: A function to handle XML formatted eBook content.
Processing Text with Custom Tags: A function to handle eBooks that use custom tags or structures.
*/