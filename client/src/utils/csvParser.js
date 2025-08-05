import Papa from 'papaparse';

export const parseCSVData = (csvText) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const loadCSVFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return await parseCSVData(csvText);
  } catch (error) {
    throw new Error(`Failed to load CSV file: ${error.message}`);
  }
};

export const processDataForCharts = (data) => {
  if (!data || data.length === 0) return null;

  const processedData = {};

  // Extract numeric columns
  const numericColumns = [];
  const textColumns = [];
  const dateColumns = [];

  const firstRow = data[0];
  Object.keys(firstRow).forEach(key => {
    const value = firstRow[key];
    if (typeof value === 'number') {
      numericColumns.push(key);
    } else if (typeof value === 'string') {
      if (Date.parse(value)) {
        dateColumns.push(key);
      } else {
        textColumns.push(key);
      }
    }
  });

  processedData.columns = {
    numeric: numericColumns,
    text: textColumns,
    date: dateColumns
  };

  // Process data for different chart types
  processedData.barChart = prepareBarChartData(data, textColumns[0], numericColumns[0]);
  processedData.pieChart = preparePieChartData(data, textColumns[1] || textColumns[0]);
  processedData.lineChart = prepareLineChartData(data, dateColumns[0], numericColumns[0]);
  processedData.scatterChart = prepareScatterChartData(data, numericColumns[0], numericColumns[1]);
  processedData.globeData = prepareGlobeData(data);
  processedData.scoreCard = prepareScoreCardData(data, numericColumns);
  processedData.horizontalBarChart = prepareHorizontalBarChartData(data, textColumns[0], numericColumns[1] || numericColumns[0]);

  return processedData;
};

const prepareBarChartData = (data, labelColumn, valueColumn) => {
  if (!labelColumn || !valueColumn) return null;
  
  const aggregated = data.reduce((acc, row) => {
    const label = row[labelColumn];
    const value = row[valueColumn] || 0;
    acc[label] = (acc[label] || 0) + value;
    return acc;
  }, {});

  return {
    labels: Object.keys(aggregated),
    datasets: [{
      label: valueColumn,
      data: Object.values(aggregated),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
};

const preparePieChartData = (data, categoryColumn) => {
  if (!categoryColumn) return null;
  
  const counts = data.reduce((acc, row) => {
    const category = row[categoryColumn];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(counts),
    datasets: [{
      data: Object.values(counts),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ]
    }]
  };
};

const prepareLineChartData = (data, dateColumn, valueColumn) => {
  if (!dateColumn || !valueColumn) return null;
  
  const sortedData = data
    .filter(row => row[dateColumn] && row[valueColumn])
    .sort((a, b) => new Date(a[dateColumn]) - new Date(b[dateColumn]));

  return {
    labels: sortedData.map(row => new Date(row[dateColumn]).toLocaleDateString()),
    datasets: [{
      label: valueColumn,
      data: sortedData.map(row => row[valueColumn]),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  };
};

const prepareScatterChartData = (data, xColumn, yColumn) => {
  if (!xColumn || !yColumn) return null;
  
  const scatterData = data
    .filter(row => row[xColumn] !== null && row[yColumn] !== null)
    .map(row => ({
      x: row[xColumn],
      y: row[yColumn]
    }));

  return {
    datasets: [{
      label: `${yColumn} vs ${xColumn}`,
      data: scatterData,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
    }]
  };
};

const prepareGlobeData = (data) => {
  return data
    .filter(row => row.latitude && row.longitude)
    .map(row => ({
      lat: row.latitude,
      lng: row.longitude,
      label: row.name || row.city || 'Location',
      value: row.revenue || row.score || 1,
      color: getColorByValue(row.revenue || row.score || 1)
    }));
};

const prepareScoreCardData = (data, numericColumns) => {
  const metrics = {};
  
  numericColumns.forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
    if (values.length > 0) {
      metrics[column] = {
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        total: values.reduce((sum, val) => sum + val, 0),
        count: values.length,
        max: Math.max(...values),
        min: Math.min(...values)
      };
    }
  });
  
  return metrics;
};

const prepareHorizontalBarChartData = (data, labelColumn, valueColumn) => {
  if (!labelColumn || !valueColumn) return null;
  
  const aggregated = data.reduce((acc, row) => {
    const label = row[labelColumn];
    const value = row[valueColumn] || 0;
    acc[label] = (acc[label] || 0) + value;
    return acc;
  }, {});

  return {
    labels: Object.keys(aggregated),
    datasets: [{
      label: valueColumn,
      data: Object.values(aggregated),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };
};

const getColorByValue = (value) => {
  if (value > 2000000) return '#ff0000'; // Red for high values
  if (value > 1000000) return '#ff8800'; // Orange for medium values
  return '#00ff00'; // Green for low values
};

export default {
  parseCSVData,
  loadCSVFile,
  processDataForCharts
};