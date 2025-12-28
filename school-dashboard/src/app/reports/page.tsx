'use client';

import { useState } from 'react';
import {
    BarChart3,
    Users,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    FileText,
    Award,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Mock data
const performanceData = [
    { date: '1 Dic', avgScore: 72, quizzes: 45 },
    { date: '5 Dic', avgScore: 74, quizzes: 52 },
    { date: '10 Dic', avgScore: 76, quizzes: 48 },
    { date: '15 Dic', avgScore: 78, quizzes: 61 },
    { date: '20 Dic', avgScore: 75, quizzes: 55 },
    { date: '25 Dic', avgScore: 79, quizzes: 42 },
    { date: '28 Dic', avgScore: 81, quizzes: 67 },
];

const topicData = [
    { topic: 'Segnali', avgScore: 85, attempts: 234 },
    { topic: 'Precedenze', avgScore: 72, attempts: 189 },
    { topic: 'Velocità', avgScore: 68, attempts: 156 },
    { topic: 'Sicurezza', avgScore: 78, attempts: 145 },
    { topic: 'Norme', avgScore: 74, attempts: 132 },
];

const scoreDistribution = [
    { range: '0-50%', count: 5, color: '#EF4444' },
    { range: '51-70%', count: 15, color: '#F59E0B' },
    { range: '71-85%', count: 45, color: '#10B981' },
    { range: '86-100%', count: 35, color: '#6366F1' },
];

const instructorPerformance = [
    { name: 'Luigi Verdi', students: 25, avgScore: 82, readyForExam: 8 },
    { name: 'Anna Neri', students: 12, avgScore: 78, readyForExam: 3 },
    { name: 'Giuseppe Bianchi', students: 8, avgScore: 75, readyForExam: 2 },
];

export default function ReportsPage() {
    const [period, setPeriod] = useState('30d');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Report e Analytics</h1>
                    <p className="text-gray-500 mt-1">Monitora le performance della tua autoscuola</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="7d">Ultimi 7 giorni</option>
                        <option value="30d">Ultimi 30 giorni</option>
                        <option value="90d">Ultimi 90 giorni</option>
                        <option value="all">Tutto</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Download className="w-5 h-5" />
                        Esporta
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Nuovi Studenti</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                +20% vs mese scorso
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Esami Superati</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">4</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                80% pass rate
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Media Punteggio</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">78.5%</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                +2.5% vs settimana scorsa
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Quiz Completati</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">1,245</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                ~41 al giorno
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Andamento Punteggi</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="avgScore"
                                    stroke="#6366F1"
                                    fill="#6366F1"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Distribuzione Punteggi</h3>
                    <div className="h-64 flex items-center">
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={scoreDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="count"
                                >
                                    {scoreDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                            {scoreDistribution.map((item) => (
                                <div key={item.range} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600">{item.range}</span>
                                    <span className="text-sm font-medium text-gray-900 ml-auto">{item.count}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Topic Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Performance per Argomento</h3>
                <div className="space-y-4">
                    {topicData.map((topic) => (
                        <div key={topic.topic}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">{topic.attempts} tentativi</span>
                                    <span className={`text-sm font-bold ${topic.avgScore >= 80 ? 'text-green-600' :
                                            topic.avgScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {topic.avgScore}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${topic.avgScore >= 80 ? 'bg-green-500' :
                                            topic.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${topic.avgScore}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weak Topics Alert */}
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-800">Argomenti da Migliorare</h4>
                            <p className="text-sm text-red-600 mt-1">
                                Gli studenti hanno difficoltà con <strong>Limiti di Velocità</strong> (68%) e <strong>Precedenze</strong> (72%).
                                Considera di organizzare lezioni di rinforzo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructor Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Performance per Istruttore</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-3">Istruttore</th>
                                <th className="pb-3 text-center">Studenti</th>
                                <th className="pb-3 text-center">Media Punteggio</th>
                                <th className="pb-3 text-center">Pronti per Esame</th>
                                <th className="pb-3 text-center">Tasso Successo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {instructorPerformance.map((instructor) => (
                                <tr key={instructor.name}>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium">
                                                    {instructor.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{instructor.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center text-gray-900">{instructor.students}</td>
                                    <td className="py-4 text-center">
                                        <span className={`font-medium ${instructor.avgScore >= 80 ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {instructor.avgScore}%
                                        </span>
                                    </td>
                                    <td className="py-4 text-center text-gray-900">{instructor.readyForExam}</td>
                                    <td className="py-4 text-center">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                            {Math.round((instructor.readyForExam / instructor.students) * 100)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
