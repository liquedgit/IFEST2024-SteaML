import { BaseResponseDTO } from "@/interfaces/BaseResponseDTO";
import { ErrorResponseDTO } from "@/interfaces/ErrorResponseDTO";
import { LoginResponseDTO } from "@/interfaces/LoginResponseDTO";
import { SignJwt } from "@/lib/jwt";
import { GetUserByWhere } from "@/service/server/user.service";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
import {z, ZodError} from "zod"

const loginRequestSchema = z.object({
    username: z.any().refine((value) => value !== null && value !== undefined, {
        message: "Username cannot be empty"
    }),
    password: z.any().refine((value) => value !== null && value !== undefined, {
        message: "Password cannot be empty"
    })
})

export async function POST(req : NextRequest){
    try{
        const loginPayload = await req.json()
        const parseRes = loginRequestSchema.safeParse(loginPayload)
        if(parseRes.success){
            const user = await GetUserByWhere(loginPayload)

            if(!user){
                return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
                    code: 401,
                    success: false,
                    data: {
                        message: [
                            "Invalid credentials"
                        ]
                    }
                }, {
                    status:401
                })
            }
    
            const jwt = await SignJwt({
                id: user.id.toString(),
            })
            if(jwt){
                return NextResponse.json<BaseResponseDTO<LoginResponseDTO>>({
                    code: 200,
                    success: true,
                    data: {
                        accessToken: jwt
                    }
                })
            }
        }
        else if(parseRes.error){

            return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
                code: 400,
                success: false,
                data: {
                    message: parseRes.error!.errors.map(err => `${err.path.join('.')}: ${err.message}`)  // Format error paths and messages
                }
            }, {
                status: 400
            })
        }
        return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
            code: 500,
            success: false,
            data: {
                message: [
                    "Internal server error"
                ]
            }
        }, {
            status: 500
        })
    }catch(error){
        console.log(error);
        
        return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
            code: 500,
            success: false,
            data: {
                message: [
                    "Internal server error",
                ]
            }
        }, {
            status: 500
        })
    }
}