import { SignJWT, jwtVerify, JWTPayload } from "jose";

export interface JwtPayload{
    id : string,
}

const SECRET = process.env.JWT_SECRET || "SECRET"

export async function SignJwt(payload : JwtPayload) : Promise<string | null>{
    try{
        const accessToken = await new SignJWT({ id: payload.id })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime('5m')
            .sign(new TextEncoder().encode(SECRET));
        return accessToken;
    }catch(error){
        console.log("Error occured while signing JWT ", error)
        return null
    }
}

export async function VerifyJwt(token : string) : Promise<JWTPayload | null>{
    try{
        const {payload } = await jwtVerify(token, new TextEncoder().encode(SECRET))

        return payload
    }catch(error){
        console.log("Error occured while verify JWT ", error)
        return null
    }
}