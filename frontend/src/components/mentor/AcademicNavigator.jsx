import React, { useState, useEffect } from 'react';
import academicService from '../../services/academicService';
import { ChevronRight, GraduationCap, BookOpen, Layers, GitBranch, Calendar } from 'lucide-react';

const AcademicNavigator = ({ onSubjectSelect }) => {
    const [selections, setSelections] = useState({
        university: '',
        scheme: '',
        stream: '',
        semester: '',
        subject: ''
    });

    const [data, setData] = useState({
        universities: [],
        schemes: [],
        streams: [],
        semesters: [],
        subjects: []
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const universities = await academicService.getUniversities();
                setData(prev => ({ ...prev, universities }));
            } catch (err) {
                console.error("Error fetching universities", err);
            }
        };
        fetchInitial();
    }, []);

    const handleChange = async (field, value) => {
        const newSelections = { ...selections, [field]: value };

        // Reset sub-fields
        if (field === 'university') {
            newSelections.scheme = '';
            newSelections.stream = '';
            newSelections.semester = '';
            newSelections.subject = '';
            setData(prev => ({ ...prev, schemes: [], streams: [], semesters: [], subjects: [] }));
        } else if (field === 'scheme') {
            newSelections.stream = '';
            newSelections.semester = '';
            newSelections.subject = '';
            setData(prev => ({ ...prev, streams: [], semesters: [], subjects: [] }));
        } else if (field === 'stream') {
            newSelections.semester = '';
            newSelections.subject = '';
            setData(prev => ({ ...prev, semesters: [], subjects: [] }));
        } else if (field === 'semester') {
            newSelections.subject = '';
            setData(prev => ({ ...prev, subjects: [] }));
        }

        setSelections(newSelections);

        if (value) {
            setLoading(true);
            try {
                if (field === 'university') {
                    const schemes = await academicService.getSchemes(value);
                    setData(prev => ({ ...prev, schemes }));
                } else if (field === 'scheme') {
                    const streams = await academicService.getStreams(newSelections.university, value);
                    setData(prev => ({ ...prev, streams }));
                } else if (field === 'stream') {
                    const semesters = await academicService.getSemesters(newSelections.university, newSelections.scheme, value);
                    setData(prev => ({ ...prev, semesters }));
                } else if (field === 'semester') {
                    const subjects = await academicService.getSubjects(newSelections.university, newSelections.scheme, newSelections.stream, value);
                    setData(prev => ({ ...prev, subjects }));
                }
            } catch (err) {
                console.error(`Error fetching ${field} info`, err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubjectClick = (subject) => {
        setSelections(prev => ({ ...prev, subject: subject.subjectName }));
        if (onSubjectSelect) onSubjectSelect(subject);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* University Select */}
                <div className="glass p-4 rounded-xl">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <GraduationCap size={16} className="text-blue-400" />
                        University
                    </label>
                    <select
                        value={selections.university}
                        onChange={(e) => handleChange('university', e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                        <option value="" className="bg-gray-900">Select University</option>
                        {data.universities.map(u => (
                            <option key={u} value={u} className="bg-gray-900">{u}</option>
                        ))}
                    </select>
                </div>

                {/* Scheme Select */}
                <div className={`glass p-4 rounded-xl transition-opacity ${!selections.university && 'opacity-50 pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Layers size={16} className="text-purple-400" />
                        Scheme
                    </label>
                    <select
                        value={selections.scheme}
                        onChange={(e) => handleChange('scheme', e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                        <option value="" className="bg-gray-900">Select Scheme</option>
                        {data.schemes.map(s => (
                            <option key={s} value={s} className="bg-gray-900">{s}</option>
                        ))}
                    </select>
                </div>

                {/* Stream Select */}
                <div className={`glass p-4 rounded-xl transition-opacity ${!selections.scheme && 'opacity-50 pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <GitBranch size={16} className="text-green-400" />
                        Stream
                    </label>
                    <select
                        value={selections.stream}
                        onChange={(e) => handleChange('stream', e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                        <option value="" className="bg-gray-900">Select Stream</option>
                        {data.streams.map(s => (
                            <option key={s} value={s} className="bg-gray-900">{s}</option>
                        ))}
                    </select>
                </div>

                {/* Semester Select */}
                <div className={`glass p-4 rounded-xl transition-opacity ${!selections.stream && 'opacity-50 pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar size={16} className="text-orange-400" />
                        Semester
                    </label>
                    <select
                        value={selections.semester}
                        onChange={(e) => handleChange('semester', e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                        <option value="" className="bg-gray-900">Select Semester</option>
                        {data.semesters.map(s => (
                            <option key={s} value={s} className="bg-gray-900">Semester {s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Subject Selection Grid */}
            {selections.semester && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <BookOpen className="text-blue-400" />
                        Available Subjects
                    </h3>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.subjects.map(s => (
                                <button
                                    key={s._id}
                                    onClick={() => handleSubjectClick(s)}
                                    className={`text-left p-6 rounded-2xl transition-all duration-300 border ${selections.subject === s.subjectName
                                        ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-xl shadow-[#0f172a]/20 scale-[1.02]'
                                        : 'bg-white text-[#0f172a] border-[#0f172a]/10 hover:border-[#0f172a]/30 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-xs font-mono px-2 py-1 rounded ${selections.subject === s.subjectName ? 'bg-white/10 text-white' : 'bg-[#0f172a]/5 text-[#0f172a]'}`}>
                                            {s.subjectCode}
                                        </span>
                                        <ChevronRight size={18} className={selections.subject === s.subjectName ? 'text-white' : 'text-[#0f172a]/40'} />
                                    </div>
                                    <h4 className="font-bold mb-1 line-clamp-2">{s.subjectName}</h4>
                                    <p className={`text-xs ${selections.subject === s.subjectName ? 'text-white/70' : 'text-slate-500'}`}>{s.credits} Credits</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AcademicNavigator;
