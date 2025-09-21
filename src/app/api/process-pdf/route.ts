import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const pump = promisify(pipeline);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Dynamically import pdf-parse only when needed
    const pdf = (await import('pdf-parse')).default;
    
    const results = [];
    
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdf(buffer);
        
        results.push({
          fileName: file.name,
          text: data.text,
          numPages: data.numpages,
          info: data.info
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        results.push({
          fileName: file.name,
          error: 'Failed to process PDF'
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in PDF processing:', error);
    return NextResponse.json(
      { error: 'Failed to process PDFs' },
      { status: 500 }
    );
  }
}
