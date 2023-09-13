import { Observable } from "@nativescript/core";
import { WeatherLocation } from "./api";
import { NetworkWeatherProvider } from "./networkweatherprovider";
import { MFProvider } from './mf';
import { OMProvider } from './om';
import { OWMProvider } from './owm';
import { getString } from '@nativescript/core/application-settings';

export class WeatherProvider extends Observable {
    public static readonly CACHED_DATA_PROPERTY: string = 'cachedData';
    private static _singleton: WeatherProvider;
    private networkProvider: NetworkWeatherProvider;
    private cachedData: WeatherData;

    public async getWeather(weatherLocation: WeatherLocation) {
        const requestedProviderType: ProviderType = getString('provider', 'meteofrance') as any;
        if (requestedProviderType !== this.networkProvider?.getType()) {
            this.setProvider(requestedProviderType);
        }
        const newData: WeatherData = await this.networkProvider.getWeather(weatherLocation);
        this.set(WeatherProvider.CACHED_DATA_PROPERTY, newData);
        return this.get(WeatherProvider.CACHED_DATA_PROPERTY);
    }

    public getCachedWeatherData(): WeatherData {
        return this.get(WeatherProvider.CACHED_DATA_PROPERTY);
    }

    public static getInstance(): WeatherProvider {
        if (!this._singleton) {
            this._singleton = new WeatherProvider();
        }
        return this._singleton;
    }

    private setProvider(newType: ProviderType): void{
        switch(newType) {
            case 'openmeteo':
                this.networkProvider = new OMProvider();
                break;

            case 'openweathermap':
                this.networkProvider = new OWMProvider();
                break;

            case 'meteofrance':
                this.networkProvider = new MFProvider();
                break;
        }
    }
}

