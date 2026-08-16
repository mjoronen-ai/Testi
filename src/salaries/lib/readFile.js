// Tiedoston luku tekstiksi. Oletus UTF-8; jos tulos sisältää korvausmerkkejä
// (Excelin vanha Windows-1252-tallennus), luetaan uudelleen sillä koodauksella.

export async function readTextFile(file) {
  const buffer = await file.arrayBuffer()
  const utf8 = new TextDecoder('utf-8').decode(buffer)
  if (!utf8.includes('�')) return { text: utf8, encoding: 'UTF-8' }

  try {
    const fallback = new TextDecoder('windows-1252').decode(buffer)
    return { text: fallback, encoding: 'Windows-1252' }
  } catch {
    return { text: utf8, encoding: 'UTF-8' }
  }
}
