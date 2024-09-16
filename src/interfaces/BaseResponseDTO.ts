export interface BaseResponseDTO<T> {
    success : boolean;
    code : number;
    data : T
}