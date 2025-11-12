import React, { useState, useEffect } from 'react';
import { Formula } from '../types';

// --- Icons ---
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);


interface FormulaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formula: Formula) => void;
  formula: Formula | null;
}

const FormulaEditModal: React.FC<FormulaEditModalProps> = ({ isOpen, onClose, onSave, formula }) => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [instructions, setInstructions] = useState('');
    const [newIngredient, setNewIngredient] = useState('');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (formula) {
            setName(formula.name);
            setIngredients([...formula.ingredients]);
            setInstructions(formula.instructions);
            setNewIngredient('');
            setNameError('');
        }
    }, [formula]);

    if (!isOpen || !formula) {
        return null;
    }

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients(prev => [...prev, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const handleRemoveIngredient = (indexToRemove: number) => {
        setIngredients(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = () => {
        if (!name.trim()) {
            setNameError("O nome da fórmula é obrigatório.");
            return;
        }
        const updatedFormula: Formula = {
            ...formula,
            name: name.trim(),
            ingredients,
            instructions: instructions.trim(),
        };
        onSave(updatedFormula);
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
                         <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-full">
                           <EditIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white" id="edit-modal-title">Editar Fórmula</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <CloseIcon className="h-6 w-6" />
                        <span className="sr-only">Fechar</span>
                    </button>
                </header>

                <main className="p-4 sm:p-6 flex-grow overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="formula-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Fórmula</label>
                            <input
                                type="text"
                                id="formula-name"
                                value={name}
                                onChange={e => { setName(e.target.value); if(nameError) setNameError(''); }}
                                className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-lg focus:ring-2 focus:border-indigo-500 transition duration-200 ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
                            />
                            {nameError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredientes</label>
                            <ul className="mt-2 space-y-2">
                                {ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex justify-between items-center group bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                        <span className="text-gray-800 dark:text-gray-200">{ingredient}</span>
                                        <button onClick={() => handleRemoveIngredient(index)} title="Remover ingrediente" className="p-1 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newIngredient}
                                    onChange={e => setNewIngredient(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddIngredient()}
                                    placeholder="Novo ingrediente..."
                                    className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                />
                                <button
                                    onClick={handleAddIngredient}
                                    className="flex-shrink-0 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    aria-label="Adicionar ingrediente"
                                >
                                    <PlusIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="formula-instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instruções de Uso</label>
                            <textarea
                                id="formula-instructions"
                                rows={4}
                                value={instructions}
                                onChange={e => setInstructions(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            ></textarea>
                        </div>
                    </div>
                </main>

                <footer className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FormulaEditModal;
