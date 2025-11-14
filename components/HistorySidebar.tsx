


import React, { useState, useRef } from 'react';
import { HistoryItem, Formula, Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BookmarkIcon, ClockIcon, CloseIcon, CogIcon, DownloadIcon, EditIcon, ImportIcon, PackageIcon, PlusIcon, TrashIcon } from './Icons';

interface HistorySidebarProps {
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
  onClearHistory: () => void;
  selectedItemId: string | null;
  savedFormulas: Formula[];
  onRemoveSaved: (formula: Formula) => void;
  onClearSaved: () => void;
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onClearProducts: () => void;
  onImportProducts: (products: Omit<Product, 'id'>[]) => void;
  onExportProducts: () => void;
  isSidebarOpen: boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
    history, onItemClick, onClearHistory, selectedItemId,
    savedFormulas, onRemoveSaved, onClearSaved,
    products, onAddProduct, onEditProduct, onDeleteProduct, onClearProducts, onImportProducts, onExportProducts,
    isSidebarOpen
}) => {
    const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'products' | 'settings'>('history');
    const productsFileInputRef = useRef<HTMLInputElement>(null);
    const { t, language, setLanguage } = useLanguage();

    const handleImportProductsClick = () => {
        productsFileInputRef.current?.click();
    };

    const handleProductsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    alert(t('alertCsvEmpty'));
                    return;
                }
                const headerLine = lines.shift()!;
                
                const parseCsvLine = (line: string): string[] => {
                    const fields: string[] = [];
                    let currentField = '';
                    let inQuotes = false;

                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') {
                            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                                currentField += '"';
                                i++;
                            } else {
                                inQuotes = !inQuotes;
                            }
                        } else if (char === ',' && !inQuotes) {
                            fields.push(currentField);
                            currentField = '';
                        } else {
                            currentField += char;
                        }
                    }
                    fields.push(currentField);
                    return fields;
                };
                
                const header = parseCsvLine(headerLine).map(h => h.trim().toLowerCase());
                const nameIndex = header.indexOf('name');
                const descriptionIndex = header.indexOf('description');
                const categoryIndex = header.indexOf('category');

                if (nameIndex === -1) {
                    alert(t('alertCsvNoNameColumn'));
                    return;
                }

                const newProducts: Omit<Product, 'id'>[] = lines.map(line => {
                    const data = parseCsvLine(line);
                    const name = (data[nameIndex] || '').trim();
                    const description = descriptionIndex > -1 ? ((data[descriptionIndex] || '').trim()) : '';
                    const category = categoryIndex > -1 ? ((data[categoryIndex] || '').trim()) : '';
                    return { name, description, category };
                }).filter(p => p.name);

                if (newProducts.length > 0) {
                    onImportProducts(newProducts);
                } else {
                    alert(t('alertNoValidProducts'));
                }

            } catch (error) {
                console.error("Error importing CSV:", error);
                alert(t('alertCsvError'));
            } finally {
                if(productsFileInputRef.current) {
                    productsFileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

  return (
    <aside className={`${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className={`text-xl font-semibold text-gray-800 dark:text-white whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            {t('controlPanel')}
        </h2>
      </div>

      <div className={`flex flex-col flex-grow min-h-0 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-1">
                <button 
                    onClick={() => setActiveTab('history')}
                    title={t('history')}
                    className={`p-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    <ClockIcon className="h-6 w-6" />
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    title={t('saved')}
                    className={`p-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    <BookmarkIcon className="h-6 w-6" />
                    <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${activeTab === 'saved' ? 'bg-white text-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {savedFormulas.length}
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    title={t('products')}
                    className={`p-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    <PackageIcon className="h-6 w-6" />
                    <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${activeTab === 'products' ? 'bg-white text-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {products.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    title={t('settings')}
                    className={`p-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    <CogIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto">
            {activeTab === 'history' && (
                <>
                {history.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>{t('noHistory')}</p>
                        <p className="text-sm">{t('historyWillAppear')}</p>
                    </div>
                    ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {history.map((item) => (
                        <li key={item.id}>
                            <button
                            onClick={() => onItemClick(item)}
                            className={`w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${item.id === selectedItemId ? 'bg-indigo-50 dark:bg-indigo-900/50' : ''}`}
                            >
                            <p className={`font-medium capitalize truncate ${item.id === selectedItemId ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>{item.disease}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(item.timestamp).toLocaleString(language)}
                            </p>
                            </button>
                        </li>
                        ))}
                    </ul>
                    )}
                </>
            )}
            {activeTab === 'saved' && (
                <>
                {savedFormulas.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <BookmarkIcon className="h-10 w-10 mx-auto text-gray-400 mb-2"/>
                        <p>{t('noSavedFormulas')}</p>
                        <p className="text-sm">{t('useSaveButton')}</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {savedFormulas.map((formula) => (
                            <li key={formula.name} className="p-4 flex justify-between items-center group">
                                <span className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2">{formula.name}</span>
                                <button onClick={() => onRemoveSaved(formula)} title={t('removeFromSaved')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md transition-opacity">
                                    <CloseIcon className="h-6 w-6" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                </>
            )}
            {activeTab === 'products' && (
                <>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
                         <button onClick={onAddProduct} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                            <PlusIcon className="h-6 w-6"/>
                            <span>{t('addProduct')}</span>
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleImportProductsClick} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                                <ImportIcon className="h-6 w-6"/>
                                <span>{t('import')}</span>
                            </button>
                             <button onClick={onExportProducts} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                                <DownloadIcon className="h-6 w-6"/>
                                <span>{t('export')}</span>
                            </button>
                        </div>
                        <p className="pt-1 text-xs text-center text-gray-500 dark:text-gray-400">
                            {t('csvImportHelp')}
                        </p>
                        <input 
                            type="file" 
                            ref={productsFileInputRef} 
                            onChange={handleProductsFileChange} 
                            className="hidden" 
                            accept=".csv"
                        />
                    </div>
                    {products.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <PackageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2"/>
                            <p>{t('noProducts')}</p>
                            <p className="text-sm">{t('clickButtonsToStart')}</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map((product) => (
                                <li key={product.id} className="p-4 flex justify-between items-start group">
                                    <div className="flex-1 overflow-hidden pr-2">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                                        {product.description && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{product.description}</p>}
                                        {product.category && <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono truncate mt-1">{product.category}</p>}
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                        <button onClick={() => onEditProduct(product)} title={t('editProduct')} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md">
                                            <EditIcon className="h-6 w-6" />
                                        </button>
                                        <button onClick={() => onDeleteProduct(product.id)} title={t('deleteProduct')} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md">
                                            <CloseIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
             {activeTab === 'settings' && (
                <div className="p-4 space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('language')}</h3>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en')}
                            className="mt-2 w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            aria-label={t('selectLanguage')}
                        >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {activeTab === 'history' && history.length > 0 && (
                <button
                onClick={onClearHistory}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-6 w-6"/>
                    <span>{t('clearHistory')}</span>
                </button>
            )}
            {activeTab === 'saved' && savedFormulas.length > 0 && (
                <button
                onClick={onClearSaved}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-6 w-6"/>
                    <span>{t('clearSaved')}</span>
                </button>
            )}
            {activeTab === 'products' && products.length > 0 && (
                <button
                onClick={onClearProducts}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-6 w-6"/>
                    <span>{t('clearProducts')}</span>
                </button>
            )}
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;