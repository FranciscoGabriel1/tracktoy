export type Sale = { data: string; valor: number };
export type Client = {
  name: string;
  email: string;
  birth: string;
  sales: Sale[];
};

export const getSalesPerDay = (clients: Client[]) => {
  const dayTotals: Record<string, number> = {};
  clients.forEach(client => {
    client.sales.forEach(sale => {
      dayTotals[sale.data] = (dayTotals[sale.data] || 0) + sale.valor;
    });
  });
  const days = Object.keys(dayTotals).sort();
  return {
    labels: days,
    data: days.map(day => dayTotals[day]),
  };
};

export const getTopClients = (clients: Client[]) => {
  let topVolume = { name: "-", total: 0 };
  let topAvg = { name: "-", avg: 0 };
  let topFreq = { name: "-", freq: 0 };

  clients.forEach(client => {
    const total = client.sales.reduce((sum, s) => sum + s.valor, 0);
    const avg = client.sales.length ? total / client.sales.length : 0;
    const freq = new Set(client.sales.map(s => s.data)).size;
    if (total > topVolume.total) topVolume = { name: client.name, total };
    if (avg > topAvg.avg) topAvg = { name: client.name, avg };
    if (freq > topFreq.freq) topFreq = { name: client.name, freq };
  });

  return { topVolume, topAvg, topFreq };
};
