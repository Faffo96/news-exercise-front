// src/utils/envUtils.ts
export function validateEnvVariables(): boolean {
    if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
        console.error('Backend base URL env is not defined.');
        return false;
    } /* else if (!process.env.NEXTAUTH_URL) {
        console.error('Redirect uri env is not defined.');
    } */
    return true;
}
