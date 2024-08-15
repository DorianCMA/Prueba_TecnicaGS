import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { HfInference } from "@huggingface/inference";
import stopwords from "stopwords-es";
import Estadisticas from "../view/Estadisticas";
import {
  uniqueEmojis,
  uniqueHashtags,
  uniqueMentions,
} from "../Components/utils";

// Instancia de la API de Hugging Face para análisis de sentimientos
const hf = new HfInference("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");

function Home() {
  // Estados para manejar datos y carga de archivos
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [dataQt] = useState(15); // Cantidad de datos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [allUsers, setAllUsers] = useState([]); // Todos los datos de usuarios
  const indexFin = currentPage * dataQt;
  const indexIni = indexFin - dataQt;
  const nPages = Math.ceil(allUsers.length / dataQt); // Número total de páginas
  const [analysisResults, setAnalysisResults] = useState(null); // Resultados del análisis

  // Efecto para cargar datos almacenados en el localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("uploadedData");
    const storedAnalysisResults = localStorage.getItem("analysisResults");

    if (storedData) {
      const data = JSON.parse(storedData);
      setAllUsers(data);
      setData(data.slice(indexIni, indexFin)); // Inicializa los datos con los elementos de la página actual
      setHasUploadedFile(true);
    }

    if (storedAnalysisResults) {
      setAnalysisResults(JSON.parse(storedAnalysisResults));
    }
  }, [indexIni, indexFin]);

  // Función para cambiar a la siguiente página
  const handleNextPage = () => {
    if (currentPage < nPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Función para cambiar a la página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Función para analizar los sentimientos en lotes de datos
  const analyzeSentiments = async (items) => {
    const batchSize = 5; // Tamaño del lote para solicitudes a la API
    const sentimentPromises = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(async (item) => {
        try {
          // Análisis con el primer modelo (Emotion Analysis)
          const emotionSentiment = await hf.textClassification({
            model: "finiteautomata/beto-emotion-analysis",
            inputs: item.text,
          });
          // Análisis con el segundo modelo (Sentiment Analysis)
          const sentimentAnalysis = await hf.textClassification({
            model: "finiteautomata/beto-sentiment-analysis",
            inputs: item.text,
          });

          // Actualiza el item con los resultados de ambos modelos
          item.emotionSentiment = emotionSentiment[0].label;
          item.sentimentAnalysis = sentimentAnalysis[0].label;
          return item;
        } catch (error) {
          console.error(
            "Error al analizar el sentimiento para",
            item.text,
            ":",
            error
          );
          return item; // Retorna el item incluso si hay un error
        }
      });

      sentimentPromises.push(...batchPromises);

      // Espera el procesamiento de cada lote antes de iniciar el siguiente
      await Promise.all(batchPromises);
    }

    return Promise.all(sentimentPromises);
  };

  // Función para manejar la carga del archivo CSV
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        // Leer el archivo CSV como texto
        const csvData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        // Parsear el CSV usando PapaParse
        const results = Papa.parse(csvData, { header: true });
        const processedData = results.data;

        // Analizar solo los ítems de la página actual
        const pageItems = processedData.slice(indexIni, indexFin);
        const dataWithSentiments = await analyzeSentiments(pageItems);

        // Realizar análisis adicionales
        console.log("Llamando a analyzeText con datos:", dataWithSentiments);
        const analysisResults = analyzeText(dataWithSentiments);
        console.log(
          "Resultados del análisis después de manejar el archivo:",
          analysisResults
        );

        // Actualizar el conjunto completo de datos con sentimientos analizados
        const updatedAllUsers = [...processedData];
        dataWithSentiments.forEach((item, i) => {
          updatedAllUsers[indexIni + i] = item;
        });

        setData(dataWithSentiments);
        setAllUsers(updatedAllUsers);
        localStorage.setItem("uploadedData", JSON.stringify(updatedAllUsers));
        setHasUploadedFile(true);
        setAnalysisResults(analysisResults); // Guardar el resultado del análisis adicional
        localStorage.setItem(
          "analysisResults",
          JSON.stringify(analysisResults)
        ); // Guardar resultados en localStorage
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para eliminar el archivo y limpiar los datos
  const handleDeleteFile = () => {
    localStorage.removeItem("uploadedData");
    localStorage.removeItem("analysisResults"); // Eliminar también los resultados del análisis
    setHasUploadedFile(false);
    setData([]);
    setAllUsers([]);
    setAnalysisResults(null); // Limpiar resultados del análisis
    location.reload(); // Recargar la página para aplicar los cambios
  };

  // Función para ir a la última página
  const handleGoToLastPage = () => {
    if (currentPage < nPages) {
      setCurrentPage(nPages);
    }
  };

  // Función para ir a la primera página
  const handleGoToFirstPage = () => {
    setCurrentPage(1);
  };

  // Efecto para volver a analizar los sentimientos al cambiar de página
  useEffect(() => {
    if (hasUploadedFile) {
      // Reanalizar sentimientos al cambiar de página
      const pageItems = allUsers.slice(indexIni, indexFin);
      analyzeSentiments(pageItems).then((dataWithSentiments) => {
        setData(dataWithSentiments);
      });
    }
  }, [currentPage]);

  // Función para analizar el texto y obtener estadísticas
  const analyzeText = (data) => {
    const wordCounts = {};
    const emojiCounts = {};
    const hashtagCounts = {};
    const mentionCounts = {};
    let maxInteraction = { text: "", interactions: 0 };

    data.forEach((item) => {
      const text = item.text.toLowerCase();
      const words = text
        .split(/\s+/)
        .filter((word) => !stopwords.includes(word));

      // Contar palabras
      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

      // Contar emojis
      uniqueEmojis(text).forEach((emoji) => {
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
      });

      // Contar hashtags
      uniqueHashtags(text).forEach((hashtag) => {
        hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
      });

      // Contar menciones
      uniqueMentions(text).forEach((mention) => {
        mentionCounts[mention] = (mentionCounts[mention] || 0) + 1;
      });

      // Determinar la publicación con mayor interacción
      const interactions =
        parseInt(item.likes) +
        parseInt(item.comments) +
        parseInt(item.shares) +
        parseInt(item.reactions_count);
      if (interactions > maxInteraction.interactions) {
        maxInteraction = { text: item.text, interactions };
      }
    });

    // Filtrar palabras que aparecen solo una vez
    const filteredWordCounts = Object.fromEntries(
      Object.entries(wordCounts).filter(([_, count]) => count > 1)
    );

    const results = {
      wordCounts: filteredWordCounts,
      emojiCounts,
      hashtagCounts,
      mentionCounts,
      maxInteraction,
    };
    console.log("Resultados del análisis:", results);
    return results;
  };
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <label
        htmlFor="fileInput"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        Seleccionar archivo
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute left-0 top-0 w-full h-[0px] opacity-0 cursor-pointer"
        />
      </label>
      {hasUploadedFile && (
        <button
          onClick={handleDeleteFile}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Eliminar Archivo
        </button>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Texto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Likes
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Comments
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Shares
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Reactions Count
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Emociones
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sentimiento (Sentiment)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {item.text}
                    </th>
                    <td className="px-6 py-4">{item.likes}</td>
                    <td className="px-6 py-4">{item.comments}</td>
                    <td className="px-6 py-4">{item.shares}</td>
                    <td className="px-6 py-4">{item.reactions_count}</td>
                    <td className="px-6 py-4">
                      {item.emotionSentiment || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {item.sentimentAnalysis || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleGoToFirstPage}
              className={`${
                currentPage === 1 ? "hidden" : ""
              } bg-blue-500 text-white text-sm py-2 px-4 rounded mr-2`}
            >
              Primera
            </button>
            <button
              onClick={handlePrevPage}
              className={`${
                currentPage === 1 ? "hidden" : ""
              } bg-blue-500 text-white text-sm py-2 px-4 rounded mr-2`}
            >
              Anterior
            </button>
            <span className="text-sm py-2 px-4">
              Página {currentPage} de {nPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`${
                currentPage === nPages ? "hidden" : ""
              } bg-blue-500 text-white text-sm py-2 px-4 rounded mr-2`}
            >
              Siguiente
            </button>
            <button
              onClick={handleGoToLastPage}
              className={`${
                currentPage === nPages ? "hidden" : ""
              } bg-blue-500 text-white text-sm py-2 px-4 rounded`}
            >
              Última
            </button>
          </div>
          {analysisResults && <Estadisticas results={analysisResults} />}
        </div>
      )}
    </div>
  );
}

export default Home;
