export class CurrencyUtil {
  static formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  static parseBRL(value: string): number {
    const numericValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(numericValue) || 0;
  }

  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  static formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('pt-BR');
  }
}
