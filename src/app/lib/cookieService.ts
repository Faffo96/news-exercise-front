

class MyCookieService {
    // Read a cookie by its name
    readCookie(nomecookie: string): string | null {
        if (typeof document === "undefined") {
            return null; // Restituisci null se non è nel contesto del browser
        }

        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key.trim() === nomecookie) {
                return decodeURIComponent(value); // Decode the value to handle special characters
            }
        }
        return null;
    }

    // Write a cookie with a specified name and value
    writeCookie(nomecookie: string, valore: string): string {
        if (typeof document === "undefined") {
            return ""; // Non possiamo scrivere un cookie nel server
        }
        const now = new Date();
        now.setHours(now.getHours() + 1); // Set cookie expiration to 1 hour
        const cookieString = `${nomecookie}=${encodeURIComponent(valore)}; expires=${now.toUTCString()}; path=/`; // Encode the value to handle special characters
        document.cookie = cookieString;
        console.log("Cookie written:", cookieString);
        return cookieString;
    }

    // Salva un oggetto convertito in JSON all'interno di un cookie
    writeObjectCookie<T>(nomecookie: string, oggetto: T): string {
        const jsonString = JSON.stringify(oggetto); // Converti l'oggetto in JSON
        return this.writeCookie(nomecookie, jsonString); // Usa writeCookie per memorizzarlo
    }

    // Modifica la firma di `readObjectCookie` per renderla generica
    readObjectCookie<T>(nomecookie: string): T | null {
        const jsonString = this.readCookie(nomecookie);
        if (jsonString) {
            try {
                return JSON.parse(jsonString) as T; // Effettua il cast al tipo generico
            } catch (error) {
                console.error("Errore nel parsing del cookie JSON:", error);
                return null;
            }
        }
        return null;
    }


    // Elimina un cookie specifico
    deleteCookie(nomecookie: string): void {

        document.cookie = `${nomecookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`Cookie eliminato: ${nomecookie}`);
    }

    // Elimina tutti i cookie
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
