import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.NEXT_CLOUDINARY_API_KEY, 
        api_secret: process.env.NEXT_CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

interface CloudinaryUploadResult{
    public_id: string;
    [key: string]: any;
    bytes: number;
    duration?: number;

}

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {


    const { userId } =  auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   

    try {
        if(
            !process.env.NEXT_CLOUDINARY_API_KEY || !process.env.NEXT_CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        ){
            return NextResponse.json({ error: 'Missing Cloudinary credentials' }, { status: 500 });
        }
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const orignalSize = formData.get('orignalSize') as string;
        if(!file){
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder:"video-upload",
                resource_type:"video",
                transformations:[
                    {quality: "auto",width: 300, height: 300, crop: "fill",fetch_format:"mp4"},
                ]
                },
                (error, result) => {
                    if (error) return reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer)
        }
    )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: orignalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0 ,
            }
            
        })
      return NextResponse.json(video)
    } catch (error) {
        console.log("Upload video failed",error);
        return NextResponse.json({ error: 'Upload video failed' }, { status: 500 });
    }
    finally{
        await prisma.$disconnect();
    }
}