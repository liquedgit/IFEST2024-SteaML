import { BaseResponseDTO } from "@/interfaces/BaseResponseDTO";
import { ErrorResponseDTO } from "@/interfaces/ErrorResponseDTO";
import { JwtPayload, VerifyJwt } from "@/lib/jwt";
import { GetUserByWhere } from "@/service/server/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    try{

        const authorizationToken = req.headers.get("Authorization")?.split(" ")[1]

        const payload = await VerifyJwt(authorizationToken!) as JwtPayload | null
        if(!payload){
            return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
                code: 401,
                success: false,
                data: {
                    message: [
                        "Unauthorized"
                    ]
                }
            }, {
                status: 401
            })
        }

        const query = {
            id: Number(payload.id)
        }

        const res = await GetUserByWhere(query)
        if(!res){
            return NextResponse.json<BaseResponseDTO<ErrorResponseDTO>>({
                code: 401,
                success: false,
                data: {
                    message: [
                        "Unauthorized"
                    ]
                }
            }, {
                status: 401
            })
        }

        if(res.role === "Admin"){
            return NextResponse.json<BaseResponseDTO<Object>>({
                code: 200,
                success: true,
                data: {
                    ...res,
                    flag: process.env.FLAG
                }
            })
        }

        return NextResponse.json<BaseResponseDTO<Object>>({
            code: 200,
            success: true,
            data: {
                ...res,
                flag: "IFEST{n0p3_try_4641n}"
            }
        }, {
            status: 200
        })
    }catch(error){
        console.log(error)
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