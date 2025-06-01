"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PdfViewerProps {
  fileUrl: string;
  preview?: boolean;
}

export default function PdfViewer({ fileUrl, preview }: PdfViewerProps) {
  return (
    <div className="h-full w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}
      >
        <Viewer
          fileUrl={`/api/resume-file?resume=${fileUrl}${
            preview ? "&preview=true" : ""
          }`}
        />
      </Worker>
    </div>
  );
}
