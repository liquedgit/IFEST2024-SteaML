import { meGet, MeResponse } from "@/service/client/Auth/me.get";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useMe(){
    return useQuery<MeResponse, AxiosError<any>>({
        queryFn:meGet,
        queryKey: ["meGet"],
        retry:0,
        staleTime:0,
        refetchInterval:10000,
    })
}