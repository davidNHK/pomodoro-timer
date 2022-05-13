if (!process.env['GOOGLE_CREDENTIALS']) {
  throw new Error(`GOOGLE_CREDENTIALS must be defined, see 
https://www.pulumi.com/registry/packages/gcp/service-account/#:~:text=In%20order%20to%20create%20new,key%20for%20a%20service%20account.  
`);
}

const GOOGLE_CREDENTIALS = JSON.parse(process.env['GOOGLE_CREDENTIALS']);
export const serviceAccount = GOOGLE_CREDENTIALS['client_email'];
