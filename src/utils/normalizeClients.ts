type Sale = { data: string; valor: number };
type Client = {
  name: string;
  email: string;
  birth: string;
  sales: Sale[];
};

export function normalizeClients(apiData: any): Client[] {
  const list = apiData?.data?.clientes ?? [];
  return list.map((client: any) => ({
    name: client.info?.nomeCompleto ?? "",
    email: client.info?.detalhes?.email ?? "",
    birth: client.info?.detalhes?.nascimento ?? "",
    sales: client.estatisticas?.vendas ?? [],
  }));
}
