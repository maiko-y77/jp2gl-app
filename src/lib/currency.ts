export async function fetchExchangeRateJPYtoCAD(): Promise<number> {
  const apiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/JPY`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.conversion_rates?.CAD || 0
  } catch (err) {
    console.error("為替APIエラー:", err)
    return 0
  }
}