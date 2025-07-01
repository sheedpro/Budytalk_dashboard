"use client"

import { useRef } from "react"
import toPDF, { type Options } from "react-to-pdf"
import OrderPdfPage from "./OrderPdfPage"
import { FileText } from "lucide-react"

export default function PDFdownloader() {
  const targetRef = useRef<HTMLDivElement>(null)

  // PDF options for better quality and formatting
  const options: Options = {
    filename: "order_report.pdf",
    page: {
      margin: 20,
      format: "A4",
      orientation: "portrait",
    },
    resolution: 2,
    overrides: {
      // Improve PDF quality
      pdf: {
        compress: true,
        format: "a4",
        putOnlyUsedFonts: true,
        precision: 16,
      },
    },
  }

  // Function to generate PDF with current data
  const handleGeneratePDF = () => {
    if (targetRef.current) {
      toPDF(targetRef, options)
    }
  }

  return (
    <div className="flex items-center gap-2" onClick={handleGeneratePDF}>
      <FileText className="mr-2 h-4 w-4 text-red-600" />
      <span>Export as PDF</span>

      {/* Hidden div that contains the PDF content */}
      <div className="overflow-hidden" style={{ position: 'relative' }}>
        <div 
          ref={targetRef}
          className="absolute -left-[9999px] -top-[9999px]"
          style={{ 
            width: "210mm",  // A4 width
            minHeight: "297mm" // A4 height
          }}
        >
          <OrderPdfPage />
        </div>
      </div>
    </div>
  )
}
