import React from 'react';

function Estadisticas({ results }) {
  if (!results) {
    return <div>No hay resultados disponibles.</div>;
  }

  const {
    wordCounts = {},
    emojiCounts = {},
    hashtagCounts = {},
    mentionCounts = {},
    maxInteraction = { text: 'Sin datos', interactions: 0 }
  } = results;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Palabras más usadas:</h3>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Palabra</th>
              <th className="px-6 py-3">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(wordCounts).map(([word, count]) => (
              <tr key={word} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{word}</td>
                <td className="px-6 py-4">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Hashtags más usados:</h3>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Hashtag</th>
              <th className="px-6 py-3">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(hashtagCounts).map(([hashtag, count]) => (
              <tr key={hashtag} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{hashtag}</td>
                <td className="px-6 py-4">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Menciones más usadas:</h3>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Mención</th>
              <th className="px-6 py-3">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(mentionCounts).map(([mention, count]) => (
              <tr key={mention} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{mention}</td>
                <td className="px-6 py-4">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Publicación con mayor interacción:</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm">
          <p className="font-medium text-gray-900 dark:text-white">{maxInteraction.text}</p>
          <p className='font-bold text-gray-900 dark:text-gray-400' >Interacciones: {maxInteraction.interactions}</p>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
