/**
 * Script de correção para problemas de localStorage e toLocaleString
 * Este script deve ser carregado ANTES do arquivo principal do React
 */

(function() {
    'use strict';
    
    console.log('Iniciando correção de localStorage e toLocaleString...');
    
    // Garante que Number.prototype.toLocaleString é sobrescrito antes de qualquer outro script
    const originalNumberToLocaleString = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function(...args) {
        if (this === null || this === undefined || isNaN(this) || !isFinite(this)) {
            console.warn('Tentativa de chamar toLocaleString em valor inválido:', this);
            return '0'; // Retorna um valor padrão para evitar o erro
        }
        try {
            return originalNumberToLocaleString.apply(this, args);
        } catch (e) {
            console.error('Erro ao formatar número com toLocaleString:', e, 'Valor:', this);
            return '0'; // Fallback em caso de erro inesperado na formatação
        }
    };

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
                    const parsedData = JSON.parse(data);
                    
                    // Verifica se há valores inválidos (NaN, Infinity) em números
                    let hasInvalidNumbers = false;
                    function checkInvalidNumbers(obj) {
                        if (Array.isArray(obj)) {
                            obj.forEach(item => checkInvalidNumbers(item));
                        } else if (typeof obj === 'object' && obj !== null) {
                            for (let prop in obj) {
                                if (typeof obj[prop] === 'number' && (isNaN(obj[prop]) || !isFinite(obj[prop]))) {
                                    hasInvalidNumbers = true;
                                    console.warn(`Valor numérico inválido encontrado para a chave ${key}, propriedade ${prop}:`, obj[prop]);
                                }
                                checkInvalidNumbers(obj[prop]); // Recursão para objetos aninhados
                            }
                        }
                    }
                    checkInvalidNumbers(parsedData);

                    if (hasInvalidNumbers) {
                        console.warn(`Dados corrompidos detectados para a chave: ${key}. Limpando...`);
                        localStorage.removeItem(key); // Remove dados corrompidos
                    }
                }
            } catch (error) {
                console.error(`Erro ao processar dados do localStorage para a chave ${key}:`, error);
                console.log(`Removendo dados corrompidos para a chave: ${key}`);
                localStorage.removeItem(key);
            }
        });
    }
    
    // Sobrescreve o localStorage.setItem para validar dados antes de salvar
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        try {
            // Tenta fazer parse para validar se é JSON válido e se não contém números inválidos
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                const parsed = JSON.parse(value);
                
                function containsInvalidNumbers(obj) {
                    if (Array.isArray(obj)) {
                        return obj.some(item => containsInvalidNumbers(item));
                    } else if (typeof obj === 'object' && obj !== null) {
                        return Object.values(obj).some(val => containsInvalidNumbers(val));
                    } else if (typeof obj === 'number') {
                        return isNaN(obj) || !isFinite(obj);
                    }
                    return false;
                }
                
                if (containsInvalidNumbers(parsed)) {
                    console.error('Tentativa de salvar dados com números inválidos. Salvamento abortado para chave:', key, 'Valor:', parsed);
                    return; // Não salva dados inválidos
                }
            }
            
            return originalSetItem.call(this, key, value);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error, 'Chave:', key, 'Valor:', value);
        }
    };
    
    // Executa a limpeza inicial
    validateAndCleanLocalStorage();
    
    console.log('Correção de localStorage e toLocaleString aplicada com sucesso!');
})();

