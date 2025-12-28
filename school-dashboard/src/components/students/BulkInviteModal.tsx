'use client';

import { useState } from 'react';
import {
    Users,
    Upload,
    Download,
    Check,
    X,
    AlertTriangle,
    FileText,
    Send,
} from 'lucide-react';

interface BulkInviteModalProps {
    open: boolean;
    onClose: () => void;
    instructors: Array<{ id: string; name: string }>;
}

interface StudentRow {
    id: string;
    name: string;
    email: string;
    phone: string;
    valid: boolean;
    error?: string;
}

export default function BulkInviteModal({ open, onClose, instructors }: BulkInviteModalProps) {
    const [step, setStep] = useState<'input' | 'review' | 'sending' | 'complete'>('input');
    const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('paste');
    const [textInput, setTextInput] = useState('');
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [assignedInstructorId, setAssignedInstructorId] = useState('');
    const [sendInvites, setSendInvites] = useState(true);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

    if (!open) return null;

    const parseInput = () => {
        const lines = textInput.trim().split('\n').filter(line => line.trim());
        const parsed: StudentRow[] = [];

        lines.forEach((line, index) => {
            // Supporta: "Nome, email, telefono" o "Nome; email; telefono" o "Nome \t email \t telefono"
            const parts = line.split(/[,;\t]+/).map(p => p.trim());

            if (parts.length >= 1) {
                const [name, email = '', phone = ''] = parts;
                const isValidEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                parsed.push({
                    id: `row-${index}`,
                    name: name || 'Nome mancante',
                    email,
                    phone,
                    valid: !!name && isValidEmail,
                    error: !name ? 'Nome richiesto' : !isValidEmail ? 'Email non valida' : undefined,
                });
            }
        });

        setStudents(parsed);
        setStep('review');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setTextInput(text);
        };
        reader.readAsText(file);
    };

    const removeStudent = (id: string) => {
        setStudents(students.filter(s => s.id !== id));
    };

    const sendInvitations = async () => {
        setStep('sending');
        const validStudents = students.filter(s => s.valid);
        let success = 0;
        let failed = 0;

        for (let i = 0; i < validStudents.length; i++) {
            // Simula invio
            await new Promise(resolve => setTimeout(resolve, 300));

            // Simula 95% success rate
            if (Math.random() > 0.05) {
                success++;
            } else {
                failed++;
            }

            setProgress(Math.round(((i + 1) / validStudents.length) * 100));
        }

        setResults({ success, failed });
        setStep('complete');
    };

    const downloadTemplate = () => {
        const template = 'Nome,Email,Telefono\nMario Rossi,mario.rossi@email.com,+39 333 1234567\nLucia Verdi,lucia.verdi@email.com,+39 333 9876543';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_studenti.csv';
        a.click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Invito Multiplo</h2>
                                <p className="text-sm text-gray-500">Aggiungi più studenti contemporaneamente</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Input */}
                    {step === 'input' && (
                        <div className="space-y-6">
                            {/* Method Selection */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setInputMethod('paste')}
                                    className={`flex-1 p-3 border-2 rounded-lg transition-colors ${inputMethod === 'paste'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <FileText className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-sm font-medium">Incolla Dati</p>
                                </button>
                                <button
                                    onClick={() => setInputMethod('upload')}
                                    className={`flex-1 p-3 border-2 rounded-lg transition-colors ${inputMethod === 'upload'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Upload className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-sm font-medium">Carica File</p>
                                </button>
                            </div>

                            {inputMethod === 'paste' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Incolla i dati degli studenti (uno per riga)
                                    </label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        rows={8}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                        placeholder="Mario Rossi, mario@email.com, +39 333 1234567
Lucia Verdi, lucia@email.com, +39 333 9876543
Paolo Bianchi, paolo@email.com"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Formato: Nome, Email, Telefono (separati da virgola, punto e virgola, o tab)
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">
                                        Trascina un file CSV o Excel qui
                                    </p>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700"
                                    >
                                        Seleziona File
                                    </label>
                                    <button
                                        onClick={downloadTemplate}
                                        className="block mx-auto mt-4 text-sm text-indigo-600 hover:underline"
                                    >
                                        <Download className="w-4 h-4 inline mr-1" />
                                        Scarica Template CSV
                                    </button>
                                </div>
                            )}

                            {textInput && (
                                <button
                                    onClick={parseInput}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Continua
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {students.filter(s => s.valid).length} studenti validi
                                    </p>
                                    {students.filter(s => !s.valid).length > 0 && (
                                        <p className="text-sm text-red-600">
                                            {students.filter(s => !s.valid).length} con errori
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setStep('input')}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Modifica
                                </button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Nome</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Telefono</th>
                                            <th className="px-4 py-2 w-20">Stato</th>
                                            <th className="px-4 py-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {students.map((student) => (
                                            <tr key={student.id} className={student.valid ? '' : 'bg-red-50'}>
                                                <td className="px-4 py-2">{student.name}</td>
                                                <td className="px-4 py-2">{student.email || '-'}</td>
                                                <td className="px-4 py-2">{student.phone || '-'}</td>
                                                <td className="px-4 py-2 text-center">
                                                    {student.valid ? (
                                                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                                                    ) : (
                                                        <span title={student.error}>
                                                            <AlertTriangle className="w-4 h-4 text-red-600 mx-auto" />
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => removeStudent(student.id)}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assegna Istruttore (opzionale)
                                </label>
                                <select
                                    value={assignedInstructorId}
                                    onChange={(e) => setAssignedInstructorId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                >
                                    <option value="">Non assegnato</option>
                                    {instructors.map((i) => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={sendInvites}
                                    onChange={(e) => setSendInvites(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600"
                                />
                                <span className="text-sm text-gray-700">Invia inviti via email/SMS</span>
                            </label>
                        </div>
                    )}

                    {/* Step 3: Sending */}
                    {step === 'sending' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Invio in corso...
                            </h3>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                    className="bg-indigo-600 h-3 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-gray-500">{progress}% completato</p>
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {step === 'complete' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Invio Completato!
                            </h3>
                            <div className="flex justify-center gap-8 my-6">
                                <div>
                                    <p className="text-3xl font-bold text-green-600">{results.success}</p>
                                    <p className="text-sm text-gray-500">Aggiunti</p>
                                </div>
                                {results.failed > 0 && (
                                    <div>
                                        <p className="text-3xl font-bold text-red-600">{results.failed}</p>
                                        <p className="text-sm text-gray-500">Falliti</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Chiudi
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'review' && (
                    <div className="p-6 border-t bg-gray-50 flex justify-between">
                        <button
                            onClick={() => setStep('input')}
                            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            Indietro
                        </button>
                        <button
                            onClick={sendInvitations}
                            disabled={students.filter(s => s.valid).length === 0}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            Aggiungi {students.filter(s => s.valid).length} Studenti
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
