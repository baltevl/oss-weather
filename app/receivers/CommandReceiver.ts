import { geocodeAddress, networkService, prepareItems } from '~/services/api';
import { WeatherProvider } from '~/services/weatherprovider';

@JavaProxy('com.akylas.weather.CommandReceiver')
@NativeClass
export class CommandReceiver extends android.content.BroadcastReceiver {
    async onReceive(context: android.content.Context, intent: android.content.Intent) {
        if (intent.getAction() !== 'com.akylas.weather.QUERY_WEATHER') {
            return;
        }
        const id = intent.getStringExtra('id');
        try {
            const lat = intent.getFloatExtra('lat', -1);
            const lon = intent.getFloatExtra('lon', -1);
            const receivingPackage = intent.getStringExtra('package');
            networkService.start(); // ensure it is started
            const weatherLocation = await geocodeAddress({ lat, lon });
            const data = await WeatherProvider.getInstance().getWeather(weatherLocation);
            const responseIntent = new android.content.Intent('com.akylas.weather.QUERY_WEATHER_RESULT');
            responseIntent.putExtra('id', id);
            responseIntent.putExtra('weather', JSON.stringify(prepareItems(weatherLocation, data)));
            responseIntent.setPackage(receivingPackage);
            context.sendBroadcast(responseIntent);
        } catch (err) {
            this.sendErrorMessage(context, id, err);
        }
    }

    sendErrorMessage(context: android.content.Context, id, error) {
        const intent = new android.content.Intent('com.akylas.weather.QUERY_WEATHER_RESULT');
        intent.putExtra('id', id);
        intent.putExtra('error', error.toString());
        // androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
        context.sendBroadcast(intent);
    }
}
