import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic'; // disable static optimization

// Helper function to add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS request received', request);
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {

  const responseType = 'PARTIAL_ERROR'; // Change this to 'SUCCESS', 'FAILED', or 'PARTIAL_ERROR' to test different responses

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;
    const purpose = formData.get('purpose') as string;

    if (!file) {
      const response = NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return response;
    }

    // Read the file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let headers: string[] = [];
    let rows: any[] = [];

    if (file.name.endsWith('.csv')) {
      // Handle CSV file
      const csvText = buffer.toString();
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      headers = result.meta.fields || [];
      rows = result.data;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Handle Excel file
      const workbook = XLSX.read(buffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData.length > 0) {
        headers = Object.keys(jsonData[0] as object);
        rows = jsonData;
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload CSV or Excel file.' },
        { status: 400 }
      );
    }

    // Log headers and rows
    console.log('Headers:', headers);
    console.log('Rows:', rows);
    console.log('Purpose:', purpose);

    if (responseType === 'SUCCESS') {
      // Return success response
      return new NextResponse(
        JSON.stringify({
          status: 'SUCCESS',
          message: 'File processed successfully',
          data: {
            orderId: 'uuid1',
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } else if (responseType === 'FAILED') {
      return new NextResponse(
        JSON.stringify({
          status: 'FAILED',
          message: 'File processing failed',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } else if (responseType === 'PARTIAL_ERROR') {
      return new NextResponse(
        JSON.stringify({
          status: 'PARTIAL_ERROR',
          message: 'There are errors in some rows',
          data: {
            headers: [...headers, 'Error'],
            rows: rows.map((row, index) => ({
              ...row,
              Error: `Error in row ${index + 1}`
            }))
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
  }
  } catch (error) {
    console.error('Error processing file:', error);
    const response = NextResponse.json(
      {
        success: false,
        error: 'Error processing file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );

    // Add CORS headers to error response
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

    return response;
  }
}
