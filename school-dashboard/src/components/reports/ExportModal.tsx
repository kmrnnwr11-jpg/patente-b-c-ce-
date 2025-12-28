'use client';

import { useState } from 'react';
import {
    FileDown,
    FileSpreadsheet,
    FileText,
    Download,
    Check,
    Loader2,
    Calendar,
    Users,
    BarChart3,
} from 'lucide-react';

interface ExportModalProps {
    open: boolean;
    onClose: () => void;
    schoolId: string;
}

type ExportFormat = 'pdf' | 'excel' | 'csv';
type ExportType = 'students' | 'activity' | 'performance' | 'invoices';
type DateRange = '7d' | '30d' | '90d' | 'all' | 'custom';

export default function ExportModal({ open, onClose, schoolId }: ExportModalProps) {
    const [format, setFormat] = useState<ExportFormat>('excel');
    const [exportType, setExportType] = useState<ExportType>('students');
    const [dateRange, setDateRange] = useState<DateRange>('30d');
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);

    if (!open) return null;

    const exportTypes = [
        {
            id: 'students',
            title: 'Lista Studenti',
            description: 'Tutti gli studenti con statistiche e progressi',
            icon: Users,
        },
        {
            id: 'activity',
            title: 'Attività',
            description: 'Log di quiz e simulazioni completate',
            icon: BarChart3,
        },
        {
            id: 'performance',
            title: 'Performance',
            description: 'Analisi dettagliata dei risultati',
            icon: BarChart3,
        },
        {
            id: 'invoices',
            title: 'Fatture',
            description: 'Storico fatture e pagamenti',
            icon: FileText,
        },
    ] as const;

    const formats = [
        { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
        { id: 'csv', label: 'CSV', icon: FileText },
        { id: 'pdf', label: 'PDF', icon: FileDown },
    ] as const;

    const dateRanges = [
        { id: '7d', label: 'Ultimi 7 giorni' },
        { id: '30d', label: 'Ultimi 30 giorni' },
        { id: '90d', label: 'Ultimi 90 giorni' },
        { id: 'all', label: 'Tutto' },
    ] as const;

    const handleExport = async () => {
        setIsExporting(true);

        try {
            // Genera i dati in base al tipo
            let data: any[] = [];
            let filename = '';

            switch (exportType) {
                case 'students':
                    data = await generateStudentsData(schoolId);
                    filename = `studenti_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'activity':
                    data = await generateActivityData(schoolId, dateRange);
                    filename = `attivita_${dateRange}_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'performance':
                    data = await generatePerformanceData(schoolId, dateRange);
                    filename = `performance_${dateRange}_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'invoices':
                    data = await generateInvoicesData(schoolId);
                    filename = `fatture_${new Date().toISOString().split('T')[0]}`;
                    break;
            }

            // Esporta nel formato scelto
            switch (format) {
                case 'csv':
                    downloadCSV(data, filename);
                    break;
                case 'excel':
                    downloadExcel(data, filename);
                    break;
                case 'pdf':
                    downloadPDF(data, filename, exportType);
                    break;
            }

            setExportComplete(true);
            setTimeout(() => {
                setExportComplete(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Export error:', error);
            alert('Errore durante l\'esportazione');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Esporta Report</h2>
                            <p className="text-sm text-gray-500">Scarica i dati in vari formati</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Export Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Cosa vuoi esportare?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {exportTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setExportType(type.id)}
                                    className={`p-4 border-2 rounded-xl text-left transition-all ${exportType === type.id
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <type.icon className={`w-5 h-5 mb-2 ${exportType === type.id ? 'text-indigo-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`font-medium ${exportType === type.id ? 'text-indigo-600' : 'text-gray-900'
                                        }`}>{type.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range (for activity/performance) */}
                    {(exportType === 'activity' || exportType === 'performance') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Periodo
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {dateRanges.map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => setDateRange(range.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === range.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Format */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Formato
                        </label>
                        <div className="flex gap-3">
                            {formats.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFormat(f.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${format === f.id
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <f.icon className={`w-5 h-5 ${format === f.id ? 'text-indigo-600' : 'text-gray-400'
                                        }`} />
                                    <span className={`font-medium ${format === f.id ? 'text-indigo-600' : 'text-gray-700'
                                        }`}>{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting || exportComplete}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Esportazione...
                            </>
                        ) : exportComplete ? (
                            <>
                                <Check className="w-5 h-5" />
                                Completato!
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Esporta
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper functions
async function generateStudentsData(schoolId: string) {
    // In produzione, fetch da API
    return [
        { nome: 'Marco Bianchi', email: 'marco@email.com', mediaScore: 82, quizCompletati: 145, stato: 'Attivo', prontoEsame: 'Sì' },
        { nome: 'Laura Verdi', email: 'laura@email.com', mediaScore: 75, quizCompletati: 98, stato: 'Attivo', prontoEsame: 'No' },
        { nome: 'Giuseppe Rossi', email: 'giuseppe@email.com', mediaScore: 91, quizCompletati: 200, stato: 'Completato', prontoEsame: 'Sì' },
    ];
}

async function generateActivityData(schoolId: string, dateRange: DateRange) {
    return [
        { data: '2024-01-28', studente: 'Marco Bianchi', tipo: 'Quiz', argomento: 'Segnali', punteggio: 85 },
        { data: '2024-01-28', studente: 'Laura Verdi', tipo: 'Simulazione', argomento: '-', punteggio: 32 },
        { data: '2024-01-27', studente: 'Marco Bianchi', tipo: 'Quiz', argomento: 'Precedenze', punteggio: 72 },
    ];
}

async function generatePerformanceData(schoolId: string, dateRange: DateRange) {
    return [
        { argomento: 'Segnali stradali', mediaScore: 85, completamenti: 450, difficolta: 'Facile' },
        { argomento: 'Precedenze', mediaScore: 68, completamenti: 380, difficolta: 'Difficile' },
        { argomento: 'Limiti velocità', mediaScore: 62, completamenti: 320, difficolta: 'Difficile' },
    ];
}

async function generateInvoicesData(schoolId: string) {
    return [
        { numero: 'INV-2024-001', data: '2024-01-01', importo: '€199.00', stato: 'Pagata' },
        { numero: 'INV-2023-012', data: '2023-12-01', importo: '€199.00', stato: 'Pagata' },
    ];
}

function downloadCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
}

function downloadExcel(data: any[], filename: string) {
    // Per un vero Excel, usa libreria come xlsx
    // Per semplicità, usiamo CSV con estensione xlsx (Excel lo apre)
    downloadCSV(data, filename.replace('.xlsx', '') + '.xlsx');
}

function downloadPDF(data: any[], filename: string, type: ExportType) {
    // Per un vero PDF, usa libreria come jspdf
    // Per ora, genera un HTML stampabile
    const titles: Record<ExportType, string> = {
        students: 'Lista Studenti',
        activity: 'Report Attività',
        performance: 'Report Performance',
        invoices: 'Storico Fatture',
    };

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${titles[type]}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #4F46E5; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 40px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${titles[type]}</h1>
      <p>Generato il: ${new Date().toLocaleDateString('it-IT')}</p>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">Patente Quiz Business</div>
    </body>
    </html>
  `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
}
