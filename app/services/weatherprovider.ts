import { Observable } from "@nativescript/core";
import { WeatherLocation } from "./api";
import { NetworkWeatherProvider } from "./networkweatherprovider";
import { MFProvider } from './mf';
import { OMProvider } from './om';
import { OWMProvider } from './owm';
import { getString } from '@nativescript/core/application-settings';

export class WeatherProvider extends Observable {
    private static _singleton: WeatherProvider;
    private networkProvider: NetworkWeatherProvider;
    private cachedData: WeatherData;

    public async getWeather(weatherLocation: WeatherLocation) {
        const requestedProviderType: ProviderType = getString('provider', 'meteofrance') as any;
        if (requestedProviderType !== this.networkProvider?.getType()) {
            this.setProvider(requestedProviderType);
        }
        this.cachedData = this.networkProvider.getWeather(weatherLocation);
        //TODO notify observers
        return this.cachedData;
    }

    public getCachedWeatherData(): WeatherData {
        return this.cachedData;
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

