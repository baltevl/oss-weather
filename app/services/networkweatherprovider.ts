import { WeatherLocation } from "./api";

export interface NetworkWeatherProvider {
    getWeather(weatherLocation: WeatherLocation);
    getType(): ProviderType;
}
