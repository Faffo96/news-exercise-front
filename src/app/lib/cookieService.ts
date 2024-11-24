

class MyCookieService {
    readCookie(nomecookie: string): string | null {
        if (typeof document === "undefined") {
            return null;
        }

        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key.trim() === nomecookie) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    writeCookie(nomecookie: string, valore: string): string {
        if (typeof document === "undefined") {
            return "";
        }
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const cookieString = `${nomecookie}=${encodeURIComponent(valore)}; expires=${now.toUTCString()}; path=/`;
        document.cookie = cookieString;
        console.log("Cookie written:", cookieString);
        return cookieString;
    }

   
    writeObjectCookie<T>(nomecookie: string, oggetto: T): string {
        const jsonString = JSON.stringify(oggetto);
        return this.writeCookie(nomecookie, jsonString);
    }

    readObjectCookie<T>(nomecookie: string): T | null {
        const jsonString = this.readCookie(nomecookie);
        if (jsonString) {
            try {
                return JSON.parse(jsonString) as T;
            } catch (error) {
                console.error("Errore nel parsing del cookie JSON:", error);
                return null;
            }
        }
        return null;
    }


    deleteCookie(nomecookie: string): void {

        document.cookie = `${nomecookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`Cookie eliminato: ${nomecookie}`);
    }

    deleteAllCookies(): void {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [key] = cookie.split("=");
            this.deleteCookie(key.trim());
        }
        console.log("Tutti i cookie sono stati eliminati");
    }
}

export const myCookieService = new MyCookieService();
