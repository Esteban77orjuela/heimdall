import { account } from './appwriteConfig';
import { ID } from 'appwrite';

export const AuthService = {
  async register(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name);
      return await this.login(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrarse.');
    }
  },

  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Email o contrasena incorrectos.');
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesion.');
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },
};
