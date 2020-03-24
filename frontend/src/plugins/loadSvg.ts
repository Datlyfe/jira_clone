export const loadSprites = () => {
  const xmlFile = 'sprite.xml'
  const loadXML = new XMLHttpRequest()
  loadXML.onload = () => {
    const xmlString = loadXML.responseText
    const parser = new DOMParser()
    const mySpritesDoc = parser.parseFromString(xmlString, 'text/xml')
      .documentElement
    const addSprites = mySpritesDoc.childNodes
    for (let k = 0; k < addSprites.length; k++) {
      const sprite = addSprites.item(k).cloneNode(true)
      document.getElementById('spriteDefs')?.appendChild(sprite)
    }
  }
  loadXML.open('GET', window.location.origin + '/' + xmlFile, true)
  loadXML.send()
}
