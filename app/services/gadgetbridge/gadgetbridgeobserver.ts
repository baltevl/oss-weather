import { PropertyChangeData } from "@akylas/nativescript/data/observable/index";
import { ApplicationSettings, Observable } from "@nativescript/core";
import { WeatherProvider } from "../weatherprovider";
import { GadgetbridgeBroadcaster } from "./gadgetbridgebroadcaster";

export class GadgetbridgeObserver {
    private static _singleton: GadgetbridgeObserver = null;
    private readonly _broadcaster: GadgetbridgeBroadcaster;


    private constructor() {
        this._broadcaster = new GadgetbridgeBroadcaster();
        const provider: WeatherProvider =  WeatherProvider.getInstance();
        provider.on(Observable.propertyChangeEvent, (event) => {
            if (event?.propertyName === WeatherProvider.CACHED_DATA_PROPERTY)
                this._broadcaster.broadcast(provider.getCachedWeatherData())
        })
        this._broadcaster.broadcast(provider.getCachedWeatherData())
    }

    private static setSingleton(): GadgetbridgeObserver {
        if (!GadgetbridgeObserver._singleton)
            GadgetbridgeObserver._singleton = new GadgetbridgeObserver();
        return GadgetbridgeObserver._singleton;
    }

    private static clearSingleton(): void {
        GadgetbridgeObserver._singleton = null;
    }

    public static settingsChangeHandler(): void {
        if (ApplicationSettings.getBoolean('gadgetbridge_broadcasting')) {
            GadgetbridgeObserver.setSingleton();
        } else {
            GadgetbridgeObserver.clearSingleton();
        }
    }
}
