import { Preset } from "../components/Common";
import * as Realm from "realm-web";

/**
   * Fetches the presets list from MongoDB.
   * @returns promise of error if an error is encountered.
   *
   */

export default function fetch_presets(setPresets: (x: Preset[])=> void){
    const REALM_APP_ID = process.env.REACT_APP_MONGO_APP_ID as string;
    const app = new Realm.App({id : REALM_APP_ID});
    const api_key = process.env.REACT_APP_MONGO_REALM_API_KEY as string;
    const credentials = Realm.Credentials.apiKey(api_key);
    app.logIn(credentials)
        .then(user => {
            return user.functions.fetch_presets();
        })
        .then(allPresets => {
            setPresets(allPresets);
        })
        .catch(error => {
            console.error(error);
        });
}