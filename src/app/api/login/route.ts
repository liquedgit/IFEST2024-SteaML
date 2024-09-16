import { BaseResponseDTO } from "@/interfaces/BaseResponseDTO";
import { ErrorResponseDTO } from "@/interfaces/ErrorResponseDTO";
import { LoginRequestDTO } from "@/interfaces/LoginRequestDTO";
import { LoginResponseDTO } from "@/interfaces/LoginResponseDTO";
import { SignJwt } from "@/lib/jwt";
import { GetUserByWhere } from "@/service/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try{
        const loginPayload : LoginRequestDTO = await req.json() as LoginRequestDTO
    
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
    }
}