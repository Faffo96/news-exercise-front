// src/services/MyHttpService.ts
import axios, { AxiosRequestConfig } from 'axios';
/* import { validateEnvVariables } from './envUtils'; */
import { myCookieService } from './cookieService';

class MyHttpService {

    constructor() { }

    private get backendBaseUrl() {
        /* if (!validateEnvVariables()) return false;
        return process.env.NEXT_PUBLIC_BACKEND_BASE_URL; */
        return 'monetary-averil-faffo-0380912b.koyeb.app/';
    }

    public async get(url: string) {
        return await axios.get(`${this.backendBaseUrl}${url}`);
    }

    public async getPrivate(url: string) {
        const token = myCookieService.readCookie("jwt_token");
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.get(`${this.backendBaseUrl}${url}`, config);
    }    

    public async post<T>(url: string, data: T) {
        const token = myCookieService.readCookie("jwt_token");
        console.log("URL: "+ this.backendBaseUrl)
        const config: AxiosRequestConfig = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
            : {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
    
        return await axios.post(`${this.backendBaseUrl}${url}`, data, config);
    }

    public async postWithoutAuth<T>(url: string, data: T) {
        console.log("URL: " + this.backendBaseUrl);
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        return await axios.post(`${this.backendBaseUrl}${url}`, data, config);
    }
    

    // Metodo PATCH
    public async patch<T>(url: string, data: T) {
        const token = myCookieService.readCookie("jwt_token");
        const config: AxiosRequestConfig = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
            : {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

        return await axios.patch(`${this.backendBaseUrl}${url}`, data, config);
    }

    // Metodo DELETE
    public async delete(url: string) {
        const token = myCookieService.readCookie("jwt_token");
        const config: AxiosRequestConfig = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            : {};

        return await axios.delete(`${this.backendBaseUrl}${url}`, config);
    }

    // Metodo PUT
    public async put<T>(url: string, data: T) {
        const token = myCookieService.readCookie("jwt_token");
        const config: AxiosRequestConfig = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
            : {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

        return await axios.put(`${this.backendBaseUrl}${url}`, data, config);
    }

}

export const myHttpService = new MyHttpService();
