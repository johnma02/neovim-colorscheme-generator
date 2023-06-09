import * as Realm from "realm-web";

/**
    * Increments the number of upvotes a theme has
   *
   * @remarks
   * Yes, anybody can upvote a theme. Yes, they are only limited by
   * the session they occupy. 
   * 
   * No, it wouldn't be hard to limit upvotes based on ...
   * - a user being logged in
   * - the upvotes a user has already given
   *   
   * 
   * @returns boolean promise of whether or not we encounter an error.
   *
   */

// user is optional, pass in an empty string to get main preset list
export default function upvote_theme(user: string, id: string){
    const REALM_APP_ID = process.env.REACT_APP_MONGO_APP_ID as string;
    const api_key = process.env.REACT_APP_MONGO_REALM_API_KEY as string;
    const app = new Realm.App({id : REALM_APP_ID});
    const credentials = Realm.Credentials.apiKey(api_key);
    return new Promise<boolean>((resolve, reject) => {
        app.logIn(credentials)
            .then(realm => {
                return realm.functions.upvote_theme(user, id);
            })
            .then(result => {
                console.log("Upvote successful!");
                resolve(true); // no api error
            })
            .catch(error => {
                console.error(error);
                reject(new Error("Failed to upvote theme :(")); // reject the Promise with an error object
            });
    });
}