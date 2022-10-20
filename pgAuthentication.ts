import { AuthRequest, TokenResponse, EnvironmentConfig } from "./types.ts";

export async function getPgToken(env: EnvironmentConfig) {
    const body: AuthRequest = {
        userName: env.pgUserName,
        password: env.pgPassword
    };

    const req = new Request(env.authAPI, {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
    });

    try {
        const response = await fetch(req);
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
        const output: TokenResponse = await response.json();
        return output.token;
    } catch (error) {
        throw error;
    }
}