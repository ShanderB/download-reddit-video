// Adiciona um listener para o clique no ícone da extensão
chrome.browserAction.onClicked.addListener(function (tab) {
    // Verifica se a URL é do Reddit
    if (!tab.url.includes("reddit.com")) {
        return;
    }
    // Codifica a URL da aba atual
    const url = encodeURIComponent(tab.url);
    // Monta a URL de redirecionamento para o Rapidsave
    const redirectUrl = `https://rapidsave.com/info?url=${url}`;
    // Abre uma nova aba com a URL do Rapidsave
    chrome.tabs.create({ url: redirectUrl }, function (newTab) {
        // Adiciona um listener para detectar quando a nova aba terminar de carregar
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            // Verifica se é a aba correta e se o carregamento foi concluído
            if (tabId === newTab.id && info.status === 'complete') {
                // Remove o listener para evitar execuções múltiplas
                chrome.tabs.onUpdated.removeListener(listener);
                // Injeta um script na página para clicar automaticamente no botão de download
                chrome.tabs.executeScript(newTab.id, {
                    code: `
                        var btn = document.getElementsByClassName("downloadbutton")[0];
                        if(btn) btn.click();
                    `
                });
            }
        });
    });
});