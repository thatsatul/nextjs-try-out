'use client';

import React, { useState, useCallback } from 'react';

interface ProgressState {
  isLoading: boolean;
  progress: number;
  chunksReceived: number;
  totalChunks: number;
  rowsProcessed: number;
  totalRows: number;
  status: string;
}

interface ChunkData {
  type: 'metadata' | 'header' | 'data' | 'complete';
  data?: string;
  chunkIndex?: number;
  progress?: number;
  rowsProcessed?: number;
  totalRows?: number;
  numberOfChunks?: number;
  message?: string;
}

// Helper function to download a blob as a file
const downloadBlob = (blob: Blob, filename: string) => {
  const url = globalThis.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  globalThis.URL.revokeObjectURL(url);
};

// Helper function to read stream and collect CSV content
const readStreamContent = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  processChunk: (parsed: ChunkData, addLog: (msg: string) => void) => string,
  addLog: (msg: string) => void
): Promise<string> => {
  const decoder = new TextDecoder();
  let csvContent = '';
  let buffer = '';
  let done = false;

  while (!done) {
    const result = await reader.read();
    done = result.done;

    if (result.value) {
      buffer += decoder.decode(result.value, { stream: true });
      const chunks = buffer.split('\n---CHUNK_SEPARATOR---\n');
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        if (chunk.trim()) {
          try {
            const parsed = JSON.parse(chunk) as ChunkData;
            csvContent += processChunk(parsed, addLog);
          } catch {
            // Skip invalid JSON chunks
          }
        }
      }
    }
  }

  return csvContent;
};

const CsvStreamPage = () => {
  const [progressState, setProgressState] = useState<ProgressState>({
    isLoading: false,
    progress: 0,
    chunksReceived: 0,
    totalChunks: 100,
    rowsProcessed: 0,
    totalRows: 200000,
    status: 'Ready',
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Process a single chunk of data
  const processChunk = useCallback((parsed: ChunkData, addLog: (msg: string) => void): string => {
    let csvData = '';

    switch (parsed.type) {
      case 'metadata':
        addLog(`Metadata received: ${parsed.totalRows} rows in ${parsed.numberOfChunks} chunks`);
        setProgressState(prev => ({
          ...prev,
          totalRows: parsed.totalRows || prev.totalRows,
          totalChunks: parsed.numberOfChunks || prev.totalChunks,
          status: 'Receiving data...',
        }));
        break;

      case 'header':
        csvData = parsed.data || '';
        addLog('CSV header received');
        break;

      case 'data':
        csvData = parsed.data || '';
        addLog(`Chunk ${parsed.chunkIndex}/10 received (${parsed.progress}% complete)`);
        setProgressState(prev => ({
          ...prev,
          progress: parsed.progress || prev.progress,
          chunksReceived: parsed.chunkIndex || prev.chunksReceived,
          rowsProcessed: parsed.rowsProcessed || prev.rowsProcessed,
          status: `Processing... ${parsed.progress}%`,
        }));
        break;

      case 'complete':
        addLog(parsed.message || 'Complete');
        setProgressState(prev => ({
          ...prev,
          status: 'Preparing download...',
        }));
        break;
    }

    return csvData;
  }, []);

  // Simple direct download - server generates complete CSV
  const handleDirectDownload = async () => {
    setProgressState(prev => ({ ...prev, isLoading: true, status: 'Downloading...' }));
    addLog('Starting direct download...');

    try {
      const response = await fetch('/api/csv-stream', { method: 'GET' });

      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      downloadBlob(blob, 'data_export.csv');

      addLog('Download complete!');
      setProgressState(prev => ({
        ...prev,
        isLoading: false,
        progress: 100,
        status: 'Download complete!',
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setProgressState(prev => ({
        ...prev,
        isLoading: false,
        status: `Error: ${errorMessage}`,
      }));
    }
  };

  // Stream download with progress tracking
  const handleStreamDownload = async () => {
    setProgressState({
      isLoading: true,
      progress: 0,
      chunksReceived: 0,
      totalChunks: 100,
      rowsProcessed: 0,
      totalRows: 200000,
      status: 'Connecting...',
    });
    setLogs([]);
    addLog('Starting streaming download...');

    try {
      const response = await fetch('/api/csv-stream', { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      addLog('Stream connected, receiving chunks...');
      
      const csvContent = await readStreamContent(reader, processChunk, addLog);
      addLog('Stream ended');

      // Trigger download
      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, 'streamed_data_export.csv');

        addLog('CSV file downloaded successfully!');
        setProgressState(prev => ({
          ...prev,
          isLoading: false,
          progress: 100,
          status: 'Download complete!',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setProgressState(prev => ({
        ...prev,
        isLoading: false,
        status: `Error: ${errorMessage}`,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          CSV Streaming Download
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Download 200,000 rows sent in 100 chunks from the server
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleDirectDownload}
            disabled={progressState.isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {progressState.isLoading ? 'Downloading...' : 'Direct Download'}
          </button>
          
          <button
            onClick={handleStreamDownload}
            disabled={progressState.isLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {progressState.isLoading ? 'Streaming...' : 'Stream with Progress'}
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Progress
          </h2>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progressState.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressState.progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {progressState.chunksReceived}/{progressState.totalChunks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chunks</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {progressState.rowsProcessed.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rows Processed</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {progressState.totalRows.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Rows</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-bold text-orange-600 truncate">
                {progressState.status}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>

        {/* Log Output */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Activity Log
          </h2>
          <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <span className="text-gray-500">Click a button to start downloading...</span>
            ) : (
              logs.map((log, index) => (
                <div key={`log-${log.substring(0, 20)}-${index}`} className="text-green-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How it works
          </h3>
          <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
            <li><strong>Direct Download:</strong> Server generates all 200,000 rows and streams them directly as a CSV file</li>
            <li><strong>Stream with Progress:</strong> Server sends 100 chunks of 2,000 rows each with progress updates</li>
            <li>Each chunk is generated on the server and sent incrementally</li>
            <li>The client assembles all chunks and triggers the download</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CsvStreamPage;
