import { NextRequest } from 'next/server';

// Generate a single row of CSV data
function generateRow(index: number): string {
  const id = index + 1;
  const name = `User_${id}`;
  const email = `user${id}@example.com`;
  const age = Math.floor(Math.random() * 50) + 20;
  const department = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][Math.floor(Math.random() * 5)];
  const salary = Math.floor(Math.random() * 100000) + 50000;
  const joinDate = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
  const isActive = Math.random() > 0.2 ? 'true' : 'false';
  const city = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][Math.floor(Math.random() * 6)];
  const country = 'USA';
  
  return `${id},${name},${email},${age},${department},${salary},${joinDate},${isActive},${city},${country}`;
}

// Generate a chunk of rows
function generateChunk(startIndex: number, chunkSize: number): string {
  const rows: string[] = [];
  for (let i = 0; i < chunkSize; i++) {
    rows.push(generateRow(startIndex + i));
  }
  return rows.join('\n');
}

export async function GET(request: NextRequest) {
  const totalRows = 200000;
  const numberOfChunks = 100;
  const rowsPerChunk = totalRows / numberOfChunks; // 2000 rows per chunk

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Send CSV header first
      const header = 'id,name,email,age,department,salary,joinDate,isActive,city,country\n';
      controller.enqueue(new TextEncoder().encode(header));

      // Send data in 10 chunks
      for (let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++) {
        const startIndex = chunkIndex * rowsPerChunk;
        const chunkData = generateChunk(startIndex, rowsPerChunk);
        
        // Add newline at end of chunk (except for last chunk which doesn't need trailing newline)
        const chunkWithNewline = chunkIndex < numberOfChunks - 1 ? chunkData + '\n' : chunkData;
        
        controller.enqueue(new TextEncoder().encode(chunkWithNewline));
        
        // Log progress on server
        console.log(`Sent chunk ${chunkIndex + 1}/${numberOfChunks} (rows ${startIndex + 1} to ${startIndex + rowsPerChunk})`);
        
        // Add a small delay between chunks to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      controller.close();
    },
  });

  // Return streaming response with appropriate headers for CSV download
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data_export.csv"',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Total-Rows': totalRows.toString(),
      'X-Total-Chunks': numberOfChunks.toString(),
    },
  });
}

// POST endpoint for streaming with progress tracking
export async function POST(request: NextRequest) {
  const totalRows = 200000;
  const numberOfChunks = 100;
  const rowsPerChunk = totalRows / numberOfChunks;

  // Create a readable stream with progress events
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial metadata as JSON
      const metadata = JSON.stringify({
        type: 'metadata',
        totalRows,
        numberOfChunks,
        rowsPerChunk,
      }) + '\n---CHUNK_SEPARATOR---\n';
      controller.enqueue(new TextEncoder().encode(metadata));

      // Send CSV header
      const header = 'id,name,email,age,department,salary,joinDate,isActive,city,country\n';
      const headerChunk = JSON.stringify({
        type: 'header',
        data: header,
        chunkIndex: 0,
      }) + '\n---CHUNK_SEPARATOR---\n';
      controller.enqueue(new TextEncoder().encode(headerChunk));

      // Send data chunks with progress
      for (let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++) {
        const startIndex = chunkIndex * rowsPerChunk;
        const chunkData = generateChunk(startIndex, rowsPerChunk);
        
        const dataChunk = JSON.stringify({
          type: 'data',
          data: chunkData + (chunkIndex < numberOfChunks - 1 ? '\n' : ''),
          chunkIndex: chunkIndex + 1,
          progress: Math.round(((chunkIndex + 1) / numberOfChunks) * 100),
          rowsProcessed: startIndex + rowsPerChunk,
        }) + '\n---CHUNK_SEPARATOR---\n';
        
        controller.enqueue(new TextEncoder().encode(dataChunk));
        
        console.log(`Sent chunk ${chunkIndex + 1}/${numberOfChunks}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Send completion message
      const complete = JSON.stringify({
        type: 'complete',
        message: 'CSV generation complete',
        totalRows,
      }) + '\n';
      controller.enqueue(new TextEncoder().encode(complete));

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
