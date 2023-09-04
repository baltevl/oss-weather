import { ApplicationSettings } from "@nativescript/core";

export class GadgetbridgeObserver {
    private static _singleton: GadgetbridgeObserver = null;


    private constructor() {
        //TODO register with WeatherProvider
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
