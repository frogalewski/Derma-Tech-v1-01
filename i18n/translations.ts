


const ptBR = {
  // App.tsx
  toastErrorDbLoad: 'Não foi possível carregar os dados do banco de dados local.',
  toastErrorEnterCondition: 'Por favor, insira o nome de uma condição ou doença.',
  toastErrorApiEmpty: 'A API retornou uma resposta vazia ou incompleta.',
  toastErrorApiParse: 'Ocorreu um erro ao processar a resposta da API (formato inválido).',
  toastErrorUnknown: 'Um erro desconhecido ocorreu. Tente novamente.',
  loadingDb: 'Carregando banco de dados...',
  toggleSidebarAria: 'Alternar painel de controle',
  diseaseInputPlaceholder: 'Ex: Eczema, Rosácea...',
  doctorInputPlaceholder: 'Nome do Médico (Opcional)',
  diseaseInputAria: 'Condição ou doença',
  doctorInputAria: 'Nome do Médico',
  searchingButton: 'Buscando',
  searchButton: 'Buscar',
  considerProductsLabel: 'Considerar meus produtos cadastrados',
  noProductsLabel: 'Nenhum produto',
  conditionSummaryTitle: 'Resumo da Condição',
  contactUs: 'Fale Conosco',
  footerText: 'Dermatológica © {{year}} - Fórmulas geradas por IA.',
  talkToPharmacistAria: 'Fale com a Farmacêutica via WhatsApp',
  talkToPharmacistTitle: 'Fale com a Farmacêutica',
  alertProductsImported: '{{addedCount}} produto(s) importado(s) com sucesso! {{skippedCount}} duplicado(s) foram ignorados.',
  alertNoProductsToImport: 'Nenhum produto novo para importar. Os produtos no arquivo já podem existir na sua lista.',
  toastInfoNoProductsToExport: 'Nenhum produto para exportar.',

  // ContactModal.tsx
  closeModal: 'Fechar modal',
  contactEmailPrompt: 'Para dúvidas, sugestões ou suporte técnico, por favor, envie um e-mail para:',
  copyEmail: 'Copiar e-mail',
  openEmailClient: 'Abrir Cliente de E-mail',

  // HistorySidebar.tsx
  controlPanel: 'Painel de Controle',
  history: 'Histórico',
  saved: 'Salvos',
  products: 'Produtos',
  settings: 'Configurações',
  prescriptionReader: 'Ler Receita',
  prescriptionReaderInstructions: 'Use a IA para ler e extrair dados de uma receita.',
  noHistory: 'Nenhuma pesquisa ainda.',
  historyWillAppear: 'Seu histórico aparecerá aqui.',
  noSavedFormulas: 'Nenhuma fórmula salva.',
  useSaveButton: "Use o botão 'Salvar' nos cards.",
  removeFromSaved: 'Remover dos salvos',
  addProduct: 'Adicionar Produto',
  import: 'Importar',
  export: 'Exportar',
  csvImportHelp: "Importe/Exporte um arquivo CSV com colunas 'name', 'description' e 'category'.",
  noProducts: 'Nenhum produto cadastrado.',
  clickButtonsToStart: 'Clique nos botões acima para começar.',
  editProduct: 'Editar produto',
  deleteProduct: 'Excluir produto',
  language: 'Idioma',
  selectLanguage: 'Selecione o idioma',
  clearHistory: 'Limpar Histórico',
  clearSaved: 'Limpar Salvos',
  clearProducts: 'Limpar Produtos',
  alertCsvEmpty: 'Arquivo CSV vazio ou sem dados. Certifique-se de que ele tem um cabeçalho e pelo menos uma linha de dados.',
  alertCsvNoNameColumn: "O arquivo CSV deve conter uma coluna 'name'.",
  alertNoValidProducts: 'Nenhum produto válido encontrado no arquivo.',
  alertCsvError: 'Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.',

  // FormulaCard.tsx & FormulaDetailModal.tsx
  uploadIconFor: 'Carregar ícone para {{formulaName}}',
  customIconFor: 'Ícone customizado para {{formulaName}}',
  iconFor: 'Ícone para {{formulaName}}',
  changeIcon: 'Alterar ícone',
  removeIcon: 'Remover ícone',
  ingredientsLabel: 'Ingredientes',
  copyIngredient: 'Copiar ingrediente',
  instructionsLabel: 'Instruções de Uso',
  copyInstructions: 'Copiar instruções',
  unsaveFormulaAria: 'Remover {{formulaName}} dos salvos',
  saveFormulaAria: 'Salvar fórmula {{formulaName}}',
  savedButton: 'Salvo',
  saveButton: 'Salvar',
  requestQuoteAria: 'Solicitar orçamento para {{formulaName}} no WhatsApp',
  quoteButton: 'Orçar',
  exportFormulaAria: 'Exportar fórmula {{formulaName}} para TXT',
  expandFormulaAria: 'Ampliar visualização da fórmula {{formulaName}}',
  expandButton: 'Ampliar',
  formulaNameLabel: 'Nome da Fórmula',
  doctorLabel: 'Médico',
  whatsappMessageHeader: 'Olá! Gostaria de solicitar um orçamento para a seguinte fórmula:',
  nameLabel: 'Nome',
  thankYou: 'Obrigado!',
  alertSelectImage: 'Por favor, selecione um arquivo de imagem.',
  changeButton: 'Alterar',
  removeButton: 'Remover',
  closeButton: 'Fechar',
  editButton: 'Editar',
  exportButton: 'Exportar',
  averageValueLabel: 'Valor Médio',

  // FormulaEditModal.tsx
  editFormulaTitle: 'Editar Fórmula',
  formulaNameRequired: 'O nome da fórmula é obrigatório.',
  removeIngredient: 'Remover ingrediente',
  newIngredientPlaceholder: 'Novo ingrediente...',
  addIngredientAria: 'Adicionar ingrediente',
  saveChangesButton: 'Salvar Alterações',
  cancelButton: 'Cancelar',
  averageValuePlaceholder: 'Ex: R$ 50,00 - R$ 70,00',

  // LoadingSpinner.tsx
  loadingText: 'Buscando informações e gerando fórmulas...',
  
  // ProductModal.tsx
  productNameRequired: 'O nome do produto é obrigatório.',
  productNameLabel: 'Nome do Produto',
  categoryLabel: 'Categoria',
  categoryPlaceholder: 'Ex: Ativo, Veículo, Conservante...',
  descriptionLabel: 'Descrição',
  descriptionPlaceholder: 'Ex: Informações adicionais, concentração usual...',

  // SourceLinks.tsx
  researchSources: 'Fontes da Pesquisa',
  googleSearchDisclaimer: 'Resultados baseados em informações do Google Search.',

  // PrescriptionReader.tsx
  prescriptionReaderTitle: 'Leitor de Receitas com IA',
  uploadAreaTitle: 'Envie a Imagem da Receita',
  uploadAreaDescription: 'Arraste e solte um arquivo ou clique para selecionar',
  or: 'ou',
  useCamera: 'Usar a Câmera',
  takePicture: 'Tirar Foto',
  noPermission: 'A permissão da câmera é necessária.',
  analyzing: 'Analisando...',
  analyzeButton: 'Analisar Receita',
  analysisResults: 'Resultados da Análise',
  patientLabel: 'Paciente',
  dateLabel: 'Data',
  prescribedItems: 'Itens Prescritos',
  noItemsFound: 'Nenhum item encontrado.',
  searchFormulasFor: 'Buscar fórmulas para',
  uploadNew: 'Enviar Nova Receita',
  toastErrorInvalidImage: 'Por favor, envie um arquivo de imagem válido.',
  toastErrorReadingImage: 'Erro ao ler a imagem.',
  toastErrorCamera: 'Não foi possível acessar a câmera.',
  quoteOnWhatsApp: 'Orçar no WhatsApp',
  prescriptionWhatsAppHeader: 'Olá! Gostaria de um orçamento para a seguinte receita:',
  
  // Prompts for Gemini API
  prompts: {
    main: `Para a condição "{diseaseName}", sugira de 2 a 4 fórmulas manipuladas.
Seu público-alvo são farmacêuticos e médicos, então use terminologia técnica apropriada.
{productsPromptPart}

Forneça a resposta em um único objeto JSON, exclusivamente em Português do Brasil. O objeto deve ter a seguinte estrutura:
{
  "summary": "Um resumo conciso da condição e da abordagem geral do tratamento.",
  "formulas": [
    {
      "name": "Nome da Fórmula (ex: 'Creme Hidratante com Ureia e Alfa-Bisabolol')",
      "averageValue": "Uma estimativa do valor médio de venda para o consumidor final em Reais (ex: 'R$ 50,00 - R$ 70,00')",
      "ingredients": [
        "Ingrediente 1 com concentração (ex: 'Ureia 10%')",
        "Ingrediente 2 com concentração (ex: 'Alfa-Bisabolol 1%')",
        "Veículo e quantidade (ex: 'Creme base q.s.p. 100g')"
      ],
      "instructions": "Instruções detalhadas de uso para o paciente (ex: 'Aplicar na área afetada 2 vezes ao dia.')"
    }
  ]
}

Certifique-se de que a resposta seja APENAS o objeto JSON, sem nenhum texto ou formatação extra como \`\`\`json.`,
    productsHeader: `\n\nConsidere os seguintes produtos disponíveis em meu estoque ao criar as fórmulas. Dê preferência a eles, se aplicável, e se possível, mencione-os na seção 'ingredients'.\n{productList}`,
    icon: `Crie um ícone vetorial minimalista, limpo e de cor única representando uma fórmula dermatológica para '{formulaName}'. O ícone deve ser simples, simbólico e facilmente reconhecível, adequado para uma aplicação médica ou farmacêutica profissional. O ícone deve ser de uma única cor: índigo (#4F46E5). O fundo deve ser transparente. Saída como PNG.`,
    prescriptionReader: `Analise a imagem desta receita médica. Extraia o nome do médico, nome do paciente, data e os itens prescritos com suas instruções. Retorne os dados em um objeto JSON com a seguinte estrutura: {"doctorName": "string", "patientName": "string", "date": "string", "prescribedItems": [{"name": "string", "instructions": "string"}]}. Se alguma informação não puder ser encontrada, retorne uma string vazia para o campo correspondente. Forneça APENAS o objeto JSON, sem nenhum texto ou formatação extra.`
  }
};

const en = {
  // App.tsx
  toastErrorDbLoad: 'Failed to load data from the local database.',
  toastErrorEnterCondition: 'Please enter the name of a condition or disease.',
  toastErrorApiEmpty: 'The API returned an empty or incomplete response.',
  toastErrorApiParse: 'An error occurred while processing the API response (invalid format).',
  toastErrorUnknown: 'An unknown error occurred. Please try again.',
  loadingDb: 'Loading database...',
  toggleSidebarAria: 'Toggle control panel',
  diseaseInputPlaceholder: 'E.g., Eczema, Rosacea...',
  doctorInputPlaceholder: "Doctor's Name (Optional)",
  diseaseInputAria: 'Condition or disease',
  doctorInputAria: "Doctor's Name",
  searchingButton: 'Searching',
  searchButton: 'Search',
  considerProductsLabel: 'Consider my registered products',
  noProductsLabel: 'No products',
  conditionSummaryTitle: 'Condition Summary',
  contactUs: 'Contact Us',
  footerText: 'Dermatológica © {{year}} - Formulas generated by AI.',
  talkToPharmacistAria: 'Talk to the Pharmacist via WhatsApp',
  talkToPharmacistTitle: 'Talk to the Pharmacist',
  alertProductsImported: '{{addedCount}} product(s) imported successfully! {{skippedCount}} duplicate(s) were ignored.',
  alertNoProductsToImport: 'No new products to import. The products in the file may already exist in your list.',
  toastInfoNoProductsToExport: 'No products to export.',

  // ContactModal.tsx
  closeModal: 'Close modal',
  contactEmailPrompt: 'For questions, suggestions, or technical support, please send an email to:',
  copyEmail: 'Copy email',
  openEmailClient: 'Open Email Client',
  
  // HistorySidebar.tsx
  controlPanel: 'Control Panel',
  history: 'History',
  saved: 'Saved',
  products: 'Products',
  settings: 'Settings',
  prescriptionReader: 'Read Prescription',
  prescriptionReaderInstructions: 'Use AI to read and extract data from a prescription.',
  noHistory: 'No searches yet.',
  historyWillAppear: 'Your history will appear here.',
  noSavedFormulas: 'No saved formulas.',
  useSaveButton: "Use the 'Save' button on the cards.",
  removeFromSaved: 'Remove from saved',
  addProduct: 'Add Product',
  import: 'Import',
  export: 'Export',
  csvImportHelp: "Import/Export a CSV file with columns 'name', 'description', and 'category'.",
  noProducts: 'No products registered.',
  clickButtonsToStart: 'Click the buttons above to start.',
  editProduct: 'Edit product',
  deleteProduct: 'Delete product',
  language: 'Language',
  selectLanguage: 'Select language',
  clearHistory: 'Clear History',
  clearSaved: 'Clear Saved',
  clearProducts: 'Clear Products',
  alertCsvEmpty: 'CSV file is empty or has no data. Make sure it has a header and at least one data row.',
  alertCsvNoNameColumn: "The CSV file must contain a 'name' column.",
  alertNoValidProducts: 'No valid products found in the file.',
  alertCsvError: 'An error occurred while processing the file. Check the format and try again.',

  // FormulaCard.tsx & FormulaDetailModal.tsx
  uploadIconFor: 'Upload icon for {{formulaName}}',
  customIconFor: 'Custom icon for {{formulaName}}',
  iconFor: 'Icon for {{formulaName}}',
  changeIcon: 'Change icon',
  removeIcon: 'Remove icon',
  ingredientsLabel: 'Ingredients',
  copyIngredient: 'Copy ingredient',
  instructionsLabel: 'Instructions for Use',
  copyInstructions: 'Copy instructions',
  unsaveFormulaAria: 'Unsave formula {{formulaName}}',
  saveFormulaAria: 'Save formula {{formulaName}}',
  savedButton: 'Saved',
  saveButton: 'Save',
  requestQuoteAria: 'Request a quote for {{formulaName}} on WhatsApp',
  quoteButton: 'Quote',
  exportFormulaAria: 'Export formula {{formulaName}} to TXT',
  expandFormulaAria: 'Expand view for formula {{formulaName}}',
  expandButton: 'Expand',
  formulaNameLabel: 'Formula Name',
  doctorLabel: 'Doctor',
  whatsappMessageHeader: 'Hello! I would like to request a quote for the following formula:',
  nameLabel: 'Name',
  thankYou: 'Thank you!',
  alertSelectImage: 'Please select an image file.',
  changeButton: 'Change',
  removeButton: 'Remove',
  closeButton: 'Close',
  editButton: 'Edit',
  exportButton: 'Export',
  averageValueLabel: 'Average Value',

  // FormulaEditModal.tsx
  editFormulaTitle: 'Edit Formula',
  formulaNameRequired: 'The formula name is required.',
  removeIngredient: 'Remove ingredient',
  newIngredientPlaceholder: 'New ingredient...',
  addIngredientAria: 'Add ingredient',
  saveChangesButton: 'Save Changes',
  cancelButton: 'Cancel',
  averageValuePlaceholder: 'E.g., $10.00 - $15.00',

  // LoadingSpinner.tsx
  loadingText: 'Searching for information and generating formulas...',

  // ProductModal.tsx
  productNameRequired: 'The product name is required.',
  productNameLabel: 'Product Name',
  categoryLabel: 'Category',
  categoryPlaceholder: 'E.g., Active, Vehicle, Preservative...',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'E.g., Additional info, usual concentration...',

  // SourceLinks.tsx
  researchSources: 'Research Sources',
  googleSearchDisclaimer: 'Results based on information from Google Search.',

  // PrescriptionReader.tsx
  prescriptionReaderTitle: 'AI Prescription Reader',
  uploadAreaTitle: 'Upload Prescription Image',
  uploadAreaDescription: 'Drag & drop a file or click to select',
  or: 'or',
  useCamera: 'Use Camera',
  takePicture: 'Take Picture',
  noPermission: 'Camera permission is required.',
  analyzing: 'Analyzing...',
  analyzeButton: 'Analyze Prescription',
  analysisResults: 'Analysis Results',
  patientLabel: 'Patient',
  dateLabel: 'Date',
  prescribedItems: 'Prescribed Items',
  noItemsFound: 'No items found.',
  searchFormulasFor: 'Search formulas for',
  uploadNew: 'Upload New Prescription',
  toastErrorInvalidImage: 'Please upload a valid image file.',
  toastErrorReadingImage: 'Error reading image file.',
  toastErrorCamera: 'Could not access the camera.',
  quoteOnWhatsApp: 'Quote on WhatsApp',
  prescriptionWhatsAppHeader: 'Hello! I would like a quote for the following prescription:',

  // Prompts for Gemini API
  prompts: {
    main: `For the condition "{diseaseName}", suggest 2 to 4 compounded formulas.
Your target audience is pharmacists and doctors, so use appropriate technical terminology.
{productsPromptPart}

Provide the response in a single JSON object, exclusively in English. The object must have the following structure:
{
  "summary": "A concise summary of the condition and general treatment approach.",
  "formulas": [
    {
      "name": "Formula Name (e.g., 'Moisturizing Cream with Urea and Alpha-Bisabolol')",
      "averageValue": "An estimated average final sale price in USD (e.g., '$10.00 - $15.00')",
      "ingredients": [
        "Ingredient 1 with concentration (e.g., 'Urea 10%')",
        "Ingredient 2 with concentration (e.g., 'Alpha-Bisabolol 1%')",
        "Vehicle and quantity (e.g., 'Cream base q.s.p. 100g')"
      ],
      "instructions": "Detailed instructions for patient use (e.g., 'Apply to the affected area twice a day.')"
    }
  ]
}

Ensure the response is ONLY the JSON object, without any extra text or formatting like \`\`\`json.`,
    productsHeader: `\n\nConsider the following products available in my stock when creating the formulas. Give preference to them if applicable, and if possible, mention them in the 'ingredients' section.\n{productList}`,
    icon: `Create a minimalist, clean, single-color vector icon representing a dermatological formula for '{formulaName}'. The icon should be simple, symbolic, and easily recognizable, suitable for a professional medical or pharmaceutical application. The icon must be a single color: indigo (#4F46E5). The background must be transparent. Output as a PNG.`,
    prescriptionReader: `Analyze the image of this medical prescription. Extract the doctor's name, patient's name, date, and the prescribed items with their instructions. Return the data in a JSON object with the following structure: {"doctorName": "string", "patientName": "string", "date": "string", "prescribedItems": [{"name": "string", "instructions": "string"}]}. If any information cannot be found, return an empty string for the corresponding field. Provide ONLY the JSON object, without any extra text or formatting.`
  }
};

export const translations = {
  'pt-BR': ptBR,
  'en': en,
};

export type TranslationKey = keyof typeof ptBR;