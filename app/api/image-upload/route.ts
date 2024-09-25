import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';




    // Configuration
    cloudinary.config({ 
        cloud_name: "dighxqx9x", 
        api_key: process.env.NEXT_CLOUDINARY_API_KEY, 
        api_secret: process.env.NEXT_CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

interface CloudinaryUploadResult{
    public_id: string;
    [key: string]: any;

}

export async function POST(request: NextRequest) {
    const { userId } =  auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if(!file){
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder:"next-cloudinary-uploads"},
                (error, result) => {
                    if (error)  reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer)
        }
    )

        return NextResponse.json(result)
      
    } catch (error) {
        console.log("Upload image failed",error);
        return NextResponse.json({ error: 'Upload image failed' }, { status: 500 });
    }

}