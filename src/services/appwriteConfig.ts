import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6a1f572a000ea0980cbb');

export const account = new Account(client);
export const databases = new Databases(client);
export const DB_ID = '6a1f5a5c001b1f85660a';
export const ALARMS_COLLECTION_ID = 'alarms';

export default client;
