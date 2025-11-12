
import React from 'react';
import { GroundingSource } from '../types';

interface SourceLinksProps {
    sources: GroundingSource[];
}

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
    </svg>
);

const SourceLinks: React.FC<SourceLinksProps> = ({ sources }) => {
    if (sources.length === 0) {
        return null;
    }

    return (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-gray-500"/>
                Fontes da Pesquisa
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Resultados baseados em informações do Google Search.
            </p>
            <div className="mt-4 space-y-4">
                {sources.map((source, index) => (
                    <div key={index} className="p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600">
                        <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                            title={source.title}
                        >
                            <span className="font-bold">{index + 1}. {source.title}</span>
                        </a>
                        {source.snippet && (
                            <blockquote className="mt-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    "...{source.snippet}..."
                                </p>
                            </blockquote>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SourceLinks;
