

import React, { useState } from 'react';
import { Formula } from '../types';

// --- Icons ---
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);
const PillIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
    </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
);
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.62 2.42 5.83 0 4.54-3.7 8.24-8.24 8.24zm3.56-5.45c-.18-.1-.92-.46-1.06-.51s-.25-.08-.36.08c-.1.15-.4.51-.49.61s-.18.1-.33.03c-.15-.08-.66-.24-1.25-.77-.46-.42-.77-.94-.86-1.1s-.09-.25.04-.34c.12-.09.25-.25.38-.38s.17-.22.25-.36.04-.25-.04-.34c-.08-.1-.36-.86-.49-1.18s-.26-.26-.36-.26h-.25c-.1 0-.25.04-.38.17s-.5.49-.5 1.18.51 1.36.58 1.46.99 1.52 2.42 2.13c.34.15.6.22.82.28.29.08.55.06.75-.02.23-.08.92-.38 1.05-.75s.13-.7.09-.75c-.04-.05-.1-.08-.18-.17z"/>
    </svg>
);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        <path d="m15 5 4 4"/>
    </svg>
);

interface FormulaDetailModalProps {
  formula: Formula;
  doctorName?: string;
  onClose: () => void;
  isSaved: boolean;
  onSave: (formula: Formula) => void;
  onEdit: (formula: Formula) => void;
}

const FormulaDetailModal: React.FC<FormulaDetailModalProps> = ({ formula, doctorName, onClose, isSaved, onSave, onEdit }) => {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedText(textToCopy);
            setTimeout(() => setCopiedText(null), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleExportTxt = () => {
        let content = `Nome da Fórmula: ${formula.name}\n`;
        if (doctorName) content += `Médico: ${doctorName}\n`;
        content += `\nIngredientes:\n${formula.ingredients.map(ing => `- ${ing}`).join('\n')}\n\n` +
                   `Instruções de Uso:\n${formula.instructions}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `formula_${formula.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleWhatsAppQuote = () => {
        const phoneNumber = "5541991994993";
        const messageHeader = `Olá! Gostaria de solicitar um orçamento para a seguinte fórmula:\n\n`;
        const doctorInfo = doctorName ? `*Médico:* ${doctorName}\n` : '';
        const formulaName = `*Nome:* ${formula.name}\n`;
        const ingredientsList = `*Ingredientes:*\n${formula.ingredients.map(ing => `- ${ing}`).join('\n')}`;
        const fullMessage = `${messageHeader}${doctorInfo}${formulaName}${ingredientsList}\n\nObrigado!`;
        const encodedMessage = encodeURIComponent(fullMessage);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleEditClick = () => {
        onEdit(formula);
        onClose(); // Close detail view to open edit view
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 relative animate-fade-in flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                           <PillIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white" id="modal-title">{formula.name}</h2>
                             {doctorName && <p className="text-sm text-gray-500 dark:text-gray-400">Médico: {doctorName}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <CloseIcon className="h-6 w-6" />
                        <span className="sr-only">Fechar</span>
                    </button>
                </header>

                <main className="p-4 sm:p-6 flex-grow overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300">Ingredientes:</h3>
                            <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-400">
                                {formula.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex justify-between items-center group bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <span className="text-base">{ingredient}</span>
                                        <button onClick={() => handleCopy(ingredient)} title="Copiar ingrediente" className="ml-2 p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            {copiedText === ingredient ? <CheckIcon className="h-5 w-5 text-green-500"/> : <CopyIcon className="h-5 w-5"/>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300">Instruções de Uso:</h3>
                                <button onClick={() => handleCopy(formula.instructions)} title="Copiar instruções" className="p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    {copiedText === formula.instructions ? <CheckIcon className="h-5 w-5 text-green-500"/> : <CopyIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                            <p className="mt-2 text-base text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">{formula.instructions}</p>
                        </div>
                    </div>
                </main>

                <footer className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                        onClick={() => onSave(formula)}
                        className={`w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200 ${
                            isSaved
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 hover:bg-teal-200'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                        <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
                    </button>
                    <button
                        onClick={handleWhatsAppQuote}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-white font-medium bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-200"
                    >
                        <WhatsAppIcon className="h-5 w-5" />
                        <span>Orçar</span>
                    </button>
                     <button
                        onClick={handleEditClick}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-700 dark:text-blue-300 font-medium bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-200"
                    >
                        <EditIcon className="h-5 w-5" />
                        <span>Editar</span>
                    </button>
                    <button
                        onClick={handleExportTxt}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 font-medium bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <DownloadIcon className="h-5 w-5" />
                        <span>Exportar</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FormulaDetailModal;