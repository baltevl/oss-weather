import { getString } from "@nativescript/core/application-settings/index";
import { Utils } from "@nativescript/core";
import { WeatherLocation } from "../api";
import { celciusToKelvin } from "~/helpers/formatter"


export class GadgetbridgeBroadcaster {

    public constructor() {}

    public broadcast(data: WeatherData) {
        if (!data)
            return
        const Intent = android.content.Intent;
        const context = Utils.android.getApplicationContext();
        const intent = new Intent("nodomain.freeyourgadget.gadgetbridge.ACTION_GENERIC_WEATHER");
        intent.putExtra("WeatherJson", this.WeatherDataToGadgetbridgeJSON(data));
        intent.setPackage("nodomain.freeyourgadget.gadgetbridge")
        context.sendBroadcast(intent);
    }

    private WeatherDataToGadgetbridgeJSON(data: WeatherData): string {
        const gbdata: GadgetbridgeWeatherData = {
            timestamp: data.currently.time,
            location: (JSON.parse(getString('weatherLocation')) as WeatherLocation).name,
            currentTemp: Math.round(celciusToKelvin(data.currently.temperature)), //gb expects int
            currentCondition: data.currently.description,
            currentHumidity: data.currently.humidity,
            windSpeed: data.currently.windSpeed,
            uvIndex: data.currently.uvIndex,

            pressure: data.currently.pressure,
            cloudCover: data.currently.cloudCover,
            sunSet: data.currently.sunsetTime,
            isCurrentLocation: -1,
            forcasts: data.daily.data.map((dayData) => {
                const d = {} as Daily;
                d.minTemp = Math.round(celciusToKelvin(dayData.temperatureMin));
                d.maxTemp = Math.round(celciusToKelvin(dayData.temperatureMax));
                d.humidity = dayData.humidity;
                d.windSpeed = dayData.windSpeed;
                d.uvIndex = dayData.uvIndex;
                d.precipProbability = dayData.precipProbability;
                d.sunRise = dayData.sunriseTime;
                d.sunSet = dayData.sunsetTime;

                return d;
            }),
        }
        console.log(JSON.stringify(gbdata))
        return JSON.stringify(gbdata);
    }
}

// https://codeberg.org/Freeyourgadget/Gadgetbridge/src/branch/master/app/src/main/java/nodomain/freeyourgadget/gadgetbridge/model/WeatherSpec.java 03.09.2023 1:24 CEST
interface GadgetbridgeWeatherData {
    timestamp: number; // unix epoch timestamp, in seconds
    location?: string;
    currentTemp: number; // kelvin
    currentConditionCode?: number; // OpenWeatherMap condition code
    currentCondition: string;
    currentHumidity: number;
    todayMaxTemp?: number; // kelvin
    todayMintemp?: number; // kelvin
    windSpeed: number; // km per hour
    windDirection?: number; // deg
    uvIndex: number;
    precipProbability?: number; // %
    dewPoint?: number; // kelvin
    pressure: number; // mb
    cloudCover: number; // %
    visibility?: number; // m
    sunRise?: number; // unix epoch timestamp, in seconds
    sunSet: number; // unix epoch timestamp, in seconds
    moonRise?: number; // unix epoch timestamp, in seconds
    moonSet?: number; // unix epoch timestamp, in seconds
    moonPhase?: number; // deg
    latitude?: number;
    longitude?: number;
    feelsLikeTemp?: number; // kelvin
    isCurrentLocation?: number; // 0 for false, 1 for true, -1 for unknown

    forcasts: Daily[]
    hourly?: Hourly[]
}

interface Daily {
    minTemp: number; // Kelvin
    maxTemp: number; // Kelvin
    conditionCode?: number; // OpenWeatherMap condition code
    humidity: number;
    windSpeed: number; // km per hour
    windDirection?: number; // deg
    uvIndex: number;
    precipProbability: number; // %
    sunRise?: number;
    sunSet?: number;
    moonRise?: number;
    moonSet?: number;
    moonPhase?: number;
}

interface Hourly {
        timestamp: number; // unix epoch timestamp, in seconds
        temp: number; // Kelvin
        conditionCode: number; // OpenWeatherMap condition code
        humidity: number;
        windSpeed: number; // km per hour
        windDirection: number; // deg
        uvIndex: number;
        precipProbability: number; // %face Hourly {
}
