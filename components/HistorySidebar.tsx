import React, { useState, useRef } from 'react';
import { HistoryItem, Formula, Product } from '../types';

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
  isSidebarOpen: boolean;
}

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
);

const RemoveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const PackageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0Z"/>
        <path d="M12 15H3l-1-5L2 2h20l.94 8H12Z"/>
        <path d="M3 2v4h18V2"/>
        <path d="M12 15v7"/>
        <path d="M9 22h6"/>
    </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        <path d="m15 5 4 4"/>
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);

const ImportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);


const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
    history, onItemClick, onClearHistory, selectedItemId,
    savedFormulas, onRemoveSaved, onClearSaved,
    products, onAddProduct, onEditProduct, onDeleteProduct, onClearProducts, onImportProducts,
    isSidebarOpen
}) => {
    const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'products'>('history');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    alert("Arquivo CSV vazio ou sem dados. Certifique-se de que ele tem um cabeçalho e pelo menos uma linha de dados.");
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
                                // Escaped double quote
                                currentField += '"';
                                i++; // Skip the second quote
                            } else {
                                // Start or end of a quoted field
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

                if (nameIndex === -1) {
                    alert("O arquivo CSV deve conter uma coluna 'name'.");
                    return;
                }

                const newProducts: Omit<Product, 'id'>[] = lines.map(line => {
                    const data = parseCsvLine(line);
                    const name = (data[nameIndex] || '').trim();
                    const description = descriptionIndex > -1 ? ((data[descriptionIndex] || '').trim()) : '';
                    return { name, description };
                }).filter(p => p.name);

                if (newProducts.length > 0) {
                    onImportProducts(newProducts);
                } else {
                    alert("Nenhum produto válido encontrado no arquivo.");
                }

            } catch (error) {
                console.error("Erro ao importar CSV:", error);
                alert("Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.");
            } finally {
                if(fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

  return (
    <aside className={`${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className={`text-xl font-semibold text-gray-800 dark:text-white whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            Painel de Controle
        </h2>
      </div>

      <div className={`flex flex-col flex-grow min-h-0 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2">
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    Histórico
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    Salvos 
                    <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${activeTab === 'saved' ? 'bg-white text-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {savedFormulas.length}
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    Produtos 
                    <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${activeTab === 'products' ? 'bg-white text-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {products.length}
                    </span>
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto">
            {activeTab === 'history' && (
                <>
                {history.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>Nenhuma pesquisa ainda.</p>
                        <p className="text-sm">Seu histórico aparecerá aqui.</p>
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
                                {new Date(item.timestamp).toLocaleString('pt-BR')}
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
                        <p>Nenhuma fórmula salva.</p>
                        <p className="text-sm">Use o botão 'Salvar' nos cards.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {savedFormulas.map((formula) => (
                            <li key={formula.name} className="p-4 flex justify-between items-center group">
                                <span className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2">{formula.name}</span>
                                <button onClick={() => onRemoveSaved(formula)} title="Remover dos salvos" className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md transition-opacity">
                                    <RemoveIcon className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                </>
            )}
            {activeTab === 'products' && (
                <>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={onAddProduct} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                                <PlusIcon className="h-5 w-5"/>
                                <span>Adicionar</span>
                            </button>
                            <button onClick={handleImportClick} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                                <ImportIcon className="h-5 w-5"/>
                                <span>Importar</span>
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                            Importe um arquivo CSV com colunas 'name' e 'description'.
                        </p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".csv"
                        />
                    </div>
                    {products.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <PackageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2"/>
                            <p>Nenhum produto cadastrado.</p>
                            <p className="text-sm">Clique nos botões acima para começar.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map((product) => (
                                <li key={product.id} className="p-4 flex justify-between items-start group">
                                    <div className="flex-1 overflow-hidden pr-2">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                                        {product.description && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{product.description}</p>}
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                        <button onClick={() => onEditProduct(product)} title="Editar produto" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDeleteProduct(product.id)} title="Excluir produto" className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md">
                                            <RemoveIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {activeTab === 'history' && history.length > 0 && (
                <button
                onClick={onClearHistory}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-5 w-5"/>
                    <span>Limpar Histórico</span>
                </button>
            )}
            {activeTab === 'saved' && savedFormulas.length > 0 && (
                <button
                onClick={onClearSaved}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-5 w-5"/>
                    <span>Limpar Salvos</span>
                </button>
            )}
            {activeTab === 'products' && products.length > 0 && (
                <button
                onClick={onClearProducts}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 transition-colors duration-200"
                >
                    <TrashIcon className="h-5 w-5"/>
                    <span>Limpar Produtos</span>
                </button>
            )}
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;