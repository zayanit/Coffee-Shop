/* @TODO replace apiServerUrl and callbackURL with the deployed URLs
 * the auth0 values must match backend/src/auth/auth.py
 */

export const environment = {
  production: true,
  apiServerUrl: 'http://127.0.0.1:5000', // the running FLASK api server url
  auth0: {
    url: 'dev-nevfm7ge', // the auth0 domain prefix
    audience: 'coffe', // the audience set for the auth0 app
    clientId: 'MB6k28kQhkQGQRPT8sIq7ezrs18g4saV', // the client id generated for the auth0 app
    callbackURL: 'http://localhost:8100', // the base url of the running ionic application.
  }
};
