import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { register } from "module";
import { NextRequest,NextResponse } from "next/server";


export async function  POST(request:NextRequest){
    try {
        const {email,password}=await request.json()
        if(!email||!password){
            return NextResponse.json(
                {error:"Email and password are required"},
                {status:400}
        )
        }
        await connectToDatabase();
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error:"User Already registered"},
                {status:400}

             );
        }
        await User.create({
            email,
            password
        })
        console.log("NOW it is happend")
        return NextResponse.json(
            {message:"User registerd succesfully"},
            {status:201}
        );

    } catch (error) {
        console.error("registration error",error);
        return NextResponse.json({
        error:"Failed to register"
        },
       {status:400} 
    );
    }
}