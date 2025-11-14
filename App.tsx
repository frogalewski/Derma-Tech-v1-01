




import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getFormulaSuggestionsStream, generateFormulaIcon } from './services/geminiService';
import * as dbService from './services/dbService';
import { GeminiResponse, GroundingSource, HistoryItem, Formula, Product } from './types';
import { useLanguage } from './contexts/LanguageContext';
import LoadingSpinner from './components/LoadingSpinner';
import FormulaCard from './components/FormulaCard';
import SourceLinks from './components/SourceLinks';
import HistorySidebar from './components/HistorySidebar';
import Logo from './components/Logo';
import ProductModal from './components/ProductModal';
import ToastContainer, { ToastData } from './components/ToastContainer';
import FormulaDetailModal from './components/FormulaDetailModal';
import FormulaEditModal from './components/FormulaEditModal';
import ContactModal from './components/ContactModal';
import { MailIcon, MenuIcon, PharmacistIcon } from './components/Icons';


const App: React.FC = () => {
    const { t, language } = useLanguage();
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
    const [customIcons, setCustomIcons] = useState<Record<string, string>>({});
    const [generatingIcons, setGeneratingIcons] = useState<Set<string>>(new Set());
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedFormula, setExpandedFormula] = useState<Formula | null>(null);
    const [formulaToEdit, setFormulaToEdit] = useState<Formula | null>(null);
    const [isDbLoading, setIsDbLoading] = useState(true);


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
        const loadDataFromDb = async () => {
            try {
                await dbService.initDB();
                const [
                    historyData,
                    savedFormulasData,
                    productsData,
                    customIconsData
                ] = await Promise.all([
                    dbService.getAllHistory(),
                    dbService.getAllSavedFormulas(),
                    dbService.getAllProducts(),
                    dbService.getSetting<Record<string, string>>('customIcons')
                ]);

                setHistory(historyData.sort((a, b) => b.timestamp - a.timestamp));
                setSavedFormulas(savedFormulasData);
                setProducts(productsData);
                if (customIconsData) setCustomIcons(customIconsData);

            } catch (e) {
                console.error("Failed to load data from database:", e);
                addToast(t('toastErrorDbLoad'), 'error');
            } finally {
                setIsDbLoading(false);
            }
        };

        loadDataFromDb();
    }, [addToast, t]);

    const handleCustomIconChange = useCallback(async (formulaId: string, imageDataUrl: string) => {
        const newIcons = { ...customIcons, [formulaId]: imageDataUrl };
        setCustomIcons(newIcons);
        await dbService.setSetting('customIcons', newIcons);
    }, [customIcons]);

    const handleRemoveCustomIcon = useCallback(async (formulaId: string) => {
        const newIcons = { ...customIcons };
        delete newIcons[formulaId];
        setCustomIcons(newIcons);
        await dbService.setSetting('customIcons', newIcons);
    }, [customIcons]);

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
                const iconDataUrl = await generateFormulaIcon(formula.name, language);
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

    }, [formulaIcons, language]);

    const handleToggleSaveFormula = useCallback(async (formulaToToggle: Formula) => {
        const isAlreadySaved = savedFormulas.some(f => f.id === formulaToToggle.id);
        if (isAlreadySaved) {
            setSavedFormulas(prev => prev.filter(f => f.id !== formulaToToggle.id));
            await dbService.unsaveFormula(formulaToToggle.id);
        } else {
            setSavedFormulas(prev => [formulaToToggle, ...prev]);
            await dbService.saveFormula(formulaToToggle);
        }
    }, [savedFormulas]);

    const handleClearSavedFormulas = async () => {
        setSavedFormulas([]);
        await dbService.clearSavedFormulas();
    };

    const handleSaveProduct = useCallback(async (product: Product) => {
        setProducts(prev => {
            const isEditing = prev.some(p => p.id === product.id);
            if (isEditing) {
                return prev.map(p => p.id === product.id ? product : p);
            }
            return [product, ...prev];
        });
        await dbService.saveProduct(product);
    }, []);
    
    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = useCallback(async (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        await dbService.deleteProduct(productId);
    }, []);

    const handleClearProducts = async () => {
        setProducts([]);
        await dbService.clearProducts();
    };

    const handleImportProducts = useCallback(async (newProducts: Omit<Product, 'id'>[]) => {
        let addedCount = 0;
        let skippedCount = 0;
        
        const existingNames = new Set(products.map(p => p.name.toLowerCase()));
        
        const productsToAdd = newProducts
            .map((p, index) => ({ ...p, id: `${Date.now()}-${index}`}))
            .filter(p => {
                const alreadyExists = existingNames.has(p.name.toLowerCase());
                if (alreadyExists) {
                    skippedCount++;
                    return false;
                }
                existingNames.add(p.name.toLowerCase());
                addedCount++;
                return true;
            });

        if (productsToAdd.length > 0) {
            setProducts(prev => [...productsToAdd, ...prev]);
            for (const product of productsToAdd) {
                await dbService.saveProduct(product);
            }
        }
    
        if (addedCount > 0) {
            alert(t('alertProductsImported', { addedCount, skippedCount }));
        } else {
            alert(t('alertNoProductsToImport'));
        }
    
    }, [products, t]);

    const handleExportProducts = useCallback(() => {
        if (products.length === 0) {
            addToast(t('toastInfoNoProductsToExport'), 'info');
            return;
        }

        const escapeCsvField = (field: string): string => {
            if (/[",\n\r]/.test(field)) {
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        };

        const headers = ['name', 'description', 'category'];
        const csvRows = [
            headers.join(','),
            ...products.map(p => 
                [escapeCsvField(p.name), escapeCsvField(p.description), escapeCsvField(p.category || '')].join(',')
            )
        ];
        const csvString = csvRows.join('\r\n');

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'produtos_dermatologica.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }, [products, addToast, t]);


    const handleSearch = useCallback(async () => {
        if (!disease.trim()) {
            addToast(t('toastErrorEnterCondition'));
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
                considerProducts ? products : [],
                language
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
                throw new Error(t('toastErrorApiEmpty'));
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

            setHistory(prevHistory => [newItem, ...prevHistory]);
            await dbService.addHistoryItem(newItem);
            setSelectedHistoryItemId(newItem.id);
            
        } catch (e) {
            console.error("Failed during search:", e);
            if (e instanceof SyntaxError) {
                addToast(t('toastErrorApiParse'));
            } else if (e instanceof Error) {
                addToast(e.message);
            } else {
                addToast(t('toastErrorUnknown'));
            }
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }, [disease, doctorName, considerProducts, products, generateAndSetIcons, addToast, t, language]);

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

    const handleClearHistory = async () => {
        setHistory([]);
        setSelectedHistoryItemId(null);
        await dbService.clearHistory();
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

    const handleUpdateFormula = async (updatedFormula: Formula) => {
        // Update current response if formula is from there
        if (response && response.formulas.some(f => f.id === updatedFormula.id)) {
            setResponse(prev => prev ? { ...prev, formulas: prev.formulas.map(f => f.id === updatedFormula.id ? updatedFormula : f) } : null);
        }

        // Update history item
        if (selectedHistoryItemId) {
            const itemToUpdate = history.find(item => item.id === selectedHistoryItemId);
            if (itemToUpdate) {
                const updatedItem = {
                    ...itemToUpdate,
                    response: {
                        ...itemToUpdate.response,
                        formulas: itemToUpdate.response.formulas.map(f => f.id === updatedFormula.id ? updatedFormula : f)
                    }
                };
                setHistory(prev => prev.map(item => item.id === selectedHistoryItemId ? updatedItem : item));
                await dbService.updateHistoryItem(updatedItem);
            }
        }
        
        // Update saved formulas
        if (savedFormulas.some(f => f.id === updatedFormula.id)) {
            setSavedFormulas(prev => prev.map(f => f.id === updatedFormula.id ? updatedFormula : f));
            await dbService.updateSavedFormula(updatedFormula);
        }

        handleCloseEditModal();
    };

    if (isDbLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <Logo className="h-16 w-auto text-gray-800 dark:text-gray-200 mb-4" />
                     <svg
                        className="animate-spin h-8 w-8 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                     <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">{t('loadingDb')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
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
                    onExportProducts={handleExportProducts}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen">
                    <div className="max-w-4xl mx-auto">
                        <header className="relative text-center mb-8">
                            <button
                                onClick={handleToggleSidebar}
                                className="absolute top-1/2 -translate-y-1/2 left-0 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label={t('toggleSidebarAria')}
                            >
                                <MenuIcon className="h-7 w-7" />
                            </button>
                            <div className="flex justify-center items-center">
                                <Logo className="h-16 w-auto text-gray-800 dark:text-gray-200" />
                            </div>
                        </header>

                        <section>
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                                    <input
                                        type="text"
                                        value={disease}
                                        onChange={(e) => setDisease(e.target.value)}
                                        placeholder={t('diseaseInputPlaceholder')}
                                        className="sm:col-span-3 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        disabled={isLoading}
                                        aria-label={t('diseaseInputAria')}
                                    />
                                     <input
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        placeholder={t('doctorInputPlaceholder')}
                                        className="sm:col-span-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        disabled={isLoading}
                                        aria-label={t('doctorInputAria')}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="sm:col-span-1 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{t('searchingButton')}</span>
                                            </>
                                        ) : (
                                            <span>{t('searchButton')}</span>
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
                                            {t('considerProductsLabel')} {products.length === 0 && `(${t('noProductsLabel')})`}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
                            {isLoading && <LoadingSpinner />}
                            {response && (
                                <div className="animate-fade-in">
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('conditionSummaryTitle')}</h2>
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
                                                customIconUrl={customIcons[formula.id]}
                                                onCustomIconChange={handleCustomIconChange}
                                                onRemoveCustomIcon={handleRemoveCustomIcon}
                                            />
                                        ))}
                                    </div>
                                    <SourceLinks sources={sources} />
                                </div>
                            )}
                        </section>
                    </div>

                    <footer className="text-center mt-12 mb-4 space-y-2">
                         <div className="flex items-center justify-center space-x-4">
                            <button 
                                onClick={() => setIsContactModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <MailIcon className="h-8 w-8" />
                                <span>{t('contactUs')}</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           {t('footerText', { year: new Date().getFullYear() })}
                        </p>
                    </footer>
                </main>
            </div>
            
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <button
                onClick={handleWhatsAppPharmacist}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-green-500"
                aria-label={t('talkToPharmacistAria')}
                title={t('talkToPharmacistTitle')}
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
                    iconDataUrl={formulaIcons[expandedFormula.name]}
                    customIconUrl={customIcons[expandedFormula.id]}
                    onCustomIconChange={handleCustomIconChange}
                    onRemoveCustomIcon={handleRemoveCustomIcon}
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