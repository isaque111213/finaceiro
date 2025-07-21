/**
 * Script de correção para problemas de localStorage
 * Este script deve ser carregado ANTES do arquivo principal do React
 */

(function() {
    'use strict';
    
    console.log('Iniciando correção de localStorage...');
    
    // Função para validar e limpar dados corrompidos do localStorage
    function validateAndCleanLocalStorage() {
        const keysToCheck = [
            'finances', 'transactions', 'financial-data', 'user-data', 
            'app-data', 'control-financeiro', 'receitas', 'despesas'
        ];
        
        keysToCheck.forEach(key => {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    // Tenta fazer parse dos dados
                    const parsedData = JSON.parse(data);
                    
                    // Se os dados contêm arrays, verifica se há valores inválidos
                    if (Array.isArray(parsedData)) {
                        const cleanedData = parsedData.filter(item => {
                            if (typeof item === 'object' && item !== null) {
                                // Verifica se há propriedades numéricas inválidas
                                for (let prop in item) {
                                    if (typeof item[prop] === 'number' && (isNaN(item[prop]) || !isFinite(item[prop]))) {
                                        console.warn(`Removendo item com valor inválido para ${prop}:`, item[prop]);
                                        return false;
                                    }
                                }
                                return true;
                            }
                            return typeof item !== 'undefined' && item !== null;
                        });
                        
                        if (cleanedData.length !== parsedData.length) {
                            console.log(`Limpando dados corrompidos para a chave: ${key}`);
                            localStorage.setItem(key, JSON.stringify(cleanedData));
                        }
                    } else if (typeof parsedData === 'object' && parsedData !== null) {
                        // Se é um objeto, verifica propriedades numéricas
                        let hasInvalidData = false;
                        const cleanedData = { ...parsedData };
                        
                        for (let prop in cleanedData) {
                            if (typeof cleanedData[prop] === 'number' && (isNaN(cleanedData[prop]) || !isFinite(cleanedData[prop]))) {
                                console.warn(`Removendo propriedade inválida ${prop}:`, cleanedData[prop]);
                                delete cleanedData[prop];
                                hasInvalidData = true;
                            }
                        }
                        
                        if (hasInvalidData) {
                            localStorage.setItem(key, JSON.stringify(cleanedData));
                        }
                    }
                }
            } catch (error) {
                console.error(`Erro ao processar dados do localStorage para a chave ${key}:`, error);
                console.log(`Removendo dados corrompidos para a chave: ${key}`);
                localStorage.removeItem(key);
            }
        });
    }
    
    // Sobrescreve o Number.prototype.toLocaleString para ser mais defensivo
    const originalToLocaleString = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function(...args) {
        if (this === null || this === undefined || isNaN(this) || !isFinite(this)) {
            console.warn('Tentativa de chamar toLocaleString em valor inválido:', this);
            return '0';
        }
        return originalToLocaleString.apply(this, args);
    };
    
    // Sobrescreve o localStorage.setItem para validar dados antes de salvar
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        try {
            // Tenta fazer parse para validar se é JSON válido
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                const parsed = JSON.parse(value);
                
                // Valida se há números inválidos no objeto/array
                function hasInvalidNumbers(obj) {
                    if (Array.isArray(obj)) {
                        return obj.some(item => hasInvalidNumbers(item));
                    } else if (typeof obj === 'object' && obj !== null) {
                        return Object.values(obj).some(val => hasInvalidNumbers(val));
                    } else if (typeof obj === 'number') {
                        return isNaN(obj) || !isFinite(obj);
                    }
                    return false;
                }
                
                if (hasInvalidNumbers(parsed)) {
                    console.error('Tentativa de salvar dados com números inválidos:', parsed);
                    return; // Não salva dados inválidos
                }
            }
            
            return originalSetItem.call(this, key, value);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    };
    
    // Executa a limpeza inicial
    validateAndCleanLocalStorage();
    
    console.log('Correção de localStorage aplicada com sucesso!');
})();

