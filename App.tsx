

import React, { useState, useCallback, useEffect } from 'react';
import { getFormulaSuggestionsStream, generateFormulaIcon } from './services/geminiService';
import { GeminiResponse, GroundingSource, HistoryItem, Formula, Product } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import FormulaCard from './components/FormulaCard';
import SourceLinks from './components/SourceLinks';
import HistorySidebar from './components/HistorySidebar';
import Logo from './components/Logo';
import ProductModal from './components/ProductModal';
import ToastContainer, { ToastData } from './components/ToastContainer';
import FormulaDetailModal from './components/FormulaDetailModal';
import FormulaEditModal from './components/FormulaEditModal';

// --- Icons ---
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.4,5.6c-1.7-1.7-4-2.6-6.4-2.6C7.3,3,3,7.3,3,12c0,1.8,0.5,3.5,1.5,5l-1.6,5.8l6-1.6c1.4,0.9,3,1.3,4.7,1.3h0c4.7,0,8.5-3.8,8.5-8.5C21,9.6,20.1,7.3,18.4,5.6z M12,20.2L12,20.2c-1.5,0-3-0.5-4.2-1.3l-0.3-0.2l-3.1,0.8l0.8-3l-0.2-0.3c-0.9-1.3-1.4-2.8-1.4-4.3c0-3.9,3.1-7,7-7c1.9,0,3.7,0.8,5,2.1c1.3,1.3,2.1,3,2.1,5C19,17.1,15.9,20.2,12,20.2z M16.4,13.6c-0.2-0.1-1.1-0.5-1.3-0.6c-0.2-0.1-0.3-0.1-0.5,0.1c-0.1,0.2-0.5,0.6-0.6,0.7c-0.1,0.1-0.2,0.2-0.4,0.1c-0.2-0.1-0.8-0.3-1.5-0.9c-0.5-0.5-0.9-1.1-1-1.3c-0.1-0.2,0-0.3,0.1-0.4c0.1-0.1,0.2-0.3,0.4-0.4c0.1-0.1,0.2-0.2,0.2-0.3c0.1-0.1,0-0.3-0.1-0.4c-0.1-0.1-0.5-1.1-0.6-1.5c-0.2-0.4-0.3-0.3-0.5-0.3h-0.4c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.7,0.7-0.7,1.6c0,1,0.7,1.9,0.8,2c0.1,0.1,1.4,2.2,3.4,3c0.5,0.2,0.8,0.3,1.1,0.4c0.5,0.1,0.9,0.1,1.2-0.1c0.4-0.2,1.1-0.5,1.3-0.9c0.2-0.4,0.2-0.8,0.1-0.9C16.8,13.8,16.6,13.7,16.4,13.6z"/>
    </svg>
);


const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmail('');
            setMessage('');
            setErrors({});
            setStatus('idle');
        }
    }, [isOpen]);
    
    const validateField = (fieldName: 'name' | 'email' | 'message') => {
        let errorMsg: string | undefined = undefined;
        switch (fieldName) {
            case 'name':
                if (!name.trim()) errorMsg = 'O nome é obrigatório.';
                break;
            case 'email':
                if (!email.trim()) {
                    errorMsg = 'O e-mail é obrigatório.';
                } else if (!/\S+@\S+\.\S+/.test(email)) {
                    errorMsg = 'O formato do e-mail é inválido.';
                }
                break;
            case 'message':
                if (!message.trim()) errorMsg = 'A mensagem é obrigatória.';
                break;
        }
        setErrors(prev => ({...prev, [fieldName]: errorMsg}));
    };

    const validateAll = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!name.trim()) newErrors.name = 'O nome é obrigatório.';
        if (!email.trim()) {
            newErrors.email = 'O e-mail é obrigatório.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'O formato do e-mail é inválido.';
        }
        if (!message.trim()) newErrors.message = 'A mensagem é obrigatória.';
        
        setErrors(newErrors);
        return Object.values(newErrors).every(v => !v);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateAll()) return;

        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    const isSubmittable = name.trim() !== '' && email.trim() !== '' && message.trim() !== '';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg m-4 p-6 relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <CloseIcon className="h-6 w-6" />
                    <span className="sr-only">Fechar modal</span>
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                        <MailIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fale Conosco</h2>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <p className="text-lg font-medium text-green-600 dark:text-green-400">Mensagem enviada com sucesso!</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Obrigado por entrar em contato.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onBlur={() => validateField('name')}
                                    required
                                    aria-invalid={!!errors.name}
                                    aria-describedby="name-error"
                                    className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-lg focus:ring-2 focus:border-indigo-500 transition duration-200 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
                                />
                                {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onBlur={() => validateField('email')}
                                    required
                                    aria-invalid={!!errors.email}
                                    aria-describedby="email-error"
                                    className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-lg focus:ring-2 focus:border-indigo-500 transition duration-200 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
                                />
                                {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onBlur={() => validateField('message')}
                                    required
                                    aria-invalid={!!errors.message}
                                    aria-describedby="message-error"
                                    className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-lg focus:ring-2 focus:border-indigo-500 transition duration-200 ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
                                ></textarea>
                                {errors.message && <p id="message-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={status === 'sending' || !isSubmittable}
                                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <span>Enviar Mensagem</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const PharmacistIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
    </svg>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const App: React.FC = () => {
    const [disease, setDisease] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [response, setResponse] = useState<GeminiResponse | null>(null);
    const [sources, setSources] = useState<GroundingSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [savedFormulas, setSavedFormulas] = useState<Formula[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedHistoryItemId, setSelectedHistoryItemId] = useState<string | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [considerProducts, setConsiderProducts] = useState(false);
    const [formulaIcons, setFormulaIcons] = useState<Record<string, string>>({});
    const [generatingIcons, setGeneratingIcons] = useState<Set<string>>(new Set());
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedFormula, setExpandedFormula] = useState<Formula | null>(null);
    const [formulaToEdit, setFormulaToEdit] = useState<Formula | null>(null);


    const addToast = useCallback((message: string, type: ToastData['type'] = 'error') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);
    
    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('formulaHistory');
            if (storedHistory) setHistory(JSON.parse(storedHistory));
            
            const storedSavedFormulas = localStorage.getItem('savedFormulas');
            if (storedSavedFormulas) setSavedFormulas(JSON.parse(storedSavedFormulas));
            
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) setProducts(JSON.parse(storedProducts));

        } catch (e) {
            console.error("Failed to load data from localStorage:", e);
            addToast('Não foi possível carregar os dados salvos.', 'error');
        }
    }, [addToast]);

    const generateAndSetIcons = useCallback(async (formulas: Formula[]) => {
        const formulasToGenerate = formulas.filter(f => !formulaIcons[f.name]);
        if (formulasToGenerate.length === 0) return;

        setGeneratingIcons(prev => {
            const newSet = new Set(prev);
            formulasToGenerate.forEach(f => newSet.add(f.name));
            return newSet;
        });

        const iconPromises = formulasToGenerate.map(async (formula) => {
            try {
                const iconDataUrl = await generateFormulaIcon(formula.name);
                return { name: formula.name, iconDataUrl };
            } catch (e) {
                console.error(e);
                return { name: formula.name, iconDataUrl: null }; // handle failure
            }
        });

        const results = await Promise.allSettled(iconPromises);

        setFormulaIcons(prev => {
            const newIcons = { ...prev };
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value.iconDataUrl) {
                    newIcons[result.value.name] = result.value.iconDataUrl;
                }
            });
            return newIcons;
        });

        setGeneratingIcons(prev => {
            const newSet = new Set(prev);
            formulasToGenerate.forEach(f => newSet.delete(f.name));
            return newSet;
        });

    }, [formulaIcons]);

    const handleToggleSaveFormula = useCallback((formulaToToggle: Formula) => {
        setSavedFormulas(prev => {
            const isAlreadySaved = prev.some(f => f.id === formulaToToggle.id);
            let newSaved: Formula[];
            if (isAlreadySaved) {
                newSaved = prev.filter(f => f.id !== formulaToToggle.id);
            } else {
                newSaved = [formulaToToggle, ...prev];
            }
            localStorage.setItem('savedFormulas', JSON.stringify(newSaved));
            return newSaved;
        });
    }, []);

    const handleClearSavedFormulas = () => {
        setSavedFormulas([]);
        localStorage.removeItem('savedFormulas');
    };

    const handleSaveProduct = useCallback((product: Product) => {
        setProducts(prev => {
            const isEditing = prev.some(p => p.id === product.id);
            let newProducts: Product[];
            if (isEditing) {
                newProducts = prev.map(p => p.id === product.id ? product : p);
            } else {
                newProducts = [product, ...prev];
            }
            localStorage.setItem('products', JSON.stringify(newProducts));
            return newProducts;
        });
    }, []);
    
    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = useCallback((productId: string) => {
        setProducts(prev => {
            const newProducts = prev.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(newProducts));
            return newProducts;
        });
    }, []);

    const handleClearProducts = () => {
        setProducts([]);
        localStorage.removeItem('products');
    };

    const handleImportProducts = useCallback((newProducts: Omit<Product, 'id'>[]) => {
        let addedCount = 0;
        let skippedCount = 0;
        
        setProducts(prev => {
            const productsToAdd = newProducts.map((p, index) => ({
                ...p,
                id: `${Date.now()}-${index}`
            }));
            
            const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
            const uniqueNewProducts = productsToAdd.filter(p => {
                const alreadyExists = existingNames.has(p.name.toLowerCase());
                if (alreadyExists) return false;
                existingNames.add(p.name.toLowerCase()); // Handle duplicates within the CSV file
                return true;
            });
            
            addedCount = uniqueNewProducts.length;
            skippedCount = newProducts.length - addedCount;
    
            const updatedProducts = [...uniqueNewProducts, ...prev];
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    
        if (addedCount > 0) {
            alert(`${addedCount} produto(s) importado(s) com sucesso! ${skippedCount > 0 ? `${skippedCount} duplicado(s) foram ignorados.` : ''}`);
        } else {
            alert("Nenhum produto novo para importar. Os produtos no arquivo já podem existir na sua lista.");
        }
    
    }, []);


    const handleSearch = useCallback(async () => {
        if (!disease.trim()) {
            addToast('Por favor, insira o nome de uma condição ou doença.');
            return;
        }

        setIsLoading(true);
        setResponse(null);
        setSources([]);
        setSelectedHistoryItemId(null);
        
        try {
            let fullText = '';
            const collectedSources: GroundingSource[] = [];

            const stream = getFormulaSuggestionsStream(
                disease,
                considerProducts ? products : []
            );
            for await (const chunk of stream) {
                if (chunk.text) {
                    fullText += chunk.text;
                }
                if (chunk.sources) {
                    collectedSources.push(...chunk.sources);
                    setSources(prev => [...prev, ...chunk.sources!]);
                }
            }
            
            const jsonString = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
            if (!jsonString) {
                throw new Error("A API retornou uma resposta vazia ou incompleta.");
            }
            const parsedResponseRaw: Omit<GeminiResponse, 'formulas'> & { formulas: Omit<Formula, 'id'>[] } = JSON.parse(jsonString);
            const parsedResponse: GeminiResponse = {
                ...parsedResponseRaw,
                formulas: parsedResponseRaw.formulas.map((f, index) => ({
                    ...f,
                    id: `${Date.now()}-${index}`
                }))
            };
            setResponse(parsedResponse);
            
            generateAndSetIcons(parsedResponse.formulas);

            const newItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                disease: disease,
                doctorName: doctorName,
                response: parsedResponse,
                sources: collectedSources,
            };

            setHistory(prevHistory => {
                const newHistory = [newItem, ...prevHistory];
                localStorage.setItem('formulaHistory', JSON.stringify(newHistory));
                return newHistory;
            });
            setSelectedHistoryItemId(newItem.id);
            
        } catch (e) {
            console.error("Failed during search:", e);
            if (e instanceof SyntaxError) {
                addToast('Ocorreu um erro ao processar a resposta da API (formato inválido).');
            } else if (e instanceof Error) {
                addToast(e.message);
            } else {
                addToast('Um erro desconhecido ocorreu. Tente novamente.');
            }
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }, [disease, doctorName, considerProducts, products, generateAndSetIcons, addToast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const handleHistoryItemClick = (item: HistoryItem) => {
        setDisease(item.disease);
        setDoctorName(item.doctorName || '');
        setResponse(item.response);
        setSources(item.sources);
        setSelectedHistoryItemId(item.id);
        setIsLoading(false);
        generateAndSetIcons(item.response.formulas);
        setIsSidebarOpen(false);
    };

    const handleClearHistory = () => {
        setHistory([]);
        setSelectedHistoryItemId(null);
        localStorage.removeItem('formulaHistory');
        setDisease('');
        setDoctorName('');
        setResponse(null);
        setSources([]);
    };
    
    const handleWhatsAppPharmacist = () => {
        const phoneNumber = "554184197256"; 
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleExpandFormula = (formula: Formula) => {
        setExpandedFormula(formula);
    };

    const handleCloseExpandedView = () => {
        setExpandedFormula(null);
    };

    const handleOpenEditModal = (formula: Formula) => {
        setFormulaToEdit(formula);
    };

    const handleCloseEditModal = () => {
        setFormulaToEdit(null);
    };

    const handleUpdateFormula = (updatedFormula: Formula) => {
        setResponse(prev => {
            if (!prev) return null;
            return {
                ...prev,
                formulas: prev.formulas.map(f => f.id === updatedFormula.id ? updatedFormula : f)
            };
        });

        if (selectedHistoryItemId) {
            setHistory(prev => {
                const newHistory = prev.map(item => {
                    if (item.id === selectedHistoryItemId) {
                        return {
                            ...item,
                            response: {
                                ...item.response,
                                formulas: item.response.formulas.map(f => f.id === updatedFormula.id ? updatedFormula : f)
                            }
                        };
                    }
                    return item;
                });
                localStorage.setItem('formulaHistory', JSON.stringify(newHistory));
                return newHistory;
            });
        }
        
        setSavedFormulas(prev => {
            const isSaved = prev.some(f => f.id === updatedFormula.id);
            if (isSaved) {
                const newSaved = prev.map(f => f.id === updatedFormula.id ? updatedFormula : f);
                localStorage.setItem('savedFormulas', JSON.stringify(newSaved));
                return newSaved;
            }
            return prev;
        });

        handleCloseEditModal();
    };


    return (
        <>
            <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <HistorySidebar 
                    history={history}
                    onItemClick={handleHistoryItemClick}
                    onClearHistory={handleClearHistory}
                    selectedItemId={selectedHistoryItemId}
                    savedFormulas={savedFormulas}
                    onRemoveSaved={handleToggleSaveFormula}
                    onClearSaved={handleClearSavedFormulas}
                    products={products}
                    onAddProduct={handleAddProduct}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onClearProducts={handleClearProducts}
                    onImportProducts={handleImportProducts}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen">
                    <div className="max-w-4xl mx-auto">
                        <header className="relative text-center mb-8">
                            <button
                                onClick={handleToggleSidebar}
                                className="absolute top-1/2 -translate-y-1/2 left-0 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Alternar painel de controle"
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                            <div className="flex justify-center items-center">
                                <Logo className="h-16 w-auto text-gray-800 dark:text-gray-200" />
                            </div>
                        </header>

                        <section>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                                    <input
                                        type="text"
                                        value={disease}
                                        onChange={(e) => setDisease(e.target.value)}
                                        placeholder="Ex: Eczema, Rosácea..."
                                        className="sm:col-span-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        disabled={isLoading}
                                        aria-label="Condição ou doença"
                                    />
                                     <input
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        placeholder="Nome do Médico (Opcional)"
                                        className="sm:col-span-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        disabled={isLoading}
                                        aria-label="Nome do Médico"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="sm:col-span-1 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Buscando</span>
                                            </>
                                        ) : (
                                            <span>Buscar</span>
                                        )}
                                    </button>
                                </form>
                                <div className="mt-4 flex items-center justify-center">
                                    <label htmlFor="consider-products-toggle" className="flex items-center cursor-pointer select-none text-sm text-gray-700 dark:text-gray-300">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="consider-products-toggle"
                                                className="sr-only peer"
                                                checked={considerProducts}
                                                onChange={() => setConsiderProducts(!considerProducts)}
                                                disabled={isLoading || products.length === 0}
                                            />
                                            <div className="block h-6 w-10 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-indigo-600 transition-colors"></div>
                                            <div className="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4"></div>
                                        </div>
                                        <span className={`ml-3 transition-colors ${products.length === 0 ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}`}>
                                            Considerar meus produtos cadastrados {products.length === 0 && '(Nenhum produto)'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
                            {isLoading && <LoadingSpinner />}
                            {response && (
                                <div className="animate-fade-in">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Resumo da Condição</h2>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{response.summary}</p>
                                    </div>

                                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {response.formulas.map((formula) => (
                                            <FormulaCard 
                                                key={formula.id} 
                                                formula={formula}
                                                onSave={handleToggleSaveFormula}
                                                isSaved={savedFormulas.some(f => f.id === formula.id)}
                                                doctorName={doctorName}
                                                iconDataUrl={formulaIcons[formula.name]}
                                                isGeneratingIcon={generatingIcons.has(formula.name)}
                                                onExpand={handleExpandFormula}
                                            />
                                        ))}
                                    </div>
                                    <SourceLinks sources={sources} />
                                </div>
                            )}
                        </section>
                    </div>

                    <footer className="text-center mt-12 mb-4 space-y-2">
                         <div className="flex items-center justify-center space-x-4 text-sm">
                            <button onClick={() => setIsContactModalOpen(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
                                <MailIcon className="h-4 w-4" />
                                <span>Fale Conosco</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Dermatológica &copy; {new Date().getFullYear()} - Fórmulas geradas por IA.
                        </p>
                    </footer>
                </main>
            </div>
            
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <button
                onClick={handleWhatsAppPharmacist}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-green-500"
                aria-label="Fale com a Farmacêutica via WhatsApp"
                title="Fale com a Farmacêutica"
            >
                <PharmacistIcon className="w-8 h-8" />
            </button>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
            <ProductModal 
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />

            {expandedFormula && (
                <FormulaDetailModal
                    formula={expandedFormula}
                    doctorName={doctorName}
                    onClose={handleCloseExpandedView}
                    isSaved={savedFormulas.some(f => f.id === expandedFormula.id)}
                    onSave={handleToggleSaveFormula}
                    onEdit={handleOpenEditModal}
                />
            )}

            <FormulaEditModal
                isOpen={!!formulaToEdit}
                formula={formulaToEdit}
                onClose={handleCloseEditModal}
                onSave={handleUpdateFormula}
            />
        </>
    );
};

export default App;