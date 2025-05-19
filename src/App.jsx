import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const latitude = 38.627;
  const longitude = -90.1994;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast`,
          {
            params: {
              latitude,
              longitude,
              daily:
                "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
              temperature_unit: "fahrenheit",
              windspeed_unit: "mph",
              timezone: "America/Chicago",
              forecast_days: 14,
            },
          }
        );
        setWeatherData(response.data);
      } catch (err) {
        setError(err.messaage);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-weather-primary to-weather-secondary px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          14-Day Forecast for St.Louis, MO
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {weatherData.daily.time.map((date, index) => (
            <div key={date} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow" >
          )
        </div>
      </div>
    </div>
  );
}
