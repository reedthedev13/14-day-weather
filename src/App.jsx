import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiRaindrop,
  WiThermometer,
} from "react-icons/wi";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);

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
                "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
              temperature_unit: "fahrenheit",
              windspeed_unit: "mph",
              timezone: "America/Chicago",
              forecast_days: 14,
            },
          }
        );
        setWeatherData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (code) => {
    const iconSize = "text-3xl";
    if (code >= 0 && code <= 3)
      return <WiDaySunny className={`${iconSize} text-yellow-500`} />;
    if (code >= 45 && code <= 57)
      return <WiCloudy className={`${iconSize} text-gray-500`} />;
    if (code >= 61 && code <= 67)
      return <WiRain className={`${iconSize} text-blue-500`} />;
    if (code >= 71 && code <= 86)
      return <WiSnow className={`${iconSize} text-blue-200`} />;
    if (code >= 95 && code <= 99)
      return <WiThunderstorm className={`${iconSize} text-purple-500`} />;
    return <WiDaySunny className={iconSize} />;
  };

  const getWeatherDescription = (code) => {
    const weatherMap = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Freezing fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Heavy drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Light showers",
      81: "Moderate showers",
      82: "Violent showers",
      85: "Snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Severe thunderstorm",
    };
    return weatherMap[code] || "Unknown weather";
  };

  const convertTemp = (temp) => {
    if (!isCelsius) return temp;
    return ((temp - 32) * (5 / 9)).toFixed(1);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8 animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 bg-white/20 rounded-full w-64 mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white/20 rounded-xl backdrop-blur-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-pink-900 p-8 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-2xl font-bold">Weather Data Unavailable</p>
          <p className="opacity-80">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-white text-center">
            🌤️ St. Louis 14-Day Forecast
          </h1>
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
          >
            Switch to {isCelsius ? "°F" : "°C"}
          </button>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-7 gap-4 min-w-[800px]">
            {weatherData.daily.time.map((date, index) => (
              <div
                key={date}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl hover:bg-white/20 transition-all group"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-center mb-2">
                    {getWeatherIcon(weatherData.daily.weathercode[index])}
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {format(parseISO(date), "EEE")}
                    <span className="block text-sm text-white/70">
                      {format(parseISO(date), "MMM d")}
                    </span>
                  </h3>

                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-white/90">
                      <WiThermometer className="text-xl text-red-400" />
                      <span className="font-medium">
                        {convertTemp(
                          weatherData.daily.temperature_2m_max[index]
                        )}
                        °{isCelsius ? "C" : "F"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-white/90">
                      <WiThermometer className="text-xl text-blue-400" />
                      <span className="font-medium">
                        {convertTemp(
                          weatherData.daily.temperature_2m_min[index]
                        )}
                        °{isCelsius ? "C" : "F"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/90">
                      <WiRaindrop className="text-xl text-blue-300" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>
                            {
                              weatherData.daily.precipitation_probability_max[
                                index
                              ]
                            }
                            %
                          </span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 transition-all"
                            style={{
                              width: `${weatherData.daily.precipitation_probability_max[index]}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-white/80 capitalize">
                    {getWeatherDescription(
                      weatherData.daily.weathercode[index]
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-white/60 text-sm">
          Data provided by Open-Meteo.com • Updated{" "}
          {format(new Date(), "h:mm a")}
        </div>
      </div>
    </div>
  );
}
