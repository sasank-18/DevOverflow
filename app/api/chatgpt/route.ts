import { NextResponse } from "next/server";

export const POST = async(request : Request) =>{
    const {question} =await request.json();

    try{
     console.log("hello",question)
    }catch(error){
        return NextResponse.json({error : error})
    }
}