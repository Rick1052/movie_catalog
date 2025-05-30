import React from 'react';

export default function Footer() {
  const apiName = 'The Movie DB';
  const creationDate = '30 de maio de 2025';
  const creators = ['Henrique Santos', 'Rhayanna Tonete'];

  return (
    <footer className="bg-gray-800 text-gray-300 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <img
            src="/assets/image/logoTmdb.svg" 
            alt="Logo da API"
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg">{apiName}</span>
        </div>

        {/* Informações à direita ou abaixo em telas pequenas */}
        <div className="text-sm text-right mt-2 sm:mt-0">
          <p className="mb-1">Criado em: {creationDate}</p>
          <p>Desenvolvido por: {creators.join(' e ')}</p>
        </div>
      </div>
    </footer>
  );
}
