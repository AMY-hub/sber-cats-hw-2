export interface CatResponse {
    message: string;
}

export interface CatsData {
    message: string;
    data: Cat[];
}

export interface Cat {
    _id: string;
    id: number;
    name: string;
    favourite: boolean;
    rate: number;
    age: number;
    description: string;
    img_link: string;
    __v: number;
}

export interface UserCatData {
    id: string;
    name: string;
    img_link: string;
    age: string;
    rate: string;
    description: string;
    favourite: boolean;
}

export interface UserData {
    name: string;
    password: string;
    email: string;
}