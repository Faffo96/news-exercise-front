// src/utils/envUtils.ts
export function validateEnvVariables(): boolean {
    if (!process.env.NEXT_PUBLIC_REDIRECT_URI) {
        console.error('Redirect uri env is not defined.');
        return false;
    }
    return true;
}
