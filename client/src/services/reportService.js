// Report Generation Service for InternConnect AI Admin Panel

export const reportService = {
  /**
   * Export array of objects as a downloadable CSV file
   */
  exportToCSV: (filename, data) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Generate Printable PDF / Report View Window
   */
  exportToPDF: (reportTitle, data) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const printWindow = window.open('', '_blank');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} - InternConnect AI</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 24px; }
            .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #334155; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>InternConnect AI — ${reportTitle}</h1>
          <div class="meta">
            Generated on: ${new Date().toLocaleString()} | Authenticated Admin Session
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${h.toUpperCase()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${headers.map((h) => `<td>${row[h] ?? ''}</td>`).join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            InternConnect AI Management Platform &copy; ${new Date().getFullYear()} • Confidential Executive Report
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },
};
