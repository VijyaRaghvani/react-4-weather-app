import { useState } from 'react'
export default function App() {
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const search = async () => {
    if (!city.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).json()
      if (!g.results) throw new Error('City not found')
      const { name, country, latitude, longitude } = g.results[0]
      const w = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)).json()
      setData({ name, country, current: w.current, daily: w.daily })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }
  return (
    <div className="box">
      <h1>Weather App</h1>
      <div className="row">
        <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="City name (e.g. Vadodara)" />
        <button onClick={search}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="err">{error}</p>}
      {data && (<>
        <h2>{data.name}, {data.country}</h2>
        <h1>{data.current.temperature_2m}°C</h1>
        <p>Humidity: {data.current.relative_humidity_2m}% · Wind: {data.current.wind_speed_10m} km/h</p>
        <h3>7-day forecast</h3>
        {data.daily.time.map((d, i) => (
          <div className="top" key={d}><span>{d}</span><span>{data.daily.temperature_2m_min[i]}° / {data.daily.temperature_2m_max[i]}°</span></div>))}
      </>)}
    </div>
  )
}
